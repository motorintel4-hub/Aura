"use client"

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    router.push("/profile-setup");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <Button
        variant="ghost"
        className="absolute top-6 left-6 text-foreground"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="w-full max-w-md bg-card border-none shadow-2xl">
        <CardContent className="pt-12 pb-8 px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-headline font-bold text-foreground mb-4 uppercase">
              Verify Your Number
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter the six-digit OTP sent to your masked phone number +91 ******450
            </p>
          </div>

          <div className="flex justify-between gap-2 mb-8">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 bg-muted border-none rounded-md text-center text-xl font-bold text-primary focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            ))}
          </div>

          <div className="text-center mb-8">
            <Button
              variant="link"
              disabled={timer > 0}
              className="text-xs text-accent uppercase tracking-widest disabled:text-muted-foreground"
              onClick={() => setTimer(30)}
            >
              {timer > 0 ? `Resend code in 00:${timer.toString().padStart(2, '0')}` : "Resend Code"}
            </Button>
          </div>

          <Button
            className="w-full bg-primary text-primary-foreground font-headline h-12 hover:amber-glow"
            onClick={handleVerify}
          >
            VERIFY AND CONTINUE
          </Button>

          <div className="mt-8 text-center">
            <Button variant="link" className="text-xs text-muted-foreground">
              Having trouble? Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
