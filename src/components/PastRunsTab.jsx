import { useState, useEffect } from 'react';
import { useRunStore } from '../store/runStore';
import { formatDate, formatDuration } from '../utils/timeUtils';
import { RunDetail } from './RunDetail';

/**
 * PastRunsTab Component
 * Displays list of past runs and allows viewing run details
 *
 * Props: None (uses store directly)
 */
export function PastRunsTab() {
  const { allRuns, selectedRunId, selectRun, getPhotoBlob } = useRunStore();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [photos, setPhotos] = useState({});

  // Load all photos from store when component mounts or allRuns changes
  useEffect(() => {
    const photoMap = {};
    allRuns.forEach((run) => {
      run.photos.forEach((photoId) => {
        const blob = getPhotoBlob(photoId);
        if (blob) {
          photoMap[photoId] = blob;
        }
      });
    });
    setPhotos(photoMap);
  }, [allRuns, getPhotoBlob]);

  // Sort runs by date (newest first)
  const sortedRuns = [...(allRuns || [])]
    .sort((a, b) => b.startTime - a.startTime);

  const selectedRun = selectedRunId
    ? allRuns.find((r) => r.id === selectedRunId)
    : null;

  const handleRunClick = (runId) => {
    selectRun(runId);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
  };

  return (
    <div className="past-runs-tab" style={{ padding: '2rem' }}>
      {/* Header */}
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
        }}
      >
        📍 My City
      </h2>

      {/* Empty State */}
      {sortedRuns.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: '#999',
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            🏃
          </div>
          <p>No runs yet</p>
          <p style={{ fontSize: '0.875rem' }}>
            Start a run to see it here
          </p>
        </div>
      ) : (
        /* Run Cards */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {sortedRuns.map((run) => (
            <div
              key={run.id}
              onClick={() => handleRunClick(run.id)}
              style={{
                backgroundColor: '#f9f9f9',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9f9f9';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{ marginBottom: '0.75rem' }}>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                >
                  📍 {formatDate(run.startTime)}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                  fontSize: '0.875rem',
                }}
              >
                <div>
                  <div style={{ color: '#999', marginBottom: '0.25rem' }}>
                    Distance
                  </div>
                  <div style={{ fontWeight: '600' }}>
                    {run.distance.toFixed(2)} km
                  </div>
                </div>
                <div>
                  <div style={{ color: '#999', marginBottom: '0.25rem' }}>
                    Duration
                  </div>
                  <div style={{ fontWeight: '600' }}>
                    {formatDuration(run.duration)}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#999', marginBottom: '0.25rem' }}>
                    Photos
                  </div>
                  <div style={{ fontWeight: '600' }}>
                    {run.photos?.length || 0} photo
                    {(run.photos?.length || 0) !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Run Detail Modal */}
      {showDetailModal && selectedRun && (
        <RunDetail
          runId={selectedRun.id}
          onClose={handleCloseDetail}
          photos={photos}
        />
      )}
    </div>
  );
}
