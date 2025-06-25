// Directive cho Next.js (không cần thiết trong React thuần nhưng giữ lại để tương thích)
"use client"
// Import Routes và Route để định nghĩa các route trong ứng dụng
import { Routes, Route } from "react-router-dom"
// Import Layout component chứa navbar, footer và structure chung
import { Layout } from "@/components/layout"
// Import danh sách các public routes (routes không cần authentication)
import { publicRoutes } from "@/routes"
// Import custom hook để quản lý authentication state
import { useAuth } from "@/hooks/useAuth"
// Import custom hook để load dữ liệu ban đầu từ database.json
import { useInitialData } from "@/hooks/useInitialData"
// Import LoadingSpinner component để hiển thị khi đang loading
import { LoadingSpinner } from "@/components/ui"

// Component App chính của ứng dụng
const App = () => {
  // Destructure isLoading từ useAuth hook để biết trạng thái loading của authentication
  const { isLoading } = useAuth()

  // Gọi hook để load dữ liệu ban đầu từ database.json vào localStorage và Redux store
  useInitialData()

  // Nếu đang loading authentication, hiển thị spinner
  if (isLoading) {
    return <LoadingSpinner />
  }

  // Render main app structure
  return (
    // Layout component bao bọc toàn bộ app với navbar và footer
    <Layout>
      {/* Routes container chứa tất cả các route definitions */}
      <Routes>
        {/* Map qua tất cả public routes và tạo Route component cho mỗi route */}
        {/* Tất cả routes hiện tại đều là public - authentication được xử lý trong từng component */}
        {publicRoutes.map((route) => (
          <Route
            key={route.path} // Key unique cho mỗi route
            path={route.path} // URL path của route
            element={<route.component />} // Component sẽ được render khi route match
          />
        ))}
      </Routes>
    </Layout>
  )
}

// Export default App component để sử dụng trong main.jsx
export default App
