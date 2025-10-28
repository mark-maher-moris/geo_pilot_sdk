'use client';

import { BlogFullScreen } from "geo-pilot-sdk";

export default function Home() {
  return (
    <BlogFullScreen
      config={{
        projectId: process.env.NEXT_PUBLIC_GEO_PILOT_PROJECT_ID!,
        secretKey: process.env.NEXT_PUBLIC_GEO_PILOT_SECRET_KEY!,
        enableSEO: true,
        enableGEO: true,
        enableAnalytics: true,
        theme: {
          layout: "grid",
          showAuthor: true,
          showDate: true,
          showReadingTime: true,
          showCategories: true,
          showTags: true,
          showExcerpt: true,
          showFeaturedImage: true,
        },
        seo: {
          enableStructuredData: true,
          enableOpenGraph: true,
          enableTwitterCards: true,
        },
        geo: {
          enableGeoTargeting: false,
          defaultLanguage: "en",
          enableAutoTranslation: false,
        }
      }}
      page={1}
      limit={12}
      searchQuery=""
      onPostClick={(post) => {
        console.log("Post clicked:", post);
      }}
      className="min-h-screen"
    />
  );
}
