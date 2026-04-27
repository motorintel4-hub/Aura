"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

const P_STEPS = [
  { id: "P1", label: "Purpose", question: "What is the primary usage for the vehicle?", options: ["Daily Commute", "Family Trips", "Weekend Adventure", "Business/Fleet"] },
  { id: "P2", label: "People", question: "How many passengers will typically use the car?", options: ["Solo/Couple", "Small Family (4)", "Large Family (5-7)", "Chauffeur Driven"] },
  { id: "P3", label: "Pattern", question: "What is your typical monthly driving range?", options: ["Under 500km", "500km - 1000km", "1000km - 2000km", "Over 2000km"] },
  { id: "P4", label: "Preferences", question: "Which feature is most important to you?", options: ["Fuel Efficiency", "Safety Tech", "Off-road Power", "Luxury Comfort"] },
  { id: "P5", label: "Price", question: "What is your comfortable budget range?", options: ["₹10L - ₹15L", "₹15L - ₹25L", "₹25L - ₹40L", "₹40L+"] },
  { id: "P6", label: "Purchase Context", question: "How soon are you planning to take delivery?", options: ["Immediately", "Within 1 Month", "2-3 Months", "Researching"] },
];

export default function DiscoveryFlowPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const step = P_STEPS[currentStep];

  const handleSelectOption = (option: string) => {
    setAnswers({ ...answers, [step.id]: option });
  };

  const handleNext = () => {
    if (currentStep < P_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isCompleted) {
    return (
      <div className="p-6 md:p-12 max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
        <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <Sparkles className="w-12 h-12 text-accent" />
        </div>
        <h1 className="text-4xl font-headline font-bold">Discovery Captured</h1>
        <p className="text-muted-foreground text-lg">AURA AI is now generating the buyer persona and briefing.</p>
        <Card className="bg-card border-accent/20">
          <CardContent className="p-8">
            <p className="text-sm font-headline uppercase tracking-widest text-accent mb-4">Core Dimensions Mapped</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {P_STEPS.map((p) => (
                <div key={p.id} className="text-left p-3 bg-muted/30 rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase">{p.label}</p>
                  <p className="text-xs font-bold text-foreground">{answers[p.id] || "N/A"}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Button
          className="w-full bg-primary text-primary-foreground font-headline h-14 amber-glow"
          onClick={() => router.push("/customers/1")}
        >
          VIEW PERSONA INTEL
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-12 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-headline font-bold">Discovery Flow</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-accent border-accent/30 text-[10px] px-2">
              <Sparkles className="w-3 h-3 mr-1" /> KINETIC CO-PILOT ACTIVE
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          {P_STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-8 rounded-full transition-all duration-300",
                i <= currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 animate-fade-up">
          {/* AI Suggestion Card */}
          <Card className="bg-accent/10 border-accent/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent-foreground" />
              </div>
              <p className="text-xs text-foreground/80">
                <span className="font-bold text-accent">Co-Pilot Tip:</span> Ask about their weekend activities to narrow down between Commuter and SUV models.
              </p>
            </CardContent>
          </Card>

          {/* Module Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-headline uppercase tracking-widest text-primary">Dimension {step.id}: {step.label}</p>
              <h2 className="text-2xl md:text-3xl font-bold">{step.question}</h2>
            </div>

            {/* Answer Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {step.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  className={cn(
                    "p-6 rounded-xl border-2 text-left transition-all group relative overflow-hidden",
                    answers[step.id] === option
                      ? "border-primary bg-primary/10 amber-glow"
                      : "border-border bg-card hover:border-accent/30 hover:bg-muted"
                  )}
                >
                  <p className="font-headline font-bold text-sm tracking-widest uppercase">{option}</p>
                  {answers[step.id] === option && (
                    <div className="absolute top-2 right-2">
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <ArrowRight className="w-2 h-2 text-primary-foreground" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Free Text Notes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Additional Observations</Label>
                <Button variant="ghost" size="sm" className="text-accent gap-2">
                  <Mic className="w-4 h-4" /> Voice Capture
                </Button>
              </div>
              <Textarea
                placeholder="Type any specific customer cues or requirements here..."
                className="bg-muted border-none min-h-[100px] resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-border">
            <Button variant="ghost" className="text-muted-foreground" onClick={handleBack} disabled={currentStep === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> BACK
            </Button>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-muted-foreground">SKIP</Button>
              <Button
                className="bg-primary text-primary-foreground font-headline h-12 px-8 amber-glow"
                disabled={!answers[step.id]}
                onClick={handleNext}
              >
                {currentStep === P_STEPS.length - 1 ? "FINISH" : "NEXT"}
              </Button>
            </div>
          </div>

          <div className="flex justify-center items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" /> Secure Data Entry Encrypted
          </div>
        </div>

        {/* Live Preview Panel (Desktop Only) */}
        <div className="hidden lg:block space-y-6">
          <Card className="bg-card border-none sticky top-8">
            <CardContent className="p-6">
              <h3 className="text-sm font-headline font-bold uppercase tracking-widest mb-6 pb-4 border-b border-border">Profile Builder</h3>
              <div className="space-y-4">
                {P_STEPS.map((p, i) => (
                  <div key={p.id} className={cn(
                    "flex items-start gap-4 transition-all",
                    i > currentStep ? "opacity-30" : "opacity-100"
                  )}>
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                      answers[p.id] ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {p.id}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">{p.label}</p>
                      <p className="text-xs font-medium">{answers[p.id] || "Awaiting input..."}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
