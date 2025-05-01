import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Product from './page/Product'
import Profile from './page/Profile'
import History from './page/History'
import LandingPage from './store/LandingPage'
import { AuthProvider, RequireAuth } from 'react-auth-kit'
import SearchBar from './components/SearchBar'
import ProductList from './components/ProductList'

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (query) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:5000/products/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthProvider
      authType='cookie'
      authName='_auth'
      cookieDomain={window.location.hostname}
      cookieSecure={false}
    >
      <BrowserRouter>
        <Navbar />
        <SearchBar onSearch={handleSearch} />
        {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <ProductList products={products} />

        <Routes>
          <Route exact path='/' element={<LandingPage />} />
          <Route
            exact
            path='/history'
            element={
              <RequireAuth loginPath='/'>
                <History />
              </RequireAuth>
            }
          />
          <Route exact path='/product' element={<Product />} />
          <Route
            exact
            path='/profile'
            element={
              <RequireAuth loginPath='/'>
                <Profile />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
