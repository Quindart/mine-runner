import { useState } from 'react';
import { useRunStore } from '../store/runStore';
import { formatDate, formatDuration, formatPace } from '../utils/timeUtils';
import { Map } from './Map';
import { PhotoGallery } from './PhotoGallery';

/**
 * RunDetail Component
 * Modal displaying full run details including map, stats, and photos
 *
 * Props:
 * - runId: string - The ID of the run to display
 * - onClose: function - Callback when modal is closed
 * - photos: optional - Array of {id, blob} photo objects
 */
export function RunDetail({ runId, onClose, photos = [] }) {
  const { allRuns, deleteRun } = useRunStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const run = allRuns.find((r) => r.id === runId);

  if (!run) {
    return (
      <div
        className="run-detail-modal"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            textAlign: 'center',
          }}
        >
          Run not found
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteRun(runId);
    onClose();
  };

  // Convert run.photos (array of photoIds) to photo objects
  const photoObjects = photos.filter((p) => run.photos.includes(p.id));

  return (
    <div
      className="run-detail-modal"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        padding: '1rem',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '95vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          {/* Header with Date */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
              }}
            >
              📍 {formatDate(run.startTime)}
            </h2>
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '0.875rem', color: '#666' }}>Distance</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {run.distance.toFixed(2)} km
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '0.875rem', color: '#666' }}>Duration</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {formatDuration(run.duration)}
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '0.875rem', color: '#666' }}>Pace</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {formatPace(run.pace)}
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '0.875rem', color: '#666' }}>Calories</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                ~{run.calories} kcal
              </div>
            </div>
          </div>

          {/* Map */}
          {run.gpsTrack && run.gpsTrack.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                }}
              >
                Route
              </h3>
              <Map
                gpsTrack={run.gpsTrack}
                photos={photoObjects.map((p) => ({
                  id: p.id,
                  lat: run.photos.indexOf(p.id) + 1,
                  lng: run.photos.indexOf(p.id) + 1,
                }))}
              />
            </div>
          )}

          {/* Photo Gallery */}
          {run.photos && run.photos.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                }}
              >
                Photos ({run.photos.length})
              </h3>
              <PhotoGallery photos={photoObjects} />
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1.5rem',
              borderTop: '1px solid #e0e0e0',
              paddingTop: '1.5rem',
            }}
          >
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: '#f5f5f5',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Close
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '1px solid #ff4444',
                backgroundColor: '#ffe4e4',
                color: '#cc0000',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              Delete Run
            </button>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: '#fff3cd',
                borderRadius: '8px',
                border: '1px solid #ffc107',
              }}
            >
              <p style={{ marginBottom: '1rem' }}>
                Are you sure you want to delete this run? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
