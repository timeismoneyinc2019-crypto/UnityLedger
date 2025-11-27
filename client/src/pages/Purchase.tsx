import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Coins, Zap, Crown, Rocket, CheckCircle2, Wallet, CreditCard } from "lucide-react";
import { SiEthereum, SiBitcoin } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Price {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: any;
}

interface Product {
  id: string;
  name: string;
  description: string;
  active: boolean;
  metadata: Record<string, string>;
  prices: Price[];
}

const PACKAGE_ICONS: Record<string, typeof Coins> = {
  starter: Coins,
  growth: Zap,
  pro: Rocket,
  elite: Crown,
};

const PACKAGE_COLORS: Record<string, string> = {
  starter: "from-blue-500/20 to-blue-600/20",
  growth: "from-green-500/20 to-green-600/20",
  pro: "from-purple-500/20 to-purple-600/20",
  elite: "from-amber-500/20 to-amber-600/20",
};

const PACKAGE_BADGE_COLORS: Record<string, string> = {
  starter: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  growth: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  pro: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  elite: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
};

const PACKAGE_BENEFITS: Record<string, string[]> = {
  starter: [
    "1,000 UPX tokens",
    "Basic governance voting",
    "Standard transaction speed",
  ],
  growth: [
    "5,000 UPX tokens",
    "+10% bonus tokens",
    "Priority voting power",
    "Faster transactions",
  ],
  pro: [
    "25,000 UPX tokens",
    "+20% bonus tokens",
    "Premium governance access",
    "Express transactions",
    "Exclusive agent insights",
  ],
  elite: [
    "100,000 UPX tokens",
    "+30% bonus tokens",
    "VIP governance status",
    "Instant transactions",
    "Private agent consultations",
    "Early feature access",
  ],
};

export default function Purchase() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const { data: productsData, isLoading } = useQuery<{ data: Product[] }>({
    queryKey: ["/api/stripe/products"],
  });

  const checkoutMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const response = await apiRequest("POST", "/api/stripe/checkout", { priceId });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Checkout Failed",
        description: error.message || "Unable to start checkout process",
        variant: "destructive",
      });
      setLoadingPriceId(null);
    },
  });

  const handlePurchase = (priceId: string) => {
    setLoadingPriceId(priceId);
    checkoutMutation.mutate(priceId);
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const products = productsData?.data || [];
  const sortedProducts = [...products].sort((a, b) => {
    const aAmount = parseInt(a.metadata?.upx_amount || "0");
    const bAmount = parseInt(b.metadata?.upx_amount || "0");
    return aAmount - bAmount;
  });

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
          Buy UPX Tokens
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Power your multi-chain governance with UPX tokens. Choose a package that fits your needs and join the future of decentralized payments.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading packages...</span>
        </div>
      ) : products.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <Coins className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No packages available at the moment. Please check back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
            const tier = product.metadata?.package_tier || "starter";
            const Icon = PACKAGE_ICONS[tier] || Coins;
            const gradientClass = PACKAGE_COLORS[tier] || PACKAGE_COLORS.starter;
            const badgeClass = PACKAGE_BADGE_COLORS[tier] || PACKAGE_BADGE_COLORS.starter;
            const benefits = PACKAGE_BENEFITS[tier] || PACKAGE_BENEFITS.starter;
            const price = product.prices[0];
            const upxAmount = product.metadata?.upx_amount || "0";
            const bonusPercentage = product.metadata?.bonus_percentage || "0";
            const isLoading = loadingPriceId === price?.id;
            const isElite = tier === "elite";

            return (
              <Card 
                key={product.id} 
                className={`relative overflow-hidden flex flex-col ${isElite ? "border-primary/50 shadow-lg shadow-primary/10" : ""}`}
                data-testid={`card-product-${product.id}`}
              >
                {isElite && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none rounded-bl-md bg-primary text-primary-foreground">
                      Best Value
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={`bg-gradient-to-br ${gradientClass}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-foreground" />
                    <Badge variant="secondary" className={badgeClass}>
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg" data-testid={`text-product-name-${product.id}`}>
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {product.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 pt-6">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold" data-testid={`text-product-price-${product.id}`}>
                      {price ? formatPrice(price.unit_amount, price.currency) : "N/A"}
                    </span>
                    {bonusPercentage !== "0" && (
                      <Badge variant="outline" className="ml-2 text-green-500 border-green-500/30">
                        +{bonusPercentage}% bonus
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    className="w-full"
                    size="lg"
                    variant={isElite ? "default" : "outline"}
                    onClick={() => price && handlePurchase(price.id)}
                    disabled={!price || isLoading}
                    data-testid={`button-buy-${product.id}`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Coins className="w-4 h-4 mr-2" />
                        Buy {parseInt(upxAmount).toLocaleString()} UPX
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <div className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-primary" />
                <span className="font-medium">Card Payment</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Pay securely with credit/debit card through Stripe. Instant processing.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Secure payment processing</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-5 h-5 text-primary" />
                <span className="font-medium">Crypto Payment</span>
                <Badge variant="secondary" className="text-xs">New</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Pay with ETH, MATIC, SOL, or BTC directly from your wallet.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/purchase/crypto")}
                data-testid="button-pay-crypto"
              >
                <SiEthereum className="w-4 h-4 mr-2" />
                <SiBitcoin className="w-4 h-4 mr-2" />
                Pay with Crypto
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
