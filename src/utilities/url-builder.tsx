export const LOGIN_URL = (BASE_URL:any) => 
    `${BASE_URL}/api/auth/login`


export const SIGNUP_URL = (BASE_URL:any) => 
    `${BASE_URL}/api/auth/signup`

    
export const PROFILE_URL = (BASE_URL:any) => 
    `${BASE_URL}/api/auth/profile`

export const QUESTION_URL = (BASE_URL : any) =>
    `${BASE_URL}/db/getQuestionData`

export const VISIT_URL = (BASE_URL : any) => 
    `${BASE_URL}/db/saveUserVisit`
