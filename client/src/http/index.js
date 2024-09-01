import axios from 'axios'
import { message } from 'antd'

const instance = axios.create({})

instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (axiosErrorInstance) => {
    handleErrors(axiosErrorInstance)
    return Promise.reject(axiosErrorInstance)
  },
)

const handleErrors = (r) => {
  const code = r.response?.status
  const msg = r.response?.data?.msg
  const errorList = r.response?.data?.errorList || []

  if (code >= 400 && code < 500) {
    if (code === 401) {
      window.location.replace('/login')
    }
    // 4xx 的错误信息有可能是由开发者定义的信息，需要优先提示 data.msg 字段的内容
    const errMsg = msg || errorList?.[0]?.message || '发生错误'
    message.error(errMsg, 3)
  } else if (code >= 500) {
    const errMsg = errorList?.[0].message || '发生错误'
    message.error(errMsg, 3)
  }
}

export default instance
