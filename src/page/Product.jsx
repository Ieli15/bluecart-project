import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import {useAuthHeader} from 'react-auth-kit'

function Product() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem('searchQuery') || '');
  const [data, setData] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [filterType, setFilterType] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const authHeader = useAuthHeader()

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  function fetchData() {
    if (searchQuery !== "") {
      const requestBody = JSON.stringify({ query: searchQuery });
      // const token = localStorage.getItem('access_token');
      let headers = {}

      // if (token) {
      //   headers = {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${token}`,
      //   }
      // } else {
      //   headers = {
      //     "Content-Type": "application/json",
      //   }
      // }

      if (authHeader() != '') {
        headers = {
          "Content-Type": "application/json",
          "Authorization": `${authHeader()}`,
        }
      } else {
        headers = {
          "Content-Type": "application/json",
        }
      }

      fetch("https://bluecart-api.onrender.com/search", {
        method: "POST",
        headers: headers,
        body: requestBody,
      })
        .then((response) => {
          if (response.ok){
            return response.json()
          }else{
            return []
          }
        })
        .then((responseData) => setData(responseData))
        .catch((error) => console.error('Error fetching data:', error));
    }
  }

  const openProductCard = (product) => {
    setSelectedProduct(product);
    setShowCard(true);
  };

  const closeProductCard = () => {
    setSelectedProduct(null);
    setShowCard(false);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const getIconForUrl = (url) => {
    if (url) {
      if (url.includes('amazon')) {
        return 'fa-brands fa-amazon';
      } else if (url.includes('ebay')) {
        return 'fa-brands fa-ebay';
      } else if (url.includes('alibaba')) {
        return '';
      }
    }

    return 'default-icon.png';
  };

  const handleFilter = (newFilterType) => {
    setFilterType(newFilterType);
    if (data.length > 1) {
      let products = []
      switch (newFilterType) {

        case 'Price':
          products = [...data].sort((a, b) => {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);
            return priceA - priceB;
          });
          setData(products)
          break;

        case 'Review':
          products = [...data].sort((a, b) => {
            const reviewA = parseInt(a.review);
            const reviewB = parseInt(b.review);
            return reviewB - reviewA;
          });
          setData(products)
          break;

        case 'Rating':
          products = [...data].sort((a, b) => {
            const ratingA = parseFloat(a.rating);
            const ratingB = parseFloat(b.rating);
            return ratingB - ratingA;
          });
          setData(products)
          break;

        default:
          products = [...data].sort((a, b) => {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);
            return priceA - priceB;
          });
          setData(products)
          break;
      }
    }
  };

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  return (
    <div className={`page ${showCard ? 'fade' : ''}`}>
      <div className="card">
        <div className="search">
          <p>Millions of products across multiple categories for all your shopping needs</p>
          <input
            type="text"
            placeholder="Search here for your products ..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="filter">
          <button onClick={toggleFilterDropdown}>
            <i className="fas fa-sort"></i> Filter
          </button>
          {showFilterDropdown && <ProductFilter onFilterChange={handleFilter} />}
        </div>
      </div>
      <div className="container">
        {data.map((item, index) => (
          <div className="box" key={index} onClick={() => openProductCard(item)}>
            <img src={item.image} alt="" />
            <p>{item.name}</p>
            <br />
            <p>Price <span>{item.price}</span></p>
            <br />
            <p>Rating <span>{item.rating}</span></p>
            <br />
            <i className={getIconForUrl(item.link)}></i>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <ProductCard product={selectedProduct} onClose={closeProductCard} />
      )}
      <style>
        {`
          input[type="text"],
          input[type="email"],
          input[type="password"] {
            text-transform: none;
          }
        `}
      </style>
    </div>
  );
}

export default Product;
