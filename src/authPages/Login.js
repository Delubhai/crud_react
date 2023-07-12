import * as React from 'react';
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
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { apiBaseUrl } from '../constants/globalConstant';

import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" >
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Login() {
  const [formData, setFormData] = useState({})
  const [submitting, setSubmitting] = useState(false);
  const [submitting1, setSubmitting1] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true)
    let res = await axios.post(`${apiBaseUrl}/auth/login`, formData)
    if (res.data.code !== 200) {
      toast.error(res.data.message)
      setSubmitting(false)
    } else {
      localStorage.setItem('vAccessToken', res.data.user.vAccessToken)
      toast.success(res.data.message)
      setSubmitting(false)
      navigate('/')
    }

  }
  const handleSignUp = async (event) => {
    event.preventDefault();
    setSubmitting1(true)
    let res = await axios.post(`${apiBaseUrl}/auth/signup`, formData)
    if (res.data.code !== 200) {
      toast.error(res.data.message)
      setSubmitting1(false)
    } else {
      // localStorage.setItem('vAccessToken', res.data.user.vAccessToken)
      toast.success(res.data.message)
      setSubmitting1(false)
      navigate('/login')
    }

  }
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              onChange={(e) => { setFormData({ ...formData, vEmail: e.target.value }) }}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              onChange={(e) => { setFormData({ ...formData, vPassword: e.target.value }) }}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="button"
              variant="contained"
              disabled={submitting}
              sx={{ mt: 3, mb: 2 }}
              onClick={(e) => { handleLogin(e) }}
            >
              Login
              {submitting && <LoadingButton loading >
              </LoadingButton>}
            </Button>
            <Button
              type="button"
              sx={{ mt: 3, mb: 2 }}
              onClick={(e) => { handleSignUp(e) }}
            >
              SignUp
              {submitting1 && <LoadingButton loading >
              </LoadingButton>}
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}