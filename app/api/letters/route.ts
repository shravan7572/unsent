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
    const limitParam = parseInt(searchParams.get("limit") || "10", 10);
    const limit = Math.min(Math.max(1, limitParam), 30);
    const cursor = searchParams.get("cursor");
    const sort = searchParams.get("sort") || "latest";
    const filter = searchParams.get("filter") || "all";
    const search = searchParams.get("search")?.trim() || "";

    // Build filter conditions
    const conditions: Array<Record<string, unknown>> = [];

    if (filter === "addressed") {
      conditions.push({ to: { not: null } });
      conditions.push({ to: { not: "" } });
      conditions.push({ to: { not: "nobody", mode: "insensitive" } });
    } else if (filter === "nobody") {
      conditions.push({
        OR: [
          { to: null },
          { to: "" },
          { to: { equals: "nobody", mode: "insensitive" } },
        ],
      });
    }

    if (search) {
      conditions.push({
        OR: [
          { content: { contains: search, mode: "insensitive" } },
          { to: { contains: search, mode: "insensitive" } },
          { username: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    const where = conditions.length > 0 ? { AND: conditions } : {};

    const orderBy =
      sort === "felt" || filter === "felt"
        ? [
            { feltThis: "desc" as const },
            { createdAt: "desc" as const },
            { id: "desc" as const },
          ]
        : [{ createdAt: "desc" as const }, { id: "desc" as const }];

    const queryOptions: {
      take: number;
      where: typeof where;
      orderBy: typeof orderBy;
      include: {
        comments: {
          orderBy: { createdAt: "asc" };
        };
      };
      cursor?: { id: string };
      skip?: number;
    } = {
      take: limit + 1,
      where,
      orderBy,
      include: {
        comments: {
          orderBy: { createdAt: "asc" },
        },
      },
    };

    if (cursor) {
      queryOptions.cursor = { id: cursor };
      queryOptions.skip = 1;
    }

    const [lettersWithExtra, totalCount] = await Promise.all([
      prisma.letter.findMany(queryOptions),
      prisma.letter.count({ where }),
    ]);

    const hasMore = lettersWithExtra.length > limit;
    const letters = hasMore
      ? lettersWithExtra.slice(0, limit)
      : lettersWithExtra;
    const nextCursor =
      hasMore && letters.length > 0 ? letters[letters.length - 1].id : null;

    return NextResponse.json({
      letters,
      nextCursor,
      hasMore,
      totalCount,
    });
  } catch (error) {
    console.error("Failed to fetch letters:", error);
    return NextResponse.json(
      { error: "Failed to fetch letters" },
      { status: 500 }
    );
  }
}