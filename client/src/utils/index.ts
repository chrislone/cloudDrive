/**
 *
 * @param path
 */
function isDirectory(path: string): boolean {
  return /\/$/.test(path)
}

function isImage(url: string): boolean {
  return fileTypeMap.IMAGE === getFileType(url)
}

function isVideo(url: string): boolean {
  return fileTypeMap.VIDEO === getFileType(url)
}

export type FileTypeMapping = {
  VIDEO: number
  IMAGE: number
  DOCUMENT: number
  UNKNOWN: number
}

const fileTypeMap: FileTypeMapping = {
  VIDEO: 1,
  IMAGE: 2,
  DOCUMENT: 3,
  UNKNOWN: 4,
}

// 在路径之后增加斜杠 /
const appendSlash = (path: string): string => {
  const reg = /\/$/
  if (!path) {
    return ''
  }
  if (!reg.test(path)) {
    return path + '/'
  }
  return path
}

// 删除路径最后的斜杠 /
const deleteSlash = (path: string): string => {
  const reg = /\/$/
  if (reg.test(path)) {
    return path.replace(reg, '')
  }
  return path
}

function getFileType(filename: string): FileTypeMapping[keyof FileTypeMapping] {
  const extension = filename.substring(filename.lastIndexOf('.') + 1)
  const lowerExt = extension?.toLowerCase()
  switch (lowerExt) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return fileTypeMap.IMAGE
    case 'mp4':
    case 'avi':
    case 'mkv':
    case 'mov':
      return fileTypeMap.VIDEO
    case 'csv':
    case 'xls':
    case 'xlsx':
    case 'doc':
    case 'docx':
    case 'pdf':
      return fileTypeMap.DOCUMENT
    default:
      return fileTypeMap.UNKNOWN
  }
}

function doDownload(url: string, fileName: string) {
  const a = document.createElement('a')
  a.download = fileName
  a.href = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export {
  isDirectory,
  getFileType,
  fileTypeMap,
  isImage,
  isVideo,
  appendSlash,
  deleteSlash,
  doDownload,
}
