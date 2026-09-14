import { useState } from 'react';
// @ts-expect-error JS module
import { useRunStore } from '../store/runStore';
// @ts-expect-error JS module
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
interface IRunDetailProps {
  runId: string;
  onClose: () => void;
  photos?: { [photoId: string]: any };
}

export function RunDetail({ runId, onClose, photos = [] }: IRunDetailProps) {
  const { allRuns, deleteRun } = useRunStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const run = allRuns.find((r: any) => r.id === runId);

  if (!run) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-gutter"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-surface-container-high border border-outline-variant rounded-2xl p-lg max-w-md w-full text-center"
        >
          <p className="text-on-surface-variant">Run not found</p>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteRun(runId);
    onClose();
  };

  // Convert run.photos (array of photoIds) to photo objects with blobs
  const photoObjects = run.photos
    .map((photoId: string) => ({
      id: photoId,
      blob: photos[photoId],
    }))
    .filter((p: any): p is { id: string; blob: Blob } => !!p.blob);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-gutter overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-container border border-outline-variant rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto relative animate-slide-up"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-md right-md z-10 text-on-surface-variant hover:text-primary transition-colors text-xl w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>

        {/* Content */}
        <div className="p-lg">
          {/* Header with Date */}
          <div className="mb-lg pt-md">
            <h2 className="text-headline-lg text-primary font-headline-lg mb-md">
              {formatDate(run.startTime)}
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-md mb-lg">
            <div className="stat-item">
              <div className="stat-label">Distance</div>
              <div className="stat-value">{run.distance.toFixed(2)}</div>
              <div className="text-body-md text-on-surface-variant">km</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Duration</div>
              <div className="stat-value">{formatDuration(run.duration)}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Pace</div>
              <div className="stat-value">{formatPace(run.pace)}</div>
              <div className="text-body-md text-on-surface-variant">min/km</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Calories</div>
              <div className="stat-value">~{run.calories}</div>
              <div className="text-body-md text-on-surface-variant">kcal</div>
            </div>
          </div>

          {/* Map */}
          {run.gpsTrack && run.gpsTrack.length > 0 && (
            <div className="mb-lg">
              <h3 className="text-body-lg font-label-caps text-primary mb-md">
                ROUTE MAP
              </h3>
              <div className="bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant">
                <Map
                  gpsTrack={run.gpsTrack}
                  photos={[]}
                />
              </div>
            </div>
          )}

          {/* Photo Gallery */}
          {run.photos && run.photos.length > 0 && (
            <div className="mb-lg">
              <h3 className="text-body-lg font-label-caps text-primary mb-md">
                PHOTOS ({run.photos.length})
              </h3>
              <PhotoGallery photos={photoObjects} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-md mt-lg pt-lg border-t border-outline-variant">
            <button
              onClick={onClose}
              className="btn btn-secondary text-label-caps"
            >
              Close
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn bg-error bg-opacity-10 text-error border border-error border-opacity-30 hover:bg-opacity-20 text-label-caps"
            >
              Delete Run
            </button>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="mt-lg p-md bg-primary bg-opacity-10 border border-primary border-opacity-30 rounded-xl">
              <p className="text-on-surface mb-md text-body-md">
                Are you sure you want to delete this run? This action cannot be undone.
              </p>
              <div className="flex gap-md">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 btn btn-secondary text-label-caps"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 btn bg-error text-on-error hover:bg-opacity-90 text-label-caps"
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
