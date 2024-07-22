import http from '@/http'

const fetchFileList = () => {
  return http('http://localhost:7001/oss/file/list', {
    method: 'POST',
  })
}

export { fetchFileList }
