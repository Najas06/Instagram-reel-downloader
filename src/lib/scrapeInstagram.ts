import puppeteer from "puppeteer";
import { devices, executablePath } from "puppeteer";

export async function scrapeInstagramVideo(url: string): Promise<string | null> {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: executablePath(),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.emulate(devices["iPhone 13 Pro Max"]);

    let videoUrl: string | null = null;

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (
        request.resourceType() === "media" &&
        (request.url().includes(".mp4?") ||
         request.url().includes(".m3u8") ||
         request.url().includes(".mpd"))
      ) {
        videoUrl = request.url();
      }
      request.continue();
    });

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    if (!videoUrl) {
      try {
        await page.waitForSelector("video", { timeout: 10000 });
        videoUrl = await page.$eval("video", (video: HTMLVideoElement) => video.src);
      } catch (_) {}
    }

    return videoUrl;
  } finally {
    await browser.close();
  }
}
