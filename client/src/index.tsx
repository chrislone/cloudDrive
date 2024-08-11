import React from 'react'
import { Flex } from 'antd'
import ReactDOM from 'react-dom/client'
import './index.less'
// import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom'
import router from './router'

window.publicKey = PUBLICKEYPEM

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  // <React.StrictMode>
  <Flex vertical={true} className="main-container-wrap">
    <div className="main-container">
      <RouterProvider router={router} />,
    </div>
  </Flex>,
  // </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
