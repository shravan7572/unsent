"use client"

import { useRouter } from "next/navigation"

export default function Homepage() {
    const router =useRouter();
return (
    <div>
        hiii landing page....
        <br />
        <button onClick={()=>{
            router.push("/write")
        }}
        className="border-1 p-2"
        >click me </button>
    </div>
)
}
