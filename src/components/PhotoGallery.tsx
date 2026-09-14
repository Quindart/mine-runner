import { useState } from 'react';

/**
 * PhotoGallery Component
 * Displays a grid of photo thumbnails with fullscreen modal
 *
 * Props:
 * - photos: [{id, blob}, ...] - Array of photo objects with blob data
 */
export function PhotoGallery({ photos = [] }) {
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="photo-empty-state" style={{ textAlign: 'center', padding: '2rem' }}>
        No photos
      </div>
    );
  }

  const selectedPhoto = selectedPhotoId
    ? photos.find((p) => p.id === selectedPhotoId)
    : null;

  const handleCloseModal = () => {
    setSelectedPhotoId(null);
  };

  return (
    <div className="photo-gallery">
      {/* Photo Grid */}
      <div
        className="photo-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '8px',
          marginBottom: '1rem',
        }}
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="photo-thumbnail"
            onClick={() => setSelectedPhotoId(photo.id)}
            style={{
              cursor: 'pointer',
              backgroundColor: '#e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden',
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {photo.blob && (
              <img
                src={URL.createObjectURL(photo.blob)}
                alt={`Photo ${photo.id}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {selectedPhoto && selectedPhoto.blob && (
        <div
          className="photo-modal"
          onClick={handleCloseModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src={URL.createObjectURL(selectedPhoto.blob)}
              alt={`Photo ${selectedPhoto.id}`}
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                borderRadius: '8px',
                objectFit: 'contain',
              }}
              onClick={handleCloseModal}
            />
            <div
              style={{
                marginTop: '1rem',
                color: 'white',
                fontSize: '0.875rem',
              }}
            >
              Click to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
