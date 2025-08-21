import { IMAGE_UPLOAD, ERROR_MESSAGES } from "./constants";

/**
 * Validates an image file against our requirements
 */
export function validateImageFile(file) {
  if (!file) {
    throw new Error("No file provided");
  }

  // Check file type
  if (!IMAGE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
    throw new Error(ERROR_MESSAGES.IMAGE_INVALID_TYPE);
  }

  // Check file size (before compression)
  if (file.size > IMAGE_UPLOAD.MAX_SIZE) {
    throw new Error(ERROR_MESSAGES.IMAGE_TOO_LARGE);
  }

  return true;
}

/**
 * Compresses an image file using HTML5 Canvas
 */
export function compressImage(file, options = {}) {
  return new Promise((resolve, reject) => {
    const {
      quality = IMAGE_UPLOAD.COMPRESSION_QUALITY,
      maxWidth = IMAGE_UPLOAD.MAX_WIDTH,
      maxHeight = IMAGE_UPLOAD.MAX_HEIGHT,
      outputFormat = "image/jpeg"
    } = options;

    // Create image element
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        const { width: newWidth, height: newHeight } = calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight
        );

        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw and compress image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new File object with original name
              const compressedFile = new File([blob], file.name, {
                type: outputFormat,
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            } else {
              reject(new Error("Image compression failed"));
            }
          },
          outputFormat,
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // Start the process
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
function calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
  let { width, height } = { width: originalWidth, height: originalHeight };

  // Only resize if image is larger than max dimensions
  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height;

    if (width > height) {
      width = maxWidth;
      height = width / aspectRatio;
    } else {
      height = maxHeight;
      width = height * aspectRatio;
    }
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Generate a unique filename for uploaded images
 */
export function generateImageFileName(userId, originalName) {
  const timestamp = Date.now();
  const extension = originalName.split(".").pop().toLowerCase();
  return `${userId}/${timestamp}.${extension}`;
}

/**
 * Process image file: validate, compress, and prepare for upload
 */
export async function processImageFile(file, userId, options = {}) {
  try {
    // Validate file
    validateImageFile(file);

    // Compress image
    const compressedFile = await compressImage(file, options);

    // Generate filename
    const fileName = generateImageFileName(userId, file.name);

    return {
      file: compressedFile,
      fileName,
      originalSize: file.size,
      compressedSize: compressedFile.size,
      compressionRatio: ((file.size - compressedFile.size) / file.size * 100).toFixed(1)
    };
  } catch (error) {
    throw error;
  }
}