import { NOTE_URL } from "@/utilities/url-builder";
import axios from "axios";

export const getUserNote = async (cookies :string , user: string, topic_id:number) => {
    const endpoint = NOTE_URL(process.env.NEXT_PUBLIC_BASE_URL)
    console.log(topic_id);
    
    const response = await axios.get(  `${endpoint}/get_user_notes/?user=${user}&topic_id=${topic_id}` ,{
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies,
          },
    });
    return response
};