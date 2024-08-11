import http from '@/http'

const fetchFileList = (data = {}) => {
  return http('/api/oss/file/list', {
    method: 'POST',
    data,
  })
}

const userLogin = (data = {}) => {
  return http('/api/user/login', {
    method: 'POST',
    data,
  })
}

export { fetchFileList, userLogin }
