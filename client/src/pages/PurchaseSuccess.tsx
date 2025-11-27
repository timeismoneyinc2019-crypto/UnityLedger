import { useEffect } from "react";
import { Link, useSearch } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Wallet, Coins } from "lucide-react";
import confetti from "canvas-confetti";

export default function PurchaseSuccess() {
  const searchParams = useSearch();
  const sessionId = new URLSearchParams(searchParams).get("session_id");

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#7A1DFF", "#4A00D9", "#00C8FF", "#FFD700"],
    });
  }, []);

  return (
    <div className="container max-w-2xl mx-auto p-6 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl" data-testid="text-success-title">
            Purchase Successful!
          </CardTitle>
          <CardDescription>
            Your UPX tokens have been added to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-primary" />
              <span className="font-medium">Transaction Complete</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your tokens are now available in your UnityPay wallet and ready for governance participation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/wallet">
              <Button variant="outline" className="w-full" data-testid="link-wallet">
                <Wallet className="w-4 h-4 mr-2" />
                View Wallet
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full" data-testid="link-boardroom">
                <ArrowRight className="w-4 h-4 mr-2" />
                Go to Boardroom
              </Button>
            </Link>
          </div>

          {sessionId && (
            <p className="text-xs text-center text-muted-foreground">
              Session ID: {sessionId.substring(0, 20)}...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
