'use client';

import { GEOPilotProvider } from "geo-pilot-sdk";

interface ClientProviderProps {
  children: React.ReactNode;
}

export default function ClientProvider({ children }: ClientProviderProps) {
  return (
    <GEOPilotProvider
      config={{
        projectId: process.env.NEXT_PUBLIC_GEO_PILOT_PROJECT_ID!,
        secretKey: process.env.NEXT_PUBLIC_GEO_PILOT_SECRET_KEY!,
        enableSEO: true,
        enableGEO: true,
        enableAnalytics: true,
      }}
    >
      {children}
    </GEOPilotProvider>
  );
}

