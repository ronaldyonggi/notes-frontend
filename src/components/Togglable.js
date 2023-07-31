import PropTypes from 'prop-types'
import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  // Toggle visibility
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      {!visible &&
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      }
      {visible &&
        <div>
          {props.children}
          <button onClick={toggleVisibility}>cancel</button>
        </div>
      }
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Togglable