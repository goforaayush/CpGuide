import { QUESTION_URL } from "@/utilities/url-builder";
import axios from "axios";

export const fetchQuestionData = async (token:string) => {
  const endpoint = QUESTION_URL(process.env.NEXT_PUBLIC_BASE_URL)
  const data = await axios.get(endpoint , { 
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return data;
};
