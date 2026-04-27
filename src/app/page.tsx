"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function SplashScreen() {
  const router = useRouter();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSynced(true);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  const splashBg = PlaceHolderImages.find(img => img.id === 'splash-bg');

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 opacity-20 transition-opacity duration-1000">
        <Image
          src={splashBg?.imageUrl || "https://picsum.photos/seed/aura-splash/1200/800"}
          alt="AURA AI Background"
          fill
          className="object-cover"
          data-ai-hint={splashBg?.imageHint || "abstract kinetic speed"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
      </div>

      {/* Cockpit HUD Aesthetic Animation */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-8 relative">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-accent border-t-transparent animate-spin duration-[3s] flex items-center justify-center">
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-full border border-primary opacity-50 animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground">
              AURA AI
            </h1>
          </div>
        </div>

        <p className="text-lg md:text-xl font-headline tracking-[0.3em] text-accent uppercase animate-fade-up">
          The Kinetic Intelligence
        </p>
      </div>

      {/* Bottom Loading Bar */}
      <div className="absolute bottom-12 flex flex-col items-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 animate-pulse">
          {synced ? "System Ready" : "Synchronizing Cockpit"}
        </p>
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className={`h-full bg-primary transition-all duration-[3000ms] ease-out ${synced ? 'w-full' : 'w-0'}`} />
        </div>
      </div>
    </div>
  );
}
