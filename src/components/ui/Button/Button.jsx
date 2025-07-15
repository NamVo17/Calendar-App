"use client"

import PropTypes from "prop-types"
import "./Button.scss"
import { Button as AntdButton } from "antd"

export const Button = ({
  children, 
  variant = "primary", 
  size = "middle",
  disabled = false, 
  loading = false, 
  icon, 
  onClick, 
  className,
  type,
  ...props 
}) => {
  let antdType = "default"
  if (variant === "primary") antdType = "primary"
  if (variant === "danger") antdType = "primary"
  if (variant === "ghost") antdType = "ghost"

  return (
    <AntdButton
      type={antdType}
      htmlType={type} // <-- Dùng htmlType cho submit/reset/button
      danger={variant === "danger"}
      size={size}
      disabled={disabled}
      loading={loading}
      icon={icon}
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </AntdButton>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired, 
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "ghost"]), 
  size: PropTypes.oneOf(["small", "middle", "large"]), 
  disabled: PropTypes.bool, 
  loading: PropTypes.bool, 
  icon: PropTypes.node, 
  onClick: PropTypes.func, 
  className: PropTypes.string, 
}
