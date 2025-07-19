export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { scrapeInstagramVideo } from "@/lib/scrapeInstagram"; // ✅ path to scraper

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url || !url.includes("instagram.com/reel")) {
    return NextResponse.json({ error: "Invalid Instagram reel URL" }, { status: 400 });
  }

  try {
    const videoUrl = await scrapeInstagramVideo(url);
    if (videoUrl) {
      return NextResponse.json({ videoUrl });
    } else {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Scraper error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
