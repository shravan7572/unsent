import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const letterdata = await req.json();

    if (
      !letterdata?.content ||
      typeof letterdata.content !== "string" ||
      !letterdata.content.trim()
    ) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const trimmedContent = letterdata.content.trim();
    if (trimmedContent.length > 1000) {
      return NextResponse.json(
        { error: "Letter must be 1000 characters or fewer" },
        { status: 400 }
      );
    }

    // Auto-assign "Anonymous #N" if no username provided (per PRD)
    let authorName = letterdata.username?.trim() || null;
    if (!authorName) {
      const count = await prisma.letter.count();
      authorName = `Anonymous #${count + 1}`;
    }

    const letter = await prisma.letter.create({
      data: {
        to: letterdata.to?.trim() || null,
        content: trimmedContent,
        username: authorName,
      },
    });

    return NextResponse.json(
      {
        message: "Letter sent to nobody",
        letter,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create letter:", error);
    return NextResponse.json(
      { error: "Failed to send letter" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get("sort");

    const orderBy =
      sort === "felt"
        ? [{ feltThis: "desc" as const }, { createdAt: "desc" as const }]
        : [{ createdAt: "desc" as const }];

    const letters = await prisma.letter.findMany({
      include: {
        comments: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy,
    });

    return NextResponse.json(letters);
  } catch (error) {
    console.error("Failed to fetch letters:", error);
    return NextResponse.json(
      { error: "Failed to fetch letters" },
      { status: 500 }
    );
  }
}