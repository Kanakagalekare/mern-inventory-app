import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Inventory.css';


function Inventory() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
    category: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // edit product
      await axios.put(`http://localhost:5000/api/products/${editingId}`, form);
    } else {
      // add new product
      await axios.post('http://localhost:5000/api/products', form);
    }
    setForm({ name: '', description: '', quantity: '', price: '', category: '' });
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  const handleAddToWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    await axios.post(`http://localhost:5000/api/users/wishlist/${userId}`, {
      productId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    alert('Added to wishlist!');
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2>Inventory</h2>


        <div className="header-right">
          
          <Link to="/wishlist" className="link-wishlist">My Wishlist</Link>
          <button onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            window.location.href = "/login";
          }}
            className="logout-btn"> Logout </button>

        </div>
      </div>



      <form onSubmit={handleSubmit} className="inventory-form">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="quantity" placeholder="Quantity" type="number" value={form.quantity} onChange={handleChange} required />
        <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Product</button>
      </form>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Name</th><th>Description</th><th>Qty</th><th>Price</th><th>Category</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.quantity}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
              <td>
                <button className="edit" onClick={() => handleEdit(p)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(p._id)}>Delete</button>
                <button className="wishlist" onClick={() => handleAddToWishlist(p._id)}>Wishlist</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );



}




export default Inventory;
