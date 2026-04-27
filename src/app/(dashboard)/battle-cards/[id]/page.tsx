"use client"

import { use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronLeft, Zap, Sparkles, Star, Shield, CheckCircle2, AlertTriangle, Users } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const VEHICLE_DATA: any = {
  "grand-touring": {
    name: "MotorIntel Grand Touring",
    tagline: "Uncompromising Luxury & Performance",
    desc: "A flagship sedan engineered for executives who demand power and sophistication in every mile.",
    pitches: {
      functional: "6.0L V12 bi-turbo engine delivering 621 HP, adaptive air suspension, and level 3 autonomous features.",
      emotional: "Your arrival isn't just a presence; it's a statement of mastery. Experience the quiet pride of unparalleled engineering.",
      aspirational: "Join the elite 1%. The Grand Touring is more than a car; it's a membership to a lifestyle of peak achievement."
    },
    objections: [
      { q: "Is the maintenance cost too high?", a: "With our Kinetic Service Pack, standard maintenance is covered for 5 years, ensuring predictable ownership costs." },
      { q: "Why not choose the German rivals?", a: "We offer 20% more cabin space and a 15% better power-to-weight ratio at a more competitive entry price." }
    ],
    competitors: [
      "Superior Cabin Silence (68db at 120km/h)",
      "Next-Gen Kinetic AI Cockpit vs legacy screens",
      "5-Year Unlimited Warranty standard"
    ],
    persona: { segment: "HNI Executives", age: "40-55", lifestyle: "Golf, Private Clubs, Tech Enthusiast", quote: "I want a car that works as hard as I do." }
  },
  "adventure-suv": {
    name: "MotorIntel Adventure SUV",
    tagline: "Conquer Every Terrain",
    desc: "The ultimate companion for family escapades and off-road dominance.",
    pitches: {
      functional: "4x4 intelligent drive with 7 terrain modes, 800mm water wading depth, and 700L boot space.",
      emotional: "Don't just go on a trip; build legends with your family. Safety and soul, everywhere the road ends.",
      aspirational: "You aren't restricted by boundaries. The Adventure SUV reflects your spirit of unbridled exploration."
    },
    objections: [
      { q: "The mileage is low for city use.", a: "Our Mild-Hybrid tech recovers energy during braking, providing 15% better city efficiency than pure gas SUVs." },
      { q: "Is it too big for parking?", a: "The 360-degree Kinetic Vision system makes maneuvering easier than a compact sedan." }
    ],
    competitors: [
      "Highest ground clearance in segment (235mm)",
      "Dedicated low-range transfer case",
      "7-seater configuration with full adult legroom"
    ],
    persona: { segment: "Active Families", age: "30-45", lifestyle: "Camping, Road-trips, Weekend Sports", quote: "I need safety for my kids and power for the hills." }
  }
};

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const vehicle = VEHICLE_DATA[id] || VEHICLE_DATA["grand-touring"];
  const img = PlaceHolderImages.find(i => i.id === id);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-headline font-bold">{vehicle.name}</h1>
            <p className="text-muted-foreground">{vehicle.tagline}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-primary text-primary-foreground font-bold px-3 py-1 uppercase tracking-widest">Hot Seller</Badge>
          <Badge variant="outline" className="text-accent border-accent/30 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> AI Optimized
          </Badge>
        </div>
      </header>

      {/* Hero Visual */}
      <div className="relative h-64 md:h-[400px] rounded-2xl overflow-hidden amber-glow">
        <Image
          src={img?.imageUrl || "https://picsum.photos/seed/car/1200/800"}
          alt={vehicle.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 max-w-xl">
          <p className="text-lg text-foreground/90 leading-relaxed font-medium bg-background/50 backdrop-blur-md p-4 rounded-xl border border-white/10">
            {vehicle.desc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Pitches) */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-xl font-headline font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> The Kinetic Pitch
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { level: "Level 1", type: "Functional", content: vehicle.pitches.functional, icon: Shield },
              { level: "Level 2", type: "Emotional", content: vehicle.pitches.emotional, icon: Star },
              { level: "Level 3", type: "Aspirational", content: vehicle.pitches.aspirational, icon: Zap },
            ].map((p, i) => (
              <Card key={i} className="bg-card border-none hover:bg-muted/50 transition-colors">
                <CardHeader className="pb-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-1">{p.level}</p>
                  <CardTitle className="text-sm flex items-center justify-between">
                    {p.type} <p.icon className="w-4 h-4 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-background/40 rounded-lg italic text-sm leading-relaxed relative">
                    <span className="absolute -top-2 -left-1 text-3xl text-primary/20">"</span>
                    {p.content}
                    <span className="absolute -bottom-4 -right-1 text-3xl text-primary/20">"</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-headline font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" /> Objection Handling
            </h2>
            <div className="space-y-4">
              {vehicle.objections.map((obj: any, i: number) => (
                <Card key={i} className="bg-card border-none">
                  <CardContent className="p-6">
                    <p className="text-sm font-bold text-foreground mb-3 flex items-start gap-2">
                      <span className="text-destructive font-headline">Q.</span> {obj.q}
                    </p>
                    <div className="p-4 bg-accent/5 rounded-lg border-l-2 border-accent">
                      <p className="text-xs text-muted-foreground font-headline uppercase tracking-widest mb-2">Recommended Strategy</p>
                      <p className="text-sm leading-relaxed italic">"{obj.a}"</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-headline font-bold">Why Not Competitor?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-muted/30 border-none">
                <CardContent className="p-6 space-y-4">
                  {vehicle.competitors.map((comp: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-sm">{comp}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Button className="h-full bg-muted hover:bg-muted/80 text-foreground font-headline uppercase tracking-widest border border-border">
                VIEW FULL BATTLE MATRIX
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel (Persona & Actions) */}
        <div className="space-y-8">
          <Card className="bg-accent/10 border-accent/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" /> Target Persona
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground mb-1">Segment</p>
                <p className="text-lg font-bold text-accent">{vehicle.persona.segment}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-1">Age Range</p>
                  <p className="text-sm font-bold">{vehicle.persona.age}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-1">Lifestyle</p>
                  <p className="text-sm font-bold">High</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground mb-1">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {vehicle.persona.lifestyle.split(', ').map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-[10px] border-accent/20">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-accent/20 italic text-sm text-foreground/70">
                "{vehicle.persona.quote}"
              </div>
            </CardContent>
          </Card>

          <Button className="w-full bg-primary text-primary-foreground font-headline h-14 amber-glow">
            PRACTICE THIS PITCH
          </Button>
          <Button variant="outline" className="w-full h-14 font-headline uppercase tracking-widest border-border">
            BUILD A DEAL
          </Button>
        </div>
      </div>
    </div>
  );
}
