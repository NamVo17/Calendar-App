import { Home } from "@/pages/Home"
import { About } from "@/pages/About"
import { Login } from "@/pages/Login"

export const publicRoutes = [
  {
    path: "/",
    component: Home,
    name: "Home",
  },
  {
    path: "/about",
    component: About,
    name: "About",
  },
  {
    path: "/login",
    component: Login,
    name: "Login",
  },
]

export const privateRoutes = [
  // Removed Dashboard - all functionality is in Home page
]
