import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Product from './page/Product';
import Profile from './page/Profile';
import History from './page/History';
import LandingPage from './store/LandingPage';
import { AuthProvider } from 'react-auth-kit';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import ErrorBoundary from './components/ErrorBoundary'; // Import the ErrorBoundary

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  return (
    <ErrorBoundary> {/* Wrap the entire app */}
      <AuthProvider
        authType='cookie'
        authName='_auth'
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <BrowserRouter>
          <Navbar />
          <SearchBar 
            onSearch={setProducts} 
            onError={setError}
          />
          
          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          <ProductList products={products} />

          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/product' element={<Product />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/history' element={<History />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;