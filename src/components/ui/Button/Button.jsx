// Directive cho Next.js (không cần thiết trong React thuần)
"use client"

// Import classNames utility để conditional CSS classes
import classNames from "classnames"
// Import PropTypes để type checking
import PropTypes from "prop-types"
// Import SCSS styles
import "./Button.scss"

// Button component - reusable button với nhiều variants và states
export const Button = ({
  children, // Nội dung button (text, icons, etc.)
  variant = "primary", // Loại button: primary, secondary, danger, ghost
  size = "medium", // Kích thước: small, medium, large
  disabled = false, // Trạng thái disabled
  loading = false, // Trạng thái loading
  icon, // Icon hiển thị bên trái text
  onClick, // Click handler function
  className, // CSS class tùy chỉnh
  ...props // Các props khác sẽ được spread vào button element
}) => {
  // Tạo CSS classes cho button dựa trên props
  const buttonClasses = classNames(
    "button", // Base class
    `button--${variant}`, // Variant class
    `button--${size}`, // Size class
    {
      "button--disabled": disabled, // Conditional class cho disabled state
      "button--loading": loading, // Conditional class cho loading state
    },
    className, // Custom class từ props
  )

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading} // Disable button nếu disabled hoặc loading
      onClick={onClick} // Click handler
      {...props} // Spread các props khác (type, id, etc.)
    >
      {/* Icon - hiển thị nếu có */}
      {icon && <span className="button__icon">{icon}</span>}

      {/* Button text */}
      <span className="button__text">{children}</span>

      {/* Loading spinner - hiển thị khi loading */}
      {loading && <span className="button__spinner">⟳</span>}
    </button>
  )
}

// PropTypes để type checking và documentation
Button.propTypes = {
  children: PropTypes.node.isRequired, // Bắt buộc: nội dung button
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "ghost"]), // Optional: variant
  size: PropTypes.oneOf(["small", "medium", "large"]), // Optional: size
  disabled: PropTypes.bool, // Optional: disabled state
  loading: PropTypes.bool, // Optional: loading state
  icon: PropTypes.node, // Optional: icon element
  onClick: PropTypes.func, // Optional: click handler
  className: PropTypes.string, // Optional: custom CSS class
}
