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
    <div className="w-full py-lg px-gutter">
      {/* Section Header */}
      <h2 className="text-headline-md text-primary mb-lg flex items-center gap-sm">
        My Running History
      </h2>

      {/* Empty State */}
      {sortedRuns.length === 0 ? (
        <div className="card level-2 text-center py-xl">
          <h3 className="text-body-lg text-on-surface mb-md">No Runs Yet</h3>
          <p className="text-body-md text-on-surface-variant">
            Start your first run to see it here!
          </p>
        </div>
      ) : (
        /* Run Cards Grid */
        <div className="flex flex-col gap-md">
          {sortedRuns.map((run, idx) => (
            <div
              key={run.id}
              onClick={() => handleRunClick(run.id)}
              className="run-card group animate-slide-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-md pb-md border-b border-outline-variant">
                <div>
                  <div className="text-headline-md text-on-surface font-semibold">
                    {formatDate(run.startTime)}
                  </div>
                </div>
                <div className="text-display-metrics font-display-metrics text-primary">
                  {run.distance.toFixed(1)}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-md">
                <div className="text-center">
                  <div className="text-label-caps text-on-surface-variant mb-xs">
                    Distance
                  </div>
                  <div className="text-stats-value text-on-surface font-stats-value">
                    {run.distance.toFixed(2)}
                  </div>
                  <div className="text-body-md text-on-surface-variant">km</div>
                </div>

                <div className="text-center">
                  <div className="text-label-caps text-on-surface-variant mb-xs">
                    Duration
                  </div>
                  <div className="text-stats-value text-on-surface font-stats-value">
                    {formatDuration(run.duration)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-label-caps text-on-surface-variant mb-xs">
                    Photos
                  </div>
                  <div className="text-stats-value text-primary font-stats-value">
                    {run.photos?.length || 0}
                  </div>
                </div>
              </div>

              {/* Hover Indicator */}
              <div className="mt-md pt-md border-t border-outline-variant opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-body-md text-primary font-semibold text-center">
                  Tap to view details
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
