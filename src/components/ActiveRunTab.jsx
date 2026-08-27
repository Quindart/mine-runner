import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRunStore } from '../store/runStore';
import { useRunTracking } from '../hooks/useRunTracking';
import { formatDuration, formatPace } from '../utils/timeUtils';
import { calculateDistance, calculatePace, calculateCalories } from '../utils/gpsUtils';
import { compressImage } from '../utils/photoUtils';

/**
 * ActiveRunTab Component
 * Displays real-time run tracking with timer, stats, and photo capture
 */
export function ActiveRunTab() {
  const { currentRun, isRunning, startRun, stopRun, addPhotoToRun, storePhotoBlob } = useRunStore();
  const { elapsedSeconds, geoError } = useRunTracking();
  const [photoError, setPhotoError] = useState(null);
  const fileInputRef = useRef(null);

  // Calculate stats from current run and elapsed time
  const distance = calculateDistance(currentRun?.gpsTrack || []);
  const pace = calculatePace(distance, elapsedSeconds * 1000);
  const calories = calculateCalories(distance);

  /**
   * Handle photo capture
   * - Compress image
   * - Generate photoId
   * - Get last GPS point
   * - Add to run
   */
  const handlePhotoCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError(null);

    try {
      // Compress the image
      const compressedBlob = await compressImage(file);

      // Generate photo ID
      const photoId = uuidv4();

      // Get last GPS point from current run
      const gpsTrack = currentRun?.gpsTrack || [];
      if (gpsTrack.length === 0) {
        setPhotoError('No GPS data available. Photo not saved.');
        return;
      }

      const lastGpsPoint = gpsTrack[gpsTrack.length - 1];

      // Add photo to run
      addPhotoToRun(photoId, lastGpsPoint.lat, lastGpsPoint.lng, Date.now());

      // Store photo blob in state (automatically persisted by Zustand)
      try {
        storePhotoBlob(photoId, compressedBlob);
      } catch (storageError) {
        setPhotoError(`Photo storage failed: ${storageError.message}`);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setPhotoError(`Photo capture failed: ${error.message}`);
    }
  };

  /**
   * Trigger file input on "Take Photo" button click
   */
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="active-run-tab">
      {/* Timer Display */}
      <div className="timer-display">
        {formatDuration(elapsedSeconds)}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">Distance</div>
          <div className="stat-value">{distance.toFixed(2)} km</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Pace</div>
          <div className="stat-value">{formatPace(pace)}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Calories</div>
          <div className="stat-value">~{calories} kcal</div>
        </div>
      </div>

      {/* Error Messages */}
      {geoError && (
        <div className="error-message">
          GPS Error: {geoError}
        </div>
      )}
      {photoError && (
        <div className="error-message">
          {photoError}
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="btn-start"
          onClick={startRun}
          disabled={isRunning}
        >
          Start Run
        </button>
        <button
          className="btn-stop"
          onClick={stopRun}
          disabled={!isRunning}
        >
          Stop Run
        </button>
        <button
          className="btn-photo"
          onClick={handlePhotoClick}
          disabled={!isRunning}
        >
          Take Photo
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoCapture}
        style={{ display: 'none' }}
      />

      {/* Photo Strip */}
      <div className="photo-strip">
        <div className="photo-strip-header">
          Photos ({currentRun?.photos?.length || 0})
        </div>
        <div className="photo-grid">
          {currentRun?.photos && currentRun.photos.length > 0 ? (
            currentRun.photos.map((photoId) => (
              <div key={photoId} className="photo-thumbnail">
                📷
              </div>
            ))
          ) : (
            <div className="photo-empty-state">
              No photos yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
