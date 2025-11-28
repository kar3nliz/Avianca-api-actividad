import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCountryByName } from '../../services/api';
import Loading from '../../components/Loading/Loading';

function CountryDetail() {
  const { id } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCountry = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCountryByName(id);
        setCountry(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCountry();
  }, [id]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="container py-5 mt-5">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
        <Link to="/countries" className="btn btn-primary">
          ← Volver a los vuelos
        </Link>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="container py-5 mt-5">
        <div className="alert alert-warning" role="alert">
          Vuelos no encontrado
        </div>
        <Link to="/countries" className="btn btn-primary">
          ← Volver a los vuelos
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-4">
      <Link to="/countries" className="btn btn-outline-primary mb-4">
        ←   Volver a los vuelos
      </Link>

      <div className="row">
        <div className="col-md-6">
          <img 
            src={country.flags.png} 
            alt={`Flag of ${country.name.common}`}
            className="img-fluid rounded shadow"
            style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
          />
        </div>
        <div className="col-md-6">
          <h1 className="display-4 mb-3">{country.name.common}</h1>
          <p className="lead text-muted">{country.name.official}</p>
          
          <div className="row mt-4">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Información del vuelo</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Capital:</strong> {country.capital ? country.capital[0] : 'N/A'}</p>
                      <p><strong>Precio:</strong> {country.population.toLocaleString()}</p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Idioma:</strong><br/>
                        {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}
                      </p>
                      <p>
                        <strong>Moneda:</strong><br/>
                        {country.currencies ? Object.values(country.currencies).map(curr => curr.name).join(', ') : 'N/A'}
                      </p>
                      <p><strong>Zona Horaria:</strong> {country.timezones.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {country.maps?.googleMaps && (
            <div className="mt-3">
              <a 
                href={country.maps.googleMaps} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                📍 Ver en Google Maps
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CountryDetail;