// Import React library để sử dụng JSX và React components
import React from "react"
// Import ReactDOM để render React app vào DOM
import ReactDOM from "react-dom/client"
// Import Provider từ react-redux để cung cấp Redux store cho toàn bộ app
import { Provider } from "react-redux"
// Import ConfigProvider từ Ant Design để cấu hình theme cho toàn bộ app
import { ConfigProvider } from "antd"
// Import BrowserRouter để sử dụng routing trong React
import { BrowserRouter } from "react-router-dom"
// Import Redux store đã được cấu hình
import { store } from "@/store"
// Import theme configuration cho Ant Design
import { antdTheme } from "@/config/theme"
// Import component App chính
import App from "./App"
// Import file CSS global cho toàn bộ ứng dụng
import "@/assets/styles/global.scss"

// Tạo root element để render React app
// getElementById("root") tìm element có id="root" trong index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  // React.StrictMode giúp phát hiện các vấn đề tiềm ẩn trong development
  <React.StrictMode>
    {/* Provider cung cấp Redux store cho toàn bộ component tree */}
    <Provider store={store}>
      {/* ConfigProvider cấu hình theme cho tất cả Ant Design components */}
      <ConfigProvider theme={antdTheme}>
        {/* BrowserRouter cho phép sử dụng routing với HTML5 history API */}
        <BrowserRouter>
          {/* Component App chính chứa toàn bộ ứng dụng */}
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
)
