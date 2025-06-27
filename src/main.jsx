import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { ConfigProvider } from "antd"
import { BrowserRouter } from "react-router-dom"
import { store } from "@/store"
import { antdTheme } from "@/config/theme"
import App from "./App"
import "@/assets/styles/global.scss"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={antdTheme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>,
)
