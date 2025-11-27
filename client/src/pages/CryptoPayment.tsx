import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Copy, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  QrCode,
  Wallet
} from "lucide-react";
import { SiEthereum, SiPolygon, SiSolana, SiBitcoin } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

interface CryptoNetwork {
  id: string;
  name: string;
  symbol: string;
  icon: typeof SiEthereum;
  color: string;
  bgColor: string;
  address: string;
  explorerUrl: string;
  rate: number;
}

const UPX_PACKAGES = [
  { id: "starter", name: "Starter Pack", upx: 1000, usd: 9.99 },
  { id: "growth", name: "Growth Pack", upx: 5000, usd: 39.99 },
  { id: "pro", name: "Pro Pack", upx: 25000, usd: 179.99 },
  { id: "elite", name: "Elite Pack", upx: 100000, usd: 599.99 },
];

const CRYPTO_NETWORKS: CryptoNetwork[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    icon: SiEthereum,
    color: "text-[#627EEA]",
    bgColor: "bg-[#627EEA]/10",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f6aa45",
    explorerUrl: "https://etherscan.io/address/",
    rate: 3200,
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    icon: SiPolygon,
    color: "text-[#8247E5]",
    bgColor: "bg-[#8247E5]/10",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f6aa45",
    explorerUrl: "https://polygonscan.com/address/",
    rate: 0.85,
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    icon: SiSolana,
    color: "text-[#14F195]",
    bgColor: "bg-[#14F195]/10",
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    explorerUrl: "https://solscan.io/account/",
    rate: 145,
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    icon: SiBitcoin,
    color: "text-[#F7931A]",
    bgColor: "bg-[#F7931A]/10",
    address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    explorerUrl: "https://blockchair.com/bitcoin/address/",
    rate: 95000,
  },
];

export default function CryptoPayment() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState(UPX_PACKAGES[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(CRYPTO_NETWORKS[0]);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "confirming" | "complete">("pending");
  const [timeRemaining, setTimeRemaining] = useState(1800);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const packageId = params.get("package");
    if (packageId) {
      const pkg = UPX_PACKAGES.find(p => p.id === packageId);
      if (pkg) setSelectedPackage(pkg);
    }
  }, []);

  useEffect(() => {
    if (timeRemaining > 0 && paymentStatus === "pending") {
      const timer = setTimeout(() => setTimeRemaining(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, paymentStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateCryptoAmount = (usd: number, rate: number) => {
    return (usd / rate).toFixed(8);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(selectedNetwork.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
    toast({
      title: "Address Copied",
      description: `${selectedNetwork.name} wallet address copied to clipboard`,
    });
  };

  const generateQRData = () => {
    const amount = calculateCryptoAmount(selectedPackage.usd, selectedNetwork.rate);
    if (selectedNetwork.id === "ethereum" || selectedNetwork.id === "polygon") {
      return `ethereum:${selectedNetwork.address}?value=${amount}`;
    } else if (selectedNetwork.id === "bitcoin") {
      return `bitcoin:${selectedNetwork.address}?amount=${amount}`;
    } else if (selectedNetwork.id === "solana") {
      return `solana:${selectedNetwork.address}?amount=${amount}`;
    }
    return selectedNetwork.address;
  };

  const simulatePaymentConfirmation = () => {
    setPaymentStatus("confirming");
    setTimeout(() => {
      setPaymentStatus("complete");
      toast({
        title: "Payment Confirmed!",
        description: `${selectedPackage.upx.toLocaleString()} UPX tokens have been credited to your account`,
      });
    }, 3000);
  };

  const Icon = selectedNetwork.icon;
  const cryptoAmount = calculateCryptoAmount(selectedPackage.usd, selectedNetwork.rate);

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate("/purchase")}
        data-testid="button-back"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Packages
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
          Crypto Payment
        </h1>
        <p className="text-muted-foreground">
          Send cryptocurrency to purchase UPX tokens instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Select Package
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {UPX_PACKAGES.map((pkg) => (
                  <Button
                    key={pkg.id}
                    variant={selectedPackage.id === pkg.id ? "default" : "outline"}
                    className="h-auto py-3 flex flex-col items-start"
                    onClick={() => setSelectedPackage(pkg)}
                    data-testid={`button-package-${pkg.id}`}
                  >
                    <span className="font-semibold">{pkg.upx.toLocaleString()} UPX</span>
                    <span className="text-sm opacity-80">${pkg.usd}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Network</CardTitle>
              <CardDescription>Choose which cryptocurrency to pay with</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedNetwork.id} onValueChange={(v) => {
                const network = CRYPTO_NETWORKS.find(n => n.id === v);
                if (network) setSelectedNetwork(network);
              }}>
                <TabsList className="grid grid-cols-4 w-full">
                  {CRYPTO_NETWORKS.map((network) => {
                    const NetworkIcon = network.icon;
                    return (
                      <TabsTrigger 
                        key={network.id} 
                        value={network.id}
                        className="flex items-center gap-2"
                        data-testid={`tab-network-${network.id}`}
                      >
                        <NetworkIcon className={`w-4 h-4 ${network.color}`} />
                        <span className="hidden sm:inline">{network.symbol}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {CRYPTO_NETWORKS.map((network) => (
                  <TabsContent key={network.id} value={network.id} className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div>
                          <p className="text-sm text-muted-foreground">Amount to Send</p>
                          <p className="text-2xl font-bold" data-testid={`text-amount-${network.id}`}>
                            {calculateCryptoAmount(selectedPackage.usd, network.rate)} {network.symbol}
                          </p>
                          <p className="text-sm text-muted-foreground">≈ ${selectedPackage.usd} USD</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full ${network.bgColor} flex items-center justify-center`}>
                          {(() => {
                            const NIcon = network.icon;
                            return <NIcon className={`w-6 h-6 ${network.color}`} />;
                          })()}
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">Wallet Address</p>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={copyAddress}
                              data-testid={`button-copy-address-${network.id}`}
                            >
                              {copiedAddress ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`${network.explorerUrl}${network.address}`, "_blank")}
                              data-testid={`button-explorer-${network.id}`}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <code 
                          className="block p-3 rounded bg-muted text-xs break-all"
                          data-testid={`text-address-${network.id}`}
                        >
                          {network.address}
                        </code>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Important Instructions</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Send exactly the amount shown above to avoid delays</li>
                    <li>Only send {selectedNetwork.symbol} on the {selectedNetwork.name} network</li>
                    <li>Tokens will be credited after network confirmation</li>
                    <li>Keep your transaction hash for reference</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Package</span>
                <span className="font-medium">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">UPX Tokens</span>
                <span className="font-medium">{selectedPackage.upx.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network</span>
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${selectedNetwork.color}`} />
                  <span className="font-medium">{selectedNetwork.name}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg">
                  <span className="font-medium">Total</span>
                  <span className="font-bold" data-testid="text-total-crypto">
                    {cryptoAmount} {selectedNetwork.symbol}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground text-right">≈ ${selectedPackage.usd} USD</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Payment Status</CardTitle>
                <Badge 
                  variant={paymentStatus === "complete" ? "default" : "secondary"}
                  className={paymentStatus === "complete" ? "bg-green-500/10 text-green-500" : ""}
                >
                  {paymentStatus === "pending" && "Awaiting Payment"}
                  {paymentStatus === "confirming" && "Confirming..."}
                  {paymentStatus === "complete" && "Complete"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentStatus === "pending" && (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Time remaining: {formatTime(timeRemaining)}</span>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 flex flex-col items-center gap-3">
                    <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-black" />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Scan QR code with your wallet app
                    </p>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={simulatePaymentConfirmation}
                    data-testid="button-simulate-payment"
                  >
                    I've Sent the Payment
                  </Button>
                </>
              )}

              {paymentStatus === "confirming" && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <p className="text-sm text-muted-foreground">Waiting for network confirmation...</p>
                </div>
              )}

              {paymentStatus === "complete" && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Payment Confirmed!</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPackage.upx.toLocaleString()} UPX credited to your account
                    </p>
                  </div>
                  <Button 
                    className="w-full mt-2"
                    onClick={() => navigate("/wallet")}
                    data-testid="button-view-wallet"
                  >
                    View Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
