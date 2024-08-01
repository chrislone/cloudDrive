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
  padding: 10,
  flex: 'auto',
  overflowY: 'auto',
  overflowX: 'hidden',
}

const footerStyle: React.CSSProperties = {
  padding: '10px 20px',
  lineHeight: 'normal',
  height: `${footerHeight}px`,
  backgroundColor: '#eee',
}

const layoutStyle: React.CSSProperties = {
  overflow: 'hidden',
  height: '100%',
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
