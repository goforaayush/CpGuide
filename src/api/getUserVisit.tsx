import { VISIT_URL } from "@/utilities/url-builder";
import axios from "axios";

export const getUserVisit = async (cookies :string , data: {user: string | undefined; }) => {
    const endpoint = VISIT_URL(process.env.NEXT_PUBLIC_BASE_URL)
    const response = await axios.post(endpoint+'/get_user_visit/' , data,{
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies,
          },
    });
    return response
};