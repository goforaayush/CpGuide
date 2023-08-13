import { VISIT_URL } from "@/utilities/url-builder";
import axios from "axios";

export const deleteUserVisit = async (cookies :string , data: { topic_id: number; user: string | undefined; }) => {
    const endpoint = VISIT_URL(process.env.NEXT_PUBLIC_BASE_URL)
    const response = await axios.delete(endpoint+'/delete_user_visit/' , {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies,
          },
          data:data
    });
    return response
};