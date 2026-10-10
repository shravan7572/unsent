"use client"

import axios from "axios";
import { useRef, useState } from "react"

export default function CommentModal({ letterId }: { letterId: string }) {
    const [open, setOpen] = useState(false)
    const messageRef = useRef<HTMLInputElement | null>(null);
    const usernameRef = useRef<HTMLInputElement | null>(null);

    return (
        <div>
            <button className="border-1"
                onClick={() => setOpen(true)}>Add Comment</button>

            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded">
                        <button className="bg-black"onClick={() => setOpen(false)}>Close</button>
                        <input className="border-1 bg-black" ref={messageRef}
                        placeholder="Your comment..." />
                        <input className="border-1 bg-black" ref={usernameRef}
                        placeholder="Your comment..." />
                        <button onClick={()=>{
                            axios.post(`http://localhost:3001/api/letters/${letterId}/comment`)
                        }}
                        className="border-1 bg-black">Submit</button>
                    </div>
                </div>
            )}
        </div>
    )
}