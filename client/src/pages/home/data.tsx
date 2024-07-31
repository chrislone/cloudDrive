import { UploadProps } from 'antd'

const headerHeight = 52
const footerHeight = 52

const headerStyle: React.CSSProperties = {
  padding: '10px 20px',
  height: `${headerHeight}px`,
  lineHeight: 'normal',
}

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: `calc(100% - 20px - ${headerHeight}px - ${footerHeight}px)`,
  lineHeight: '120px',
  color: '#fff',
  padding: 10,
  flex: 'auto',
}

const footerStyle: React.CSSProperties = {
  padding: '10px 20px',
  lineHeight: 'normal',
  height: `${footerHeight}px`,
}

const layoutStyle: React.CSSProperties = {
  overflow: 'hidden',
  padding: 10,
  height: '100vh',
}

const uploadFileProps: UploadProps = {
  showUploadList: false,
  beforeUpload() {
    return true
  },
  onChange() {},
  customRequest() {},
}

const uploadDirectoryProps: UploadProps = {
  showUploadList: false,
  beforeUpload() {
    return false
  },
  directory: true,
  accept: `.${'n'.repeat(10)}`,
  onChange() {},
  customRequest() {},
}

export {
  contentStyle,
  layoutStyle,
  headerStyle,
  footerStyle,
  uploadFileProps,
  uploadDirectoryProps,
}
