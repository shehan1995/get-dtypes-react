import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar bg-primary" data-bs-theme="dark">
      <div className="container-fluid">
        <ul className="nav">
          <li className="nav-item">
            <Link className="navbar-brand" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/history">
              Show History
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
