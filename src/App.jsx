"use client"
import { Routes, Route } from "react-router-dom"
import { Layout } from "@/components/layout"
import { publicRoutes } from "@/routes"
import { useAuth } from "@/hooks/useAuth"
import { useInitialData } from "@/hooks/useInitialData"
import { LoadingSpinner } from "@/components/ui"

const App = () => {
  const { isLoading } = useAuth()

  useInitialData()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Layout>
      <Routes>
        {publicRoutes.map((route) => (
          <Route
            key={route.path} 
            path={route.path} 
            element={<route.component />} 
          />
        ))}
      </Routes>
    </Layout>
  )
}

export default App
