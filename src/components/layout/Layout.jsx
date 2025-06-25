import PropTypes from "prop-types"
import { Navbar } from "./Navbar/Navbar"
import { Footer } from "./Footer/Footer"
import "./Layout.scss"

export const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">{children}</main>
      <Footer />
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
