import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Wishlist.css';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const res = await axios.get(`http://localhost:5000/api/users/wishlist/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setWishlist(res.data);
  };

  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    await axios.delete(`http://localhost:5000/api/users/wishlist/${userId}/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchWishlist();
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="wishlist-container">
      <h2>My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <ul>
          {wishlist.map((item) => (
            <li key={item._id}>
              {item.name} - {item.category}
              <button onClick={() => removeFromWishlist(item._id)} style={{ marginLeft: '10px' }}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Wishlist;
