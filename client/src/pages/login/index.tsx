import { Layout, Card, Button, Form, Input, Space } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { userLogin } from '@/api'
import './index.less'

const { Content } = Layout

const contentStyle: React.CSSProperties = {
  display: 'flex',
  flex: 'auto',
  alignItems: 'center',
  height: '100%',
  justifyContent: 'center',
}

const layoutStyle: React.CSSProperties = {
  display: 'flex',
  flex: 'auto',
  overflow: 'hidden',
  height: '100%',
}

// 使用公钥加密数据
function encrypt(publicKeyPem: string, message: string): string {
  const publicKey = window.forge.pki.publicKeyFromPem(publicKeyPem)
  const encrypted = publicKey.encrypt(message, 'RSA-OAEP') // 使用 OAEP 填充模式
  return window.forge.util.encode64(encrypted)
}

function Login() {
  const [form] = Form.useForm()

  const handleSubmitLogin = () => {
    form
      .validateFields()
      .then((validRes) => {
        userLogin({
          u: validRes.username,
          p: encrypt(window.publicKey, validRes.password),
        }).then((res) => {
          console.log('res: ', res)
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Layout style={layoutStyle}>
      <Content style={contentStyle}>
        <Card
          title={<span>先登录吧</span>}
          bordered={false}
          style={{ width: 400 }}
          className="login-card-wrap"
          classNames={{ title: 'login-card-title' }}
        >
          <Form form={form}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Form.Item
                className="item"
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="请输入用户名"
                ></Input>
              </Form.Item>
              <Form.Item
                className="item"
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                ></Input.Password>
              </Form.Item>

              <Form.Item>
                <Button block type="primary" onClick={handleSubmitLogin}>
                  登录
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </Card>
      </Content>
    </Layout>
  )
}

export default Login
