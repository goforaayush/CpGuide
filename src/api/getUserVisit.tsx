import { VISIT_URL } from "@/utilities/url-builder";
import axios from "axios";

export const getUserVisit = async (cookies :string , user: string) => {
    const endpoint = VISIT_URL(process.env.NEXT_PUBLIC_BASE_URL)
    const response = await axios.get(endpoint+'/get_user_visit/?user='+user ,{
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies,
          },
    });
    return response
};