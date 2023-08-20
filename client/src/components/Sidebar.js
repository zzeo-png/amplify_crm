import { Link } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li>Leads</li>
        <li><Link to={'/register'}>Create User</Link></li>
      </ul>
    </div>
  )
}

export default Sidebar