
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CommentModal from "../component/comment";


export default async function Homepage() {


    const letterss = await prisma.letter.findMany({
        orderBy: { createdAt: "desc" }
    })

    return (
        <div>
            hiii landing page....
            <br />
            <br />
            <br />
            <Link className="border-1 p-3"
                href="/write">write a letter</Link>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div>
                {letterss.map(letter => (
                    <div key={letter.id}>
                        <p>{letter.createdAt.toLocaleString()}</p>
                        <p>{letter.to}</p>
                        <p>{letter.username}</p>
                        <p>{letter.content}</p>
                        <CommentModal letterId={letter.id} />
                    </div>
                ))}
            </div>
        </div>
    )
}
