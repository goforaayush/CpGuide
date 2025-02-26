"use client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React from "react";
import { Button, TextField, FormControl, Typography, Box } from "@mui/material";
import {
  AccountCircleOutlined,
  AlternateEmailOutlined,
  LockOutlined,
  PersonOutline,
} from "@mui/icons-material";
import { postSignup } from "@/api/userAdmission";

// import register_usr from './register_usr';?
export default async function SignUp() {
  const router = useRouter();

  const register_usr = async (event: any) => {
    try {
      event.preventDefault();
      const data = {
        fname: event.target.fname.value,
        lname: event.target.lname.value,
        email: event.target.email.value,
        username: event.target.username.value,
        password: event.target.password.value,
      };
      let response = await postSignup (data)
      if (response.status == 400) {
        toast("try again");
      } else if (response.status == 300) {
        toast("you have already been registered, Login with your credentials");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        toast("You have been Successfully Registered. Login with your Credentials now");
      }  
    } catch (error) {
      console.error( error);
      toast.error("Unexpected error occured");
    }  
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#1A202C",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: 400,
          padding: "40px",
          borderRadius: "8px",
          backgroundColor: "#2D3748",
          marginTop: "normal",
          marginBottom: "100px", // Move the form higher
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          style={{ color: "#E2E8F0", marginBottom: "20px",textAlign: 'center'}}
        >
          SignUp
        </Typography>
        <div style={{textAlign:'center',}}>
        <FormControl component="form" onSubmit={register_usr} style={{alignItems: 'center'}}>
          <TextField
          // style={{alignItems: 'center'}}
            // fullWidth
            label="Enter your First Name"
            type="text"
            placeholder="First Name"
            name="fname"
            variant="outlined"
            margin="normal"
            required
            InputProps={{
              style: { color: 'white'},
              startAdornment: (
                <PersonOutline sx={{ color: "#E2E8F0", marginRight: "8px" }} />
              ),
            }}
            InputLabelProps={{ style: { color: "#E2E8F0" } }}
          />
          <TextField
            fullWidth
            label="Enter your Last Name"
            type="text"
            placeholder="Last Name"
            name="lname"
            variant="outlined"
            margin="normal"
            required
            InputProps={{
              style: { color: 'white'},
              startAdornment: (
                <PersonOutline sx={{ color: "#E2E8F0", marginRight: "8px" }} />
              ),
            }}
            InputLabelProps={{ style: { color: "#E2E8F0" } }}
          />
          <TextField
            fullWidth
            label="Enter your Email ID"
            type="text"
            placeholder="Email ID"
            name="email"
            variant="outlined"
            margin="normal"
            required
            InputProps={{
              style: { color: 'white'},
              startAdornment: (
                <AlternateEmailOutlined
                  sx={{ color: "#E2E8F0", marginRight: "8px" }}
                />
              ),
            }}
            InputLabelProps={{ style: { color: "#E2E8F0" } }}
          />
          <TextField
            fullWidth
            label="Enter your Username"
            type="text"
            placeholder="Username"
            name="username"
            variant="outlined"
            margin="normal"
            required
            InputProps={{
              style: { color: 'white'},
              startAdornment: (
                <AccountCircleOutlined
                  sx={{ color: "#E2E8F0", marginRight: "8px" }}
                />
              ),
            }}
            InputLabelProps={{ style: { color: "#E2E8F0" } }}
          />
          <TextField
            fullWidth
            label="Enter your Password"
            type="password"
            placeholder="Enter your password"
            name="password"
            variant="outlined"
            margin="normal"
            required
            InputProps={{
              style: { color: 'white'},
              startAdornment: (
                <LockOutlined sx={{ color: "#E2E8F0", marginRight: "8px" }} />
              ),
            }}
            InputLabelProps={{ style: { color: "#E2E8F0" } }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              backgroundColor: "#6B46C1",
              color: "#E2E8F0",
              padding: "12px",
              "&:hover": {
                backgroundColor: "#805AD5",
                transform: "scale(1.05)",
              },
              transition: "transform 0.2s",
            }}
          >
            Sign Up
          </Button>
        </FormControl></div>
      </Box>
    </Box>
  );
}
