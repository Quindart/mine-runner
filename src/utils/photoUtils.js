/**
 * Photo Utility Functions
 * Provides image compression and sizing utilities
 */

/**
 * Compress an image blob to fit max dimensions and reduce quality
 * @param {Blob} blob - Image blob to compress
 * @param {number} maxWidth - Maximum width in pixels (default 1280)
 * @param {number} maxHeight - Maximum height in pixels (default 720)
 * @returns {Promise<Blob>} Compressed image blob in JPEG format
 */
export async function compressImage(
  blob,
  maxWidth = 1280,
  maxHeight = 720
) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions preserving aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;

          if (width > maxWidth) {
            width = maxWidth;
            height = Math.round(width / aspectRatio);
          }

          if (height > maxHeight) {
            height = maxHeight;
            width = Math.round(height * aspectRatio);
          }
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG blob at 80% quality
        canvas.toBlob(
          (compressedBlob) => {
            resolve(compressedBlob);
          },
          'image/jpeg',
          0.8
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read blob'));
    };

    reader.readAsDataURL(blob);
  });
}

/**
 * Get blob size in megabytes
 * @param {Blob} blob - Blob to measure
 * @returns {number} Size in MB, rounded to 2 decimals
 */
export function getBlobSizeMB(blob) {
  const sizeInBytes = blob.size;
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return Math.round(sizeInMB * 100) / 100;
}
