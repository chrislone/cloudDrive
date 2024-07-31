import { Flex, Layout, Image, Button, Upload, Space } from 'antd'
import {
  ArrowLeftOutlined,
  CloudUploadOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import './index.less'
import FileIcon from '@/components/Fileicon'
import { useEffect, useState } from 'react'
import { fetchFileList } from '@/api'
import { useNavigate, useParams } from 'react-router-dom'
import { isDirectory } from '@/utils'
import {
  contentStyle,
  layoutStyle,
  headerStyle,
  footerStyle,
  uploadFileProps,
  uploadDirectoryProps,
} from './data'

const { Header, Content, Footer } = Layout

interface IOSSFileItem {
  url: string
  name: string
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

function Home() {
  const [list, setList] = useState<IOSSFileItem[]>([])
  const [imagePreviewVisible, setImagePreviewVisible] = useState<boolean>(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('')
  const navigate = useNavigate()
  const params = useParams()
  const prefix = params['*'] as string

  function fetchList() {
    fetchFileList({
      prefix: appendSlash(prefix),
    }).then((res) => {
      setList(res.data)
    })
  }

  function handleFileIconClick(item: IOSSFileItem): void {
    const { url, name } = item

    if (isDirectory(name)) {
      navigate(`/${deleteSlash(name)}`)
      return
    }

    setPreviewImageUrl(url)
    setImagePreviewVisible(true)
  }

  function handleGoBack() {
    navigate(-1)
  }

  useEffect(() => {
    fetchList()
  }, [prefix])

  return (
    <>
      <Layout style={layoutStyle}>
        <Flex wrap vertical className="flex-wrap">
          <Header style={headerStyle}>
            <Space>
              <Button onClick={handleGoBack} icon={<ArrowLeftOutlined />}>
                后退
              </Button>
              <Upload {...uploadDirectoryProps}>
                <Button icon={<CloudUploadOutlined />}>上传文件夹</Button>
              </Upload>
            </Space>
          </Header>
          <Content style={contentStyle}>
            <div className="list">
              {list.map((item: IOSSFileItem, index: number) => {
                return (
                  <FileIcon
                    key={index}
                    name={item.name}
                    url={item.url}
                    onClick={() => {
                      handleFileIconClick(item)
                    }}
                  ></FileIcon>
                )
              })}
            </div>
          </Content>
          <Footer style={footerStyle}>
            <Upload {...uploadFileProps} className="file-uploader">
              <Button
                icon={<PlusOutlined />}
                autoInsertSpace={false}
                block
              ></Button>
            </Upload>
          </Footer>
        </Flex>
        <Image
          width={200}
          style={{ display: 'none' }}
          src={previewImageUrl}
          preview={{
            visible: imagePreviewVisible,
            scaleStep: 0.5,
            src: previewImageUrl,
            onVisibleChange: (value) => {
              setImagePreviewVisible(value)
            },
          }}
        />
      </Layout>
    </>
  )
}

export default Home
