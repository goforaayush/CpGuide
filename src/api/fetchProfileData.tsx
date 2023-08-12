import { PROFILE_URL } from "@/utilities/url-builder";
import axios from "axios";

export const fetchProfileData = async (cookies :string) => {
      
    const endpoint = PROFILE_URL(process.env.NEXT_PUBLIC_BASE_URL)

    const options = {
        method: "GET",
        headers: {
          Authorization: "Bearer " + cookies,
        },
      };
    const response = await axios.get(endpoint , options);

    return response

};