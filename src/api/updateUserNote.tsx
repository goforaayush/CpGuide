import { NOTE_URL } from "@/utilities/url-builder";
import axios from "axios";

export const updateUserNote = async (cookies :string , data: {user: string; topic_id:number;note:string;}) => {
    const endpoint = NOTE_URL(process.env.NEXT_PUBLIC_BASE_URL)
    
    
    const response = await axios.put(  `${endpoint}/update_user_note/` ,data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies,
          },
    });
    return response
};