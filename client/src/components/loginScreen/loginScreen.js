import { useState } from 'react';
import DBService from '../../services/DBService';
import { useNavigate } from 'react-router-dom';

import './loginScreen.css';

function LoginScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({email:"", password:""});

  function handleSubmit(e) {
    e.preventDefault();
    DBService.getUser(formData.email)
      .then((data) => {
        if (data) {
          if (data.password === formData.password) {
            navigate('/map', {state: { email: formData.email }});
          }
        }
      });
  }

  return (
    <div className="loginScreen">
      <img className='backpack' src='backpack.png' alt='backpack'/>
      <h1>TrailStops</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type='email' id='email' value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required/>

        <label htmlFor="password">Password</label>
        <input type='password' id='password' value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required/>
        <button type='submit'>Login</button>
      </form>
        <a href='/register'>Register</a>
    </div>
  )
}

export default LoginScreen;