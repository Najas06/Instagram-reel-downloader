'use client';
import { useState } from 'react';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/download', {
      method: 'POST',
      body: JSON.stringify({ url }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setVideoUrl(data.videoUrl || '');
    setLoading(false);
  };

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Instagram Reels Downloader</h1>
      <form onSubmit={handleDownload} className="space-y-4">
        <input
          type="url"
          placeholder="Paste Instagram reel URL"
          className="w-full border p-3 rounded"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Fetching...' : 'Download'}
        </button>
      </form>

      {videoUrl && (
        <div className="mt-8 space-y-4">
          <video controls className="w-full" src={videoUrl}></video>
          <a
            href={videoUrl}
            download
            className="block text-blue-500 underline"
          >
            Click to Download
          </a>
        </div>
      )}
    </main>
  );
}