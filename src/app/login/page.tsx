"use client"
import { AccountCircleOutlined, LockOutlined } from '@mui/icons-material';
import { useRouter } from 'next/navigation'
import { useCookies } from 'react-cookie'

import { toast } from 'react-hot-toast'
import React, { useEffect } from 'react';
import { Button, TextField, FormControl, Typography, Box } from '@mui/material';
import { postLogin } from '@/api/userAdmission';

export default async function Login() {
  const router = useRouter()
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  useEffect(() => {
    if (cookies.token) {
      router.replace('/login')
      toast.success("Cheers!")
      router.push("/profile")
    }
  }, [cookies.token, router]);

  
  const login_handler = async (event: any) => {
    event.preventDefault()
    const response = await postLogin(event.target.username.value, event.target.password.value)
    if (response.status == 200) {
      setCookie('token', response.data.access, { path: '/', secure: true, maxAge: 3600 })
    } else {
      toast.error("noo")
    }
  }    
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#1A202C',
        }}
      >
        <Box
          sx={{
            width: '80%',
            maxWidth: 300,
            padding: '40px',
            borderRadius: '8px',
            backgroundColor: '#2D3748',
            marginTop: 'normal',
            marginBottom: '250px', // Move the form higher
          }}
        >
          <Typography variant="h5" gutterBottom style={{ color: '#E2E8F0', marginBottom: '20px' ,textAlign:'center'}}>
            Login
          </Typography>
          <FormControl component="form" onSubmit={login_handler}>
            <TextField
              fullWidth
              label="Enter your Username"
              type="text"
              placeholder="Username"
              name="username"
              variant="outlined"
              margin="normal"
              required
              InputProps={{ style: { color: 'white'},startAdornment: <AccountCircleOutlined sx={{ color: '#E2E8F0', marginRight: '8px' }} /> }}
              InputLabelProps={{ style: { color: '#E2E8F0' } }}
            />
            <TextField
              fullWidth
              label="Enter your Password"
              type="password"
              placeholder="Password"
              name="password"
              variant="outlined"
              margin="normal"
              required
              InputProps={{ style: { color: 'white'},startAdornment: <LockOutlined sx={{ color: '#E2E8F0', marginRight: '8px' }} /> }}
              InputLabelProps={{ style: { color: '#E2E8F0' } }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                backgroundColor: '#6B46C1',
                color: '#E2E8F0',
                padding: '12px',
                '&:hover': {
                  backgroundColor: '#805AD5',
                  transform: 'scale(1.05)',
                },
                transition: 'transform 0.2s',
              }}
            >
              Submit
            </Button>
          </FormControl>
        </Box>
      </Box>
    );
  }