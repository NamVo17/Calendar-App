import classNames from "classnames"
import PropTypes from "prop-types"
import "./LoadingSpinner.scss"

export const LoadingSpinner = ({ size = "medium", className }) => {
  const spinnerClasses = classNames("loading-spinner", `loading-spinner--${size}`, className)

  return (
    <div className={spinnerClasses}>
      <div className="loading-spinner__circle"></div>
    </div>
  )
}

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: PropTypes.string,
}
