import { VISIT_URL } from "@/utilities/url-builder";
import axios from "axios";

export const saveUserVisit = async (cookies :string , data: { topic_id: number; user: string | undefined; }) => {
    const endpoint = VISIT_URL(process.env.NEXT_PUBLIC_BASE_URL)
    const response = await axios.post(endpoint+'/save_user_visit/' , data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies,
          },
    });
    return response
};