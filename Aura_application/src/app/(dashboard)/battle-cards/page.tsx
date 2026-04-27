"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, Zap, Star, Shield, Battery } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const VEHICLES = [
  {
    id: "grand-touring",
    name: "MotorIntel Grand Touring",
    tagline: "Uncompromising Luxury & Performance",
    price: "₹45.5L",
    category: "Luxury Sedan",
    icon: Star,
    color: "amber"
  },
  {
    id: "urban-commuter",
    name: "MotorIntel Urban Commuter",
    tagline: "Agile, Electric, Efficient",
    price: "₹12.8L",
    category: "Compact EV",
    icon: Battery,
    color: "teal"
  },
  {
    id: "adventure-suv",
    name: "MotorIntel Adventure SUV",
    tagline: "Conquer Every Terrain",
    price: "₹28.2L",
    category: "Rugged SUV",
    icon: Shield,
    color: "amber"
  },
  {
    id: "electric-drive",
    name: "MotorIntel Electric Drive",
    tagline: "The Future of Mobility",
    price: "₹34.9L",
    category: "Premium EV",
    icon: Zap,
    color: "teal"
  }
];

export default function BattleCardsPage() {
  const router = useRouter();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-up">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline font-bold">Battle Cards</h1>
          <p className="text-muted-foreground">Master the pitch for our core fleet.</p>
        </div>
        <Badge variant="outline" className="text-accent border-accent/30 text-[10px] px-3 py-1">
          <Zap className="w-3 h-3 mr-2" /> DATA SYNCED
        </Badge>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {VEHICLES.map((vehicle) => {
          const img = PlaceHolderImages.find(i => i.id === vehicle.id);
          return (
            <Card
              key={vehicle.id}
              className="bg-card border-none hover:amber-glow transition-all duration-300 group overflow-hidden cursor-pointer"
              onClick={() => router.push(`/battle-cards/${vehicle.id}`)}
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={img?.imageUrl || "https://picsum.photos/seed/car/400/300"}
                  alt={vehicle.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur-md border-none text-[10px]">
                  {vehicle.category}
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-headline font-bold leading-tight mb-1">{vehicle.name}</h3>
                  <p className="text-xs text-muted-foreground">{vehicle.tagline}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-accent">Starting {vehicle.price}</div>
                  <Button variant="ghost" size="icon" className="group-hover:text-primary transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Tool CTA */}
      <Card className="bg-primary/5 border-primary/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-headline font-bold">Vehicle Comparison Tool</h2>
          <p className="text-muted-foreground">Analyze variant matrices and compare head-to-head with market competitors.</p>
        </div>
        <Button className="bg-primary text-primary-foreground font-headline h-12 px-12 amber-glow">
          LAUNCH COMPARATOR
        </Button>
      </Card>
    </div>
  );
}
