import { useState } from "react"
import PropTypes from 'prop-types'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async event => {
    event.preventDefault()

    // Calls the handleLogin function from app.js
    await login(username, password)

    setUsername('')
    setPassword('')
  }
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input value={username} onChange={e => setUsername(e.target.value)}/>
        </div>

        <div>
          password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        </div>

        <button type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
}

export default LoginForm