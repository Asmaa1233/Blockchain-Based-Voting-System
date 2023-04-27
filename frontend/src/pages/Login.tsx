import React, { useState, useContext } from 'react';
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "../axios";
import { AuthContext } from "../contexts/Auth";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';


// using Yub library to validate user inputs
const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email')
    .test('bcoc', 'Email must be from bcoc domain', value => {
      if (!value) {
        return true; 
      }
      return value.endsWith('@bcoc.com');
    })
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/^[^#^*()<>=+.]*$/, 'Invalid character found')
    .required(),
});

//////////////////////// Login Page //////////////////////////
const Login = () => {
  const authContext = useContext(AuthContext);
  const [error, setError] = useState("");

  const adminEmail = "admin@bcoc.com";
  const subject = "Credential Request";
  const body = "Credential request for logging into the BCoC official platform";
  const href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar className= "loginicon" >
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              axios
                .post("/auth/login", { ...values })
                .then((res) => {
                  authContext.authenticate(res.data.user, res.data.accessToken);
                })
                .catch((err) => {
                  let error = err.message;
                  if (err?.response?.data)
                    error = JSON.stringify(err.response.data);
                  setError(error);
                });
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={values.password
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  />
                  <FormControlLabel 
               
                  control={<Checkbox  value="remember" color="primary" />}
                  label="Remember me"
                  />
                  <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
                  className="LoginBtn"
                  >
                  Sign In
                  </Button>
                  {error && (
                  <Typography variant="subtitle1" color="error" align="center">
                  {error}
                  </Typography>
                  )}
                  <Grid container>
                  <Grid item>
                  <Link className ="Loglink" href={href} target="_blank" variant="body2">
                  {"Don't have an account? Contact us"}
                  </Link>
                  </Grid>
                  </Grid>
                  </Box>
                  )}
                  </Formik>
                  </Box>
                  </Container>
                  </ThemeProvider>
                  );
                  };
                  
                  export default Login;
