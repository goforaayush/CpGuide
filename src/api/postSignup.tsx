import { SIGNUP_URL } from "@/utilities/url-builder";
import axios from "axios";

export const postSignup = async (signupData: { fname: string; lname: string; email: string; username: string; password: string; }) => {
    const data = {
        fname: signupData.fname,
        lname: signupData.lname,
        email: signupData.email,
        username: signupData.username,
        password: signupData.password,
    }

    //   const JSONdata = JSON.stringify(data);
    const endpoint = SIGNUP_URL(process.env.NEXT_PUBLIC_BASE_URL)

    const response = await axios.post(endpoint, data);

    return response

};