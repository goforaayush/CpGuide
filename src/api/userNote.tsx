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