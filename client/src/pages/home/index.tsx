import { Flex, Layout, Image } from 'antd'
import './index.less'
import FileIcon from '@/components/Fileicon'
import { useEffect, useState } from 'react'
import { fetchFileList } from '@/api'

const { Content } = Layout

interface IOSSFileItem {
  url: string
  name: string
}

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 'calc(100vh - 40px)',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#ddd',
  padding: 10,
}

const layoutStyle = {
  borderRadius: 8,
  margin: 20,
  overflow: 'auto',
}

function Home() {
  const [list, setList] = useState<IOSSFileItem[]>([])
  const [imagePreviewVisible, setImagePreviewVisible] = useState<boolean>(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('')

  function fetchList() {
    fetchFileList().then((res) => {
      setList(res.data)
    })
  }

  function handleFileIconClick(url: string): void {
    setPreviewImageUrl(url)
    setImagePreviewVisible(true)
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <Flex gap="middle" wrap>
        <Layout style={layoutStyle}>
          <Content style={contentStyle}>
            <div className="list">
              {list.map((item: IOSSFileItem, index: number) => {
                return (
                  <FileIcon
                    key={index}
                    name={item.name}
                    url={item.url}
                    onClick={() => {
                      handleFileIconClick(item.url)
                    }}
                  ></FileIcon>
                )
              })}
            </div>
          </Content>
        </Layout>
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
    </>
  )
}

export default Home
