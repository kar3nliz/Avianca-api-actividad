import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          🌍 Avianca
        </Link>
        <div className="navbar-nav">
          <Link className="nav-link fs-5" to="/">Inicio</Link>
          <Link className="nav-link fs-5" to="/countries">Comprar vuelos</Link>
        </div>
      </div>
    </nav>
  );
}

export default Header;