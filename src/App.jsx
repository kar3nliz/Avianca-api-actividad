import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Countries from './pages/Countries/Countries';
import CountryDetail from './pages/CountryDetail/CountryDetail'; // ← Agregar
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/country/:id" element={<CountryDetail />} /> {/* ← Agregar */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;