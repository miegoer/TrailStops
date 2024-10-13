import React from 'react';
import { useState } from 'react';
import DBService from '../../services/DBService';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, FormControl, TextField } from '@mui/material';
import './loginScreen.css';

function LoginScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({ email: false, password: false });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // function to handle form submission
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const emailError = formData.email === "";
    const passwordError = formData.password === "";

    // If any field is empty, show the error message
    if (emailError || passwordError) {
      setFormErrors({
        email: emailError,
        password: passwordError,
      });
      return; // Stop submission if fields are empty
    }

    setIsSubmitting(true);
    setErrorMessage("");

    DBService.getUser(formData.email)
      .then((data) => {
        if (data) {
          if (data.password === formData.password) {
            navigate('/map', { state: { email: formData.email } });
          } else {
            setErrorMessage("Unknown credentials");
          }
        } else {
          setErrorMessage("Unknown credentials");
        }
      })
      .catch(() => setErrorMessage("An error occurred during login"))
      .finally(() => setIsSubmitting(false));
  }

  return (
    <div className="loginScreen">
      <div className="loginFormBox">
      <img className='backpackLoginImg' src='backpack.png' alt='brown backpack open at the front showing a wilderness scene inside'/>
      <h1>TrailStops</h1>
      <FormControl className='loginForm' onSubmit={handleSubmit}>
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={formErrors.email}
          helperText={formErrors.email ? 'Email is required' : ''}
          margin='normal'
          required
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={formErrors.password}
          helperText={formErrors.password ? 'Password is required' : ''}
          margin='normal'
          required
        />
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </FormControl>
      <a href="/register">Don't have an account? Register</a>
      </div>
    </div>
  );
}

export default LoginScreen;
