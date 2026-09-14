import { useState, useRef } from 'react';
// @ts-expect-error TS package types not available
import { v4 as uuidv4 } from 'uuid';
// @ts-expect-error JS module
import { useRunStore } from '../store/runStore';
// @ts-expect-error JS module
import { useRunTracking } from '../hooks/useRunTracking';
// @ts-expect-error JS module
import { formatDuration, formatPace } from '../utils/timeUtils';
// @ts-expect-error JS module
import { calculateDistance, calculatePace, calculateCalories } from '../utils/gpsUtils';
// @ts-expect-error JS module
import { compressImage } from '../utils/photoUtils';

/**
 * ActiveRunTab Component
 * Displays real-time run tracking with timer, stats, and photo capture
 */
export function ActiveRunTab() {
  const { currentRun, isRunning, startRun, stopRun, addPhotoToRun, storePhotoBlob } = useRunStore();
  const { elapsedSeconds, geoError } = useRunTracking();
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      } catch (storageError: any) {
        setPhotoError(`Photo storage failed: ${storageError.message}`);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
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
    <div className="w-full py-lg px-gutter">
      {/* Timer Display */}
      <div className="timer-display animate-fade-in">
        {formatDuration(elapsedSeconds)}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid mb-lg">
        <div className="stat-item">
          <div className="stat-label">Distance</div>
          <div className="stat-value">{distance.toFixed(2)}</div>
          <div className="text-body-md text-on-surface-variant">km</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Pace</div>
          <div className="stat-value">{formatPace(pace)}</div>
          <div className="text-body-md text-on-surface-variant">min/km</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Calories</div>
          <div className="stat-value">~{calories}</div>
          <div className="text-body-md text-on-surface-variant">kcal</div>
        </div>
      </div>

      {/* Error Messages */}
      {geoError && (
        <div className="error-message animate-slide-up">
          GPS Error: {geoError}
        </div>
      )}
      {photoError && (
        <div className="error-message animate-slide-up">
          Photo Error: {photoError}
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons mb-lg">
        <button
          className="btn btn-primary text-label-caps"
          onClick={startRun}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Start Run'}
        </button>
        <button
          className="btn btn-secondary text-label-caps"
          onClick={stopRun}
          disabled={!isRunning}
        >
          Stop Run
        </button>
        <button
          className="btn btn-primary text-label-caps"
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
      {currentRun?.photos && currentRun.photos.length > 0 && (
        <div className="mb-lg">
          <h3 className="text-body-md font-label-caps text-primary mb-md">
            PHOTOS IN THIS RUN ({currentRun.photos.length})
          </h3>
          <div className="photo-strip">
            {currentRun.photos.map((photoId: string) => (
              <div
                key={photoId}
                className="photo-thumb bg-surface-container-high border border-outline-variant flex items-center justify-center text-2xl"
              >
                📷
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
