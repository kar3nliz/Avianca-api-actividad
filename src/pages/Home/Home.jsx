function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content text-center text-white">
          <h1 className="hero-title display-2 fw-bold mb-4">
            Bienvenidos a Avianca
          </h1>
          <p className="hero-subtitle lead fs-3 mb-5">
            Conoce tu próximo destino 
          </p>
          <div className="hero-buttons">
            <a href="/countries" className="btn btn-light btn-lg px-4 me-3 fw-bold">
              Los mejores descuentos 
            </a>
            <a href="#features" className="btn btn-outline-light btn-lg px-4">
              Ver más
            </a>
          </div>
        </div>
      </div>

      <div id="features" className="features-section py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="feature-card p-4">
                <div className="feature-icon mb-3">🌍</div>
                <h4>Mas de 250 destinos</h4>
                <p>Información completa para cada vuelo</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card p-4">
                <div className="feature-icon mb-3">🚀</div>
                <h4>tu ruta en tiempo real</h4>
                <p>Información completa y actualizada para que disfrutes de tu viaje </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card p-4">
                <div className="feature-icon mb-3">🏡</div>
                <h4>hoteles disponibles</h4>
                <p>Encuentra las mejores ofertas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;