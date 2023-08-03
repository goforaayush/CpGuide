import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { useCookies } from "react-cookie";
export async function middleware(request: NextRequest) {
  let token: string | undefined;
  if (request.cookies.has("token")) {
    token = request.cookies.get("token")?.value;
  }

  if (request.nextUrl.pathname.startsWith("/profile") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/login") && token) {
    const axios = require('axios');
    const endpoint = "http://127.0.0.1:8000/api/auth/profile";
    
    let config = {
      method: 'get',
      url: endpoint,
      headers: { 
        'Authorization': 'Bearer '+token
      },
    };
    axios.request(config)
    .then((response:any) => {
      if(response.status <400){
        return NextResponse.redirect(new URL("/profile", request.url));
      }
    })
    .catch((error:any) => {
      console.log(error);
    });

    // const response = await fetch(endpoint, options);
    // const res = await response.json();
    // if(response.status <400){
    // return NextResponse.redirect(new URL("/profile", request.url));
  // }
}

  if (request.nextUrl.pathname.startsWith("/logout") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = {
    matcher: ["/profile", "/login", "/logout"],
  };
