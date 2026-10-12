const cloudinary = require('cloudinary').v2;

/**
 * Checks whether Cloudinary environment variables are configured.
 * @returns {boolean}
 */
const isCloudinaryConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads a buffer to Cloudinary or falls back to a Data URI.
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - e.g. 'image/jpeg', 'image/png', 'image/webp'
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<{ url: string, provider: 'cloudinary' | 'mongodb_base64' }>}
 */
const uploadImageBuffer = async (buffer, mimetype, folder = 'smart-campus-hub/profiles') => {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto:good' }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result.secure_url, provider: 'cloudinary' });
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Safe production fallback: Convert buffer to data URI for direct persistence in MongoDB Atlas
  const base64Data = buffer.toString('base64');
  const dataUri = `data:${mimetype};base64,${base64Data}`;
  return { url: dataUri, provider: 'mongodb_base64' };
};

module.exports = {
  isCloudinaryConfigured,
  uploadImageBuffer,
};
