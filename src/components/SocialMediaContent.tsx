"use client";

import { useState } from "react";
import { Camera, Music2 } from "lucide-react";
import { SocialMediaResult, SocialMediaPost } from "@/lib/prompts";

interface SocialMediaContentProps {
  result: SocialMediaResult;
}

function PostCard({
  post,
  index,
  platform,
}: {
  post: SocialMediaPost;
  index: number;
  platform: "instagram" | "tiktok";
}) {
  const [copied, setCopied] = useState(false);

  const fullText = `${post.caption}\n\n${post.hashtags}\n\n${post.cta}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isInstagram = platform === "instagram";
  const bgClass = isInstagram ? "bg-purple-50" : "bg-slate-50";
  const borderClass = isInstagram ? "border-purple-200" : "border-slate-200";
  const badgeBg = isInstagram
    ? "bg-purple-100 text-purple-700"
    : "bg-slate-200 text-slate-700";

  return (
    <div
      className={`${bgClass} ${borderClass} border rounded-lg p-4 flex flex-col gap-2`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeBg}`}>
          Option {index + 1}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          {copied ? "Copied!" : "Copy all"}
        </button>
      </div>
      <p className="text-sm text-gray-800 leading-snug">{post.caption}</p>
      <p className="text-xs text-gray-500">{post.hashtags}</p>
      <p className="text-xs font-semibold text-gray-700">{post.cta}</p>
    </div>
  );
}

export default function SocialMediaContent({ result }: SocialMediaContentProps) {
  return (
    <div className="w-full mt-2">
      <h3 className="text-xl font-semibold mb-4">Social Media Content</h3>

      <div className="flex flex-col gap-6">
        {/* Instagram */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Camera size={20} className="text-purple-600" />
            <h4 className="font-semibold text-gray-800">Instagram</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.instagram.map((post, i) => (
              <PostCard key={i} post={post} index={i} platform="instagram" />
            ))}
          </div>
        </section>

        {/* TikTok */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Music2 size={20} className="text-slate-600" />
            <h4 className="font-semibold text-gray-800">TikTok</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.tiktok.map((post, i) => (
              <PostCard key={i} post={post} index={i} platform="tiktok" />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
