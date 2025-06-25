// Directive cho Next.js (không cần thiết trong React thuần)
"use client"

// Import React hooks
import { useEffect } from "react"
// Import classNames utility để conditional CSS classes
import classNames from "classnames"
// Import PropTypes để type checking
import PropTypes from "prop-types"
// Import X icon từ lucide-react
import { X } from "lucide-react"
// Import SCSS styles
import "./Modal.scss"

// Modal component - reusable modal dialog
export const Modal = ({ isOpen, onClose, title, children, size = "medium", closable = true, className }) => {
 
  // useEffect để quản lý body scroll khi modal mở/đóng
  useEffect(() => {
    if (isOpen) {
      // Khi modal mở, disable scroll của body
      document.body.style.overflow = "hidden"
    } else {
      // Khi modal đóng, enable lại scroll của body
      document.body.style.overflow = "unset"
    }

    // Cleanup function - chạy khi component unmount hoặc isOpen thay đổi
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen]) // Dependency: isOpen

  // useEffect để handle ESC key press
  useEffect(() => {
    // Function xử lý keydown event
    const handleEscape = (e) => {
      // Nếu nhấn ESC và modal có thể đóng được
      if (e.key === "Escape" && closable) {
        onClose() // Gọi onClose callback
      }
    }

    if (isOpen) {
      // Nếu modal đang mở, add event listener
      document.addEventListener("keydown", handleEscape)
    }

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose, closable]) // Dependencies

  // Nếu modal không mở, không render gì cả
  if (!isOpen) return null

  // Tạo CSS classes cho modal dựa trên props
  const modalClasses = classNames("modal", `modal--${size}`, className)

  // Function xử lý click vào backdrop (vùng tối phía sau modal)
  const handleBackdropClick = (e) => {
    // Chỉ đóng modal nếu click vào backdrop (không phải modal content)
    // và modal có thể đóng được
    if (e.target === e.currentTarget && closable) {
      onClose()
    }
  }

  return (
    // Modal backdrop - vùng tối phía sau modal
    <div className="modal-backdrop" onClick={handleBackdropClick} >
      {/* Modal content */}
      <div className={modalClasses} >
        {/* Modal header - hiển thị nếu có title hoặc closable */}
        {(title || closable) && (
          <div className="modal__header" >
            {/* Title */}
            {title && <h3 className="modal__title">{title}</h3>}
            {/* Close button */}
            {closable && (
              <button className="modal__close" onClick={onClose}>
                <X size={20} />
              </button>
            )}
          </div>
        )}
        {/* Modal body */}
        <div className="modal__content">{children}</div>
      </div>
    </div>
  )
}

// PropTypes để type checking và documentation
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Bắt buộc: trạng thái mở/đóng
  onClose: PropTypes.func.isRequired, // Bắt buộc: callback khi đóng modal
  title: PropTypes.string, // Optional: tiêu đề modal
  children: PropTypes.node.isRequired, // Bắt buộc: nội dung modal
  size: PropTypes.oneOf(["small", "medium", "large"]), // Optional: kích thước modal
  closable: PropTypes.bool, // Optional: có thể đóng modal hay không
  className: PropTypes.string, // Optional: CSS class tùy chỉnh
}
