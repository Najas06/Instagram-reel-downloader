"use client";
import { useState } from "react";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loader here
    try {
      const res = await fetch("https://instagram-reel-downloader-backend-1.onrender.com/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      console.log(data.videoUrl);
      setVideoUrl(data.videoUrl || "");
    } catch (err) {
      console.error("Error fetching video:", err);
    } finally {
      setLoading(false); // Stop loader here
    }
  };

  return (
    <main className="max-w-xl px-4 py-10 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Instagram Reels Downloader</h1>
      <form onSubmit={handleDownload} className="space-y-4">
        <input
          type="url"
          placeholder="Paste Instagram reel URL"
          className="w-full p-3 text-black border rounded placeholder:text-black"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 text-white rounded ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600"
          }`}
        >
          {loading ? "Fetching..." : "Download"}
        </button>
      </form>

      {loading && (
        <div className="mt-4 text-gray-600 animate-pulse">Please wait, fetching video...</div>
      )}

      {videoUrl && !loading && (
        <div className="mt-8 space-y-4">
          <video controls className="w-full" src={videoUrl}></video>
          <a href={videoUrl} download className="block text-blue-500 underline">
            Click to Download
          </a>
        </div>
      )}
    </main>
  );
}
