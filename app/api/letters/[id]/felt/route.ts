import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const letter = await prisma.letter.findUnique({
      where: { id },
    });

    if (!letter) {
      return NextResponse.json(
        { error: "Letter not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.letter.update({
      where: { id },
      data: {
        feltThis: {
          increment: 1,
        },
      },
      select: {
        id: true,
        feltThis: true,
      },
    });

    return NextResponse.json({
      message: "I felt this recorded",
      feltThis: updated.feltThis,
    });
  } catch (error) {
    console.error("Failed to update reaction:", error);
    return NextResponse.json(
      { error: "Failed to record reaction" },
      { status: 500 }
    );
  }
}
