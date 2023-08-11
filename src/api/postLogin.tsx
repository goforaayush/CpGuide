import { LOGIN_URL } from "@/utilities/url-builder";
import axios from "axios";

export const postLogin = async (username:string, password:string) => {
    const data = {
        username: username,
        password: password,
      }

    //   const JSONdata = JSON.stringify(data);
      const endpoint = LOGIN_URL(process.env.NEXT_PUBLIC_BASE_URL)

      const response = await axios.post(endpoint, data);

      return response

};