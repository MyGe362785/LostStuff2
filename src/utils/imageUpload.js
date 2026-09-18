// The `loststuff-images` bucket only accepts these types, up to 5 MB.
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
// Phone photos are far larger than a listing needs; this keeps uploads quick.
const MAX_DIMENSION = 1600
const OUTPUT_QUALITY = 0.82

export class ImageUploadError extends Error {
  constructor(code) {
    super(code)
    this.name = 'ImageUploadError'
    this.code = code // 'not_image' | 'unsupported' | 'too_large'
  }
}

async function decodeImage(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
      return { source: bitmap, release: () => bitmap.close() }
    } catch {
      // Fall through to <img>, which decodes a few formats createImageBitmap rejects.
    }
  }
  const url = URL.createObjectURL(file)
  const img = new Image()
  img.src = url
  try {
    await img.decode()
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }
  return { source: img, release: () => URL.revokeObjectURL(url) }
}

function canvasToBlob(canvas, type) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, OUTPUT_QUALITY))
}

/**
 * Turn whatever the user picked into a file the bucket accepts, before any
 * report is created. Small JPEG/PNG/WebP files pass through untouched; other
 * images are scaled down and re-encoded as WebP (JPEG where WebP encoding is
 * unavailable).
 * @param {File} file
 * @returns {Promise<File>}
 */
export async function prepareImageForUpload(file) {
  if (!file || !file.type.startsWith('image/')) throw new ImageUploadError('not_image')

  let decoded
  try {
    decoded = await decodeImage(file)
  } catch {
    // Typically HEIC/HEIF outside Safari.
    throw new ImageUploadError('unsupported')
  }

  const { source, release } = decoded
  try {
    const scale = Math.min(1, MAX_DIMENSION / Math.max(source.width, source.height))
    if (scale === 1 && ACCEPTED_TYPES.includes(file.type) && file.size <= MAX_UPLOAD_BYTES) {
      return file
    }

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(source.width * scale))
    canvas.height = Math.max(1, Math.round(source.height * scale))
    const context = canvas.getContext('2d')
    // JPEG has no alpha channel, so give transparent PNGs a white background.
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(source, 0, 0, canvas.width, canvas.height)

    let blob = await canvasToBlob(canvas, 'image/webp')
    if (!blob || blob.type !== 'image/webp') blob = await canvasToBlob(canvas, 'image/jpeg')
    if (!blob || blob.size > MAX_UPLOAD_BYTES) throw new ImageUploadError('too_large')

    const extension = blob.type === 'image/webp' ? 'webp' : 'jpg'
    const baseName = file.name.replace(/\.[^.]+$/, '') || 'photo'
    return new File([blob], `${baseName}.${extension}`, { type: blob.type })
  } finally {
    release()
  }
}
