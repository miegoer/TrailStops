import { useState } from 'react';
import DBService from '../../services/DBService';
import { useNavigate } from 'react-router-dom';
import { FormControl, TextField, Button, Alert } from '@mui/material';

import './registerScreen.css';

function RegisterScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({name:"",email:"", password:""});

  const handleSubmit = (e) => {
    e.preventDefault();
    DBService.addUser(formData.name, formData.email, formData.password);
    navigate('/map', {state: { email: formData.email }});
  }

  return (
    <div className="registerScreen">
      <div className='registerFormBox'>
      <img className='backpackLogin' src='backpack.png' alt='backpack'/>
      <h1>TrailStops</h1>
      <h2>Register</h2>
      <FormControl className='registerForm' onSubmit={handleSubmit}>
        <TextField
          id="name"
          label="Name"
          variant="outlined"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          margin='normal'
          required
        />
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          margin='normal'
          required
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          margin='normal'
          required
        />
        <Button variant="contained" type="submit">Register</Button>
      </FormControl>
      </div>
      {/* <form onSubmit={handleSubmit}>
        <h2 id='register'>Register</h2>
        <label htmlFor='name'>Name</label>
        <input type ='text' id='name' value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required/>

        <label htmlFor='email'>Email</label>
        <input type ='email' id='email' value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required/>

        <label htmlFor='password'>Password</label>
        <input type ='password' id='password' value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required/>
        <button type='submit'>Register</button>
      </form> */}
    </div>
  )
}

export default RegisterScreen;