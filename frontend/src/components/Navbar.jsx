import { NavLink } from 'react-router-dom'
import '../styles/Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar-logo">TypeQuest</span>
      <div className="navbar-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/lessons">Lessons</NavLink>
        <NavLink to="/practice">Practice</NavLink>
        <NavLink to="/games">Games</NavLink>
        <NavLink to="/progress">Progress</NavLink>
        <NavLink to="/login">Login</NavLink>
      </div>
    </nav>
  )
}
