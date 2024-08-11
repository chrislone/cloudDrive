import { Flex, Layout, Image, Button, Upload, Space, Empty, Spin } from 'antd'
import {
  ArrowLeftOutlined,
  CloudUploadOutlined,
  PlusOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import './index.less'
import FileIcon from '@/components/Fileicon'
import { useEffect, useState } from 'react'
import { fetchFileList } from '@/api'
import { useNavigate, useParams } from 'react-router-dom'
import {
  isDirectory,
  appendSlash,
  deleteSlash,
  isImage,
  isVideo,
} from '@/utils'
import {
  contentStyle,
  layoutStyle,
  headerStyle,
  footerStyle,
  uploadFileProps,
  uploadDirectoryProps,
} from './data'
import {
  DownloadOutlined,
  SwapOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  ZoomOutOutlined,
  ZoomInOutlined,
  UndoOutlined,
} from '@ant-design/icons'

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmrl8BUYK6FJ7OeNDx9jPYaS+H
qRjT4fwR6s3OKb8Y9NtokQWCHBGelqIFunofHGCwqAf5HcomwRSWqCcKKxkn2sDg
iG9er/O+l4CMhaql36Mxt9O8q03QnGToe3a3wr4x2ir7dHMMK3NujTsZ1R6wUSd8
f3/Fq8okeQaffvn2LwIDAQAB
-----END PUBLIC KEY-----`

const privateKey = `-----BEGIN PRIVATE KEY-----
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAKauXwFRgroUns54
0PH2M9hpL4epGNPh/BHqzc4pvxj022iRBYIcEZ6WogW6eh8cYLCoB/kdyibBFJao
JworGSfawOCIb16v876XgIyFqqXfozG307yrTdCcZOh7drfCvjHaKvt0cwwrc26N
OxnVHrBRJ3x/f8WryiR5Bp9++fYvAgMBAAECgYEAgfsq5VlOK5RW/0ZiEr5fUd09
DnrEfL8XFlXYJnSRrIGN9G5bMEp5RwXK1dLE1ywHDtwKU69ybGRXjOEWiKxxUUtT
lyY9urvStqNUjgBSxiT73uihJPhi4CovDiI5GnhnU+XtCYnPKBr6ORfSn8I4DBZH
Prc+ue0sjR+o0FFhHakCQQDbl0pL5+GKr53Cgodc8HsY5NVgaccID5fmaOFF8ix/
a4D9VoXolvU4SoK7RIrgUJOTPvAga4NYC8WvPgs2eRRtAkEAwlFIFdg3Mhy6uKei
92I64wZfPoX/WP+8Or6ZmTuRZs74WKAGz5qziJmCpNZqyU6dOTxZvztIu/h23GM6
8en7iwJAJGvlgM2HFS+npPltZjbk0+4wjfs9bdLYSPkgVC+kvcWg8WQGdduD9MA3
CsSFnEsBDy0jOt1aPaJGOZi612AhyQJBAKcmL/HKeUA8AkoQuVg/QRRESO2Jairu
YMXPamSrHtnmsy3ZCcLO+hxIoF6WqmjbnNa9GR4sKta2Vdgh63Ropx0CQFqq98CZ
hqMBTgvd6pJfzJNd/BF8Or2G+ZTlXSyNzJNuuSA8Zn8V8dJJRqZvEIJO/tPF8CvI
4BGUnynmmrwW6AA=
-----END PRIVATE KEY-----`

const { Header, Content, Footer } = Layout

interface IOSSFileItem {
  url: string
  name: string
  currentName: string
}

function Home() {
  const [list, setList] = useState<IOSSFileItem[]>([])
  const [imagePreviewVisible, setImagePreviewVisible] = useState<boolean>(false)
  const [videoPreviewVisible, setVideoPreviewVisible] = useState<boolean>(false)
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string>('')
  const [previewObjectName, setPreviewObjectName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const params = useParams()
  const prefix = params['*'] as string

  function fetchList() {
    setLoading(true)
    fetchFileList({
      prefix: appendSlash(prefix),
    })
      .then((res) => {
        setList(res.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function handleFileIconClick(item: IOSSFileItem): void {
    const { url, name } = item

    if (isDirectory(name)) {
      navigate(`/${deleteSlash(name)}`)
      return
    }

    setPreviewObjectUrl(url)
    setPreviewObjectName(name)
    if (isImage(name)) {
      setImagePreviewVisible(true)
    } else if (isVideo(name)) {
      setVideoPreviewVisible(true)
    }
  }

  function handleGoBack() {
    navigate(-1)
  }

  function handleGoHome() {
    navigate('/')
  }

  function handleDownload(url: string, name: string): void {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]))
        const link = document.createElement<'a'>('a')
        link.href = url
        link.download = name
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(url)
        link.remove()
      })
  }

  useEffect(() => {
    fetchList()
  }, [prefix])

  return (
    <>
      <Layout style={layoutStyle}>
        <Flex vertical className="flex-wrap">
          <Header style={headerStyle}>
            <Space>
              <Button
                onClick={handleGoBack}
                icon={<ArrowLeftOutlined />}
                disabled={!prefix}
                className="button-disabled-status"
              >
                后退
              </Button>
              <Upload {...uploadDirectoryProps}>
                <Button icon={<CloudUploadOutlined />}>添加文件夹</Button>
              </Upload>
              <Button
                onClick={handleGoHome}
                icon={<HomeOutlined />}
                disabled={!prefix}
                className="button-disabled-status"
              >
                回首页
              </Button>
            </Space>
          </Header>
          <Content style={contentStyle}>
            {list.length ? (
              <div className="list">
                {list.map((item: IOSSFileItem, index: number) => {
                  return (
                    <FileIcon
                      key={index}
                      name={item.name}
                      currentName={item.currentName}
                      url={item.url}
                      onClick={() => {
                        handleFileIconClick(item)
                      }}
                    ></FileIcon>
                  )
                })}
              </div>
            ) : (
              <Empty description={<span>这里什么都没有</span>} />
            )}
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
          style={{ display: 'none' }}
          preview={{
            visible: videoPreviewVisible,
            src: previewObjectUrl,
            imageRender: () => (
              <video height="70%" controls src={previewObjectUrl} />
            ),
            onVisibleChange: (value) => {
              setVideoPreviewVisible(value)
            },
            toolbarRender: (_) => <></>,
          }}
        ></Image>
        <Image
          style={{ display: 'none' }}
          src={previewObjectUrl}
          preview={{
            visible: imagePreviewVisible,
            scaleStep: 0.5,
            src: previewObjectUrl,
            onVisibleChange: (value) => {
              setImagePreviewVisible(value)
            },
            toolbarRender: (
              _,
              {
                image: { url },
                transform: { scale },
                actions: {
                  onFlipY,
                  onFlipX,
                  onRotateLeft,
                  onRotateRight,
                  onZoomOut,
                  onZoomIn,
                  onReset,
                },
              },
            ) => (
              <Space size={12} className="toolbar-wrapper">
                <DownloadOutlined
                  onClick={() =>
                    handleDownload(previewObjectUrl, previewObjectName)
                  }
                />
                <SwapOutlined rotate={90} onClick={onFlipY} />
                <SwapOutlined onClick={onFlipX} />
                <RotateLeftOutlined onClick={onRotateLeft} />
                <RotateRightOutlined onClick={onRotateRight} />
                <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                <UndoOutlined onClick={onReset} />
              </Space>
            ),
          }}
        />
        <Spin spinning={loading} fullscreen delay={500}></Spin>
      </Layout>
    </>
  )
}

export default Home
