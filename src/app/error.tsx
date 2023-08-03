"use client"

import { Button } from "react-bootstrap"

interface ErrorPageProp{
    error : Error,
    reset : () => void
}

export default function Error({error,reset}:ErrorPageProp){
    return <center>
        <h1>Unexpected error occured</h1>
        <Button onClick={reset}>Try Again</Button>
        
        </center>
}