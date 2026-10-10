
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const letterdata=await req.json();

    const response =await prisma.letter.create({
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

export async function GET(req:NextRequest){
    const letterdata=await req.json();
    return NextResponse.json({
        message:"letter send sucessfully!!!1",
        content:letterdata.content,
        to:letterdata.to,
        username:letterdata.username
    })
}