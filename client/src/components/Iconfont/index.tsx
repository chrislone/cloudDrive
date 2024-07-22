import './icon.css'

type IconProps = {
  type: string
  size?: number | string
}

function Index(props: IconProps) {
  const { type, size } = props
  return (
    <svg className="iconfont" aria-hidden="true" style={{ fontSize: size }}>
      <use xlinkHref={'#icon-' + type}></use>
    </svg>
  )
}

export default Index
