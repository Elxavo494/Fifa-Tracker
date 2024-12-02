import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
  // First compress the image
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    
    // Convert to square format using canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Create a temporary image element
    const img = new Image();
    
    // Wait for image to load
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = URL.createObjectURL(compressedFile);
    });

    // Calculate the square crop dimensions
    const size = Math.min(img.width, img.height);
    
    // Set canvas size to our desired output size
    canvas.width = 400;
    canvas.height = 400;

    // Calculate crop position (center)
    const sx = (img.width - size) / 2;
    const sy = (img.height - size) / 2;

    // Draw the cropped and resized image
    ctx.drawImage(
      img,
      sx, sy,        // Source position (crop from center)
      size, size,    // Source dimensions (square crop)
      0, 0,          // Destination position
      400, 400       // Destination dimensions (square output)
    );

    // Clean up object URL
    URL.revokeObjectURL(img.src);

    // Convert canvas back to file
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, file.type, 0.9);
    });

    return new File([blob], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Image compression error:', error);
    throw error;
  }
}