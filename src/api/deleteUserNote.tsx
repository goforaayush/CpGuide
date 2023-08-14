import { NOTE_URL } from "@/utilities/url-builder";
import axios from "axios";

export const deleteUserNote = async (cookies :string , data: { topic_id: number; user: string | undefined; }) => {
    const endpoint = NOTE_URL(process.env.NEXT_PUBLIC_BASE_URL)
    const response = await axios.delete(endpoint+'/delete_user_note/' , {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies,
          },
          data:data
    });
    return response
};