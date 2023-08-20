import { Navigate } from "react-router-dom"

const LoginChecker = ({ user, children }) => {
  if (user) {
    return <Navigate to="/home" replace />
  }
  return children
}

export default LoginChecker