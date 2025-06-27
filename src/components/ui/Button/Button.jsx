"use client"

import classNames from "classnames"
import PropTypes from "prop-types"
import "./Button.scss"

export const Button = ({
  children, 
  variant = "primary", 
  size = "medium",
  disabled = false, 
  loading = false, 
  icon, 
  onClick, 
  className, 
  ...props 
}) => {

  const buttonClasses = classNames(
    "button", 
    `button--${variant}`, 
    `button--${size}`, 
    {
      "button--disabled": disabled, 
      "button--loading": loading, 
    },
    className, 
  )

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading} 
      onClick={onClick} 
      {...props} 
    >
      {icon && <span className="button__icon">{icon}</span>}

      <span className="button__text">{children}</span>


      {loading && <span className="button__spinner">⟳</span>}
    </button>
  )
}


Button.propTypes = {
  children: PropTypes.node.isRequired, 
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "ghost"]), 
  size: PropTypes.oneOf(["small", "medium", "large"]), 
  disabled: PropTypes.bool, 
  loading: PropTypes.bool, 
  icon: PropTypes.node, 
  onClick: PropTypes.func, 
  className: PropTypes.string, 
}
