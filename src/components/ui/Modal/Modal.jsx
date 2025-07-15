
"use client"
import { useEffect } from "react"
import classNames from "classnames"
import PropTypes from "prop-types"
import { X } from "lucide-react"
import "./Modal.scss"

export const Modal = ({ isOpen, onClose, title, children, size = "medium", closable = true, className }) => {
 
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen]) 
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && closable) {
        onClose() 
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose, closable]) 

  if (!isOpen) return null

  const modalClasses = classNames("modal", `modal--${size}`, className)

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closable) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} >
      <div className={modalClasses} >
        {(title || closable) && (
          <div className="modal__header" >
            {title && <h3 className="modal__title">{title}</h3>}
            {closable && (
              <button className="modal__close" onClick={onClose}>
                <X size={20} />
              </button>
            )}
          </div>
        )}
        <div className="modal__content">{children || null}</div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired, 
  onClose: PropTypes.func.isRequired, 
  title: PropTypes.string, 
  children: PropTypes.node, 
  size: PropTypes.oneOf(["small", "medium", "large"]), 
  closable: PropTypes.bool, 
  className: PropTypes.string, 
}
