import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const comments = await prisma.comment.findMany({
    where: { letterId: params.id },
    orderBy: { createdAt: "desc" }
  })
  return NextResponse.json(comments)
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()

  const comment = await prisma.comment.create({
    data: {
      content: body.content,
      username: body.username,
      letterId: params.id
    }
  })

  return NextResponse.json(comment)
}