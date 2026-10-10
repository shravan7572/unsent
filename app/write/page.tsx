"use client"
import axios from "axios";
import { useRef } from "react";


export default function writeletter(){
   const toRef = useRef<HTMLInputElement | null>(null);
    const messageRef = useRef<HTMLInputElement | null>(null);
    const usernameRef = useRef<HTMLInputElement | null>(null);

    return (
        <div>
            <input ref={toRef} className="border-1 p-2 m-2" placeholder="enter the message u need to send to."
            ></input>
            <input ref={messageRef} className="border-1 p-2 m-2" placeholder="enter the message "
            ></input>
            <input ref={usernameRef} className="border-1 p-2 m-2" placeholder="enter username if want to ."
            ></input>
            
            <br></br>
            <br></br>
            <br></br>
            <br></br>

            <button onClick={()=>{
                axios.post("http://localhost:3001/api/letters",{
                    to:toRef.current?.value,
                    message:messageRef.current?.value,
                    username:usernameRef.current?.value
                })
            }}
            className="border-1 p-2"
            >sent the unsent</button>
        </div>
    );
}