import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useAuthHeader} from 'react-auth-kit'

function History() {
  const [history, setHistory] = useState([]);
  const navigate=useNavigate()
  const authHeader = useAuthHeader()

  useEffect(() => {
    // const token = localStorage.getItem('access_token');
    // console.log(token);
    // if (token) {
    //   fetchHistory(token);
    // }
    if(authHeader() != ''){
      fetchHistory()
    }
  }, []);

  const fetchHistory = () => {
    fetch('https://bluecart-api.onrender.com/history', {
      headers: {
        "Authorization": `${authHeader()}`,
      }
    })
      .then((res) => res.json())
      .then((data) => setHistory(data));
  };

  const handleItemClick = (query) => {
    localStorage.setItem('searchQuery',query);
    navigate('/product')
  };

  console.log(history);

  return (
    <div className="page">
      <div className="top_card">
        <h3>Recent Searches</h3>
      </div>
      <div className='table-box'>
        {history.map((item, index) => (
          <div key={index} className="table-row">
            <p onClick={() => handleItemClick(item.name)}>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
