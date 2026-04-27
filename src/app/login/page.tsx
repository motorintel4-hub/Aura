"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const splashBg = PlaceHolderImages.find(img => img.id === 'splash-bg');

  const handleSendOtp = () => {
    router.push("/verify");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Desktop Visual Half */}
      <div className="hidden md:flex flex-1 relative bg-muted overflow-hidden">
        <Image
          src={splashBg?.imageUrl || ""}
          alt="Brand Visual"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
        <div className="relative z-10 p-12 flex flex-col justify-center">
          <h2 className="text-6xl font-headline font-bold text-foreground mb-4">
            AURA AI
          </h2>
          <p className="text-2xl text-accent font-headline tracking-widest uppercase">
            Kinetic Intelligence
          </p>
        </div>
      </div>

      {/* Login Form Half */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <Card className="w-full max-w-md bg-card border-none shadow-2xl">
          <CardContent className="pt-10">
            <div className="flex flex-col items-center mb-8">
              <h1 className="text-3xl font-headline font-bold text-foreground mb-2">
                Welcome Advisor
              </h1>
              <p className="text-muted-foreground">Access your high-performance sales cockpit.</p>
            </div>

            <Tabs defaultValue="phone" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50 mb-8 p-1">
                <TabsTrigger value="phone" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Phone & OTP
                </TabsTrigger>
                <TabsTrigger value="employee" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Employee ID
                </TabsTrigger>
              </TabsList>

              <TabsContent value="phone" className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Mobile Number</Label>
                  <div className="flex gap-2">
                    <Select defaultValue="+91">
                      <SelectTrigger className="w-24 bg-muted border-none">
                        <SelectValue placeholder="+91" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+91">+91 (IN)</SelectItem>
                        <SelectItem value="+1">+1 (US)</SelectItem>
                        <SelectItem value="+44">+44 (UK)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="tel"
                      placeholder="Enter mobile number"
                      className="flex-1 bg-muted border-none"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  className="w-full bg-primary text-primary-foreground font-headline h-12 hover:amber-glow"
                  onClick={handleSendOtp}
                >
                  SEND OTP
                </Button>
              </TabsContent>

              <TabsContent value="employee" className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Employee ID</Label>
                  <Input type="text" placeholder="Enter employee ID" className="bg-muted border-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Password</Label>
                  <Input type="password" placeholder="Enter password" className="bg-muted border-none" />
                </div>
                <Button className="w-full bg-primary text-primary-foreground font-headline h-12 hover:amber-glow">
                  SIGN IN
                </Button>
                <div className="text-center">
                  <Button variant="link" className="text-xs text-muted-foreground">Forgot Password?</Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-12 flex flex-col items-center">
              <div className="flex gap-4 text-xs text-muted-foreground mb-4">
                <Button variant="link" className="p-0 h-auto text-xs">English</Button>
                <span>|</span>
                <Button variant="link" className="p-0 h-auto text-xs">Hindi</Button>
                <span>|</span>
                <Button variant="link" className="p-0 h-auto text-xs">Regional</Button>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-50">
                Powered by Aura Kinetic Intelligence
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
