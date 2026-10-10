
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const letterdata=await req.json();

    const response = prisma.Letter.create({
        data:{
            to:letterdata.to,
            content:letterdata.content,
            username:letterdata.username
        }
    })

    return NextResponse.json({
        message:"letter send sucessfully!!!1"
    })
}