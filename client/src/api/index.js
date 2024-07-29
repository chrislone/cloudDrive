import http from '@/http'

const fetchFileList = (data = {}) => {
  return http('/api/oss/file/list', {
    method: 'POST',
    data,
  })
}

export { fetchFileList }
