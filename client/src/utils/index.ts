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

function getFileType(filename: string): number {
  const extension = filename.substring(filename.lastIndexOf('.') + 1)
  const lowerExt = extension?.toLowerCase()
  switch (lowerExt) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return fileTypeMap.IMAGE
    case 'mp4':
    case 'avi':
    case 'mkv':
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

export { isDirectory, getFileType, fileTypeMap, isImage }
