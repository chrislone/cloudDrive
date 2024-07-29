import { Flex, Layout, Image } from 'antd'
import './index.less'
import FileIcon from '@/components/Fileicon'
import { useEffect, useState } from 'react'
import { fetchFileList } from '@/api'
import { useNavigate, useParams } from 'react-router-dom'
import { isDirectory } from '@/utils'

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

  console.log('prefix', prefix)

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

  useEffect(() => {
    fetchList()
  }, [prefix])

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
                      handleFileIconClick(item)
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
