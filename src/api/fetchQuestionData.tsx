import axios from 'axios'

export const  fetchQuestionData = async ( ) => {
    const data = await axios.get('http://localhost:8000/db/getQuestionData')
    return data;
}