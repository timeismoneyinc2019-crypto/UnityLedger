import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet as WalletIcon, 
  Link as LinkIcon, 
  Unlink, 
  Copy, 
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SiEthereum, SiPolygon, SiSolana, SiBitcoin } from "react-icons/si";

interface ChainWallet {
  id: string;
  name: string;
  symbol: string;
  icon: typeof SiEthereum;
  color: string;
  bgColor: string;
  explorerUrl: string;
  connected: boolean;
  address: string | null;
  balance: string | null;
  nativeBalance: string | null;
}

const MOCK_WALLETS: Record<string, { address: string; balance: string; nativeBalance: string }> = {
  ethereum: { 
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f6aa45", 
    balance: "25,000 UPX",
    nativeBalance: "1.234 ETH"
  },
  polygon: { 
    address: "0x8912aE4E3F9f3d8f7921c12Dc2bA9ed3f1c3e5a7", 
    balance: "15,000 UPX",
    nativeBalance: "45.67 MATIC"
  },
  solana: { 
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", 
    balance: "5,000 UPX",
    nativeBalance: "12.5 SOL"
  },
  bitcoin: { 
    address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq", 
    balance: "0 UPX",
    nativeBalance: "0.0125 BTC"
  },
};

export default function WalletPage() {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [wallets, setWallets] = useState<ChainWallet[]>([
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      icon: SiEthereum,
      color: "text-[#627EEA]",
      bgColor: "bg-[#627EEA]/10",
      explorerUrl: "https://etherscan.io/address/",
      connected: false,
      address: null,
      balance: null,
      nativeBalance: null,
    },
    {
      id: "polygon",
      name: "Polygon",
      symbol: "MATIC",
      icon: SiPolygon,
      color: "text-[#8247E5]",
      bgColor: "bg-[#8247E5]/10",
      explorerUrl: "https://polygonscan.com/address/",
      connected: false,
      address: null,
      balance: null,
      nativeBalance: null,
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      icon: SiSolana,
      color: "text-[#14F195]",
      bgColor: "bg-[#14F195]/10",
      explorerUrl: "https://solscan.io/account/",
      connected: false,
      address: null,
      balance: null,
      nativeBalance: null,
    },
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      icon: SiBitcoin,
      color: "text-[#F7931A]",
      bgColor: "bg-[#F7931A]/10",
      explorerUrl: "https://blockchair.com/bitcoin/address/",
      connected: false,
      address: null,
      balance: null,
      nativeBalance: null,
    },
  ]);

  const handleConnect = async (chainId: string) => {
    setConnecting(chainId);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockData = MOCK_WALLETS[chainId];
    
    setWallets(prev => prev.map(w => 
      w.id === chainId 
        ? { ...w, connected: true, ...mockData }
        : w
    ));
    
    setConnecting(null);
    
    toast({
      title: "Wallet Connected",
      description: `Successfully connected to ${chainId.charAt(0).toUpperCase() + chainId.slice(1)} network`,
    });
  };

  const handleDisconnect = (chainId: string) => {
    setWallets(prev => prev.map(w => 
      w.id === chainId 
        ? { ...w, connected: false, address: null, balance: null, nativeBalance: null }
        : w
    ));
    
    toast({
      title: "Wallet Disconnected",
      description: `Disconnected from ${chainId.charAt(0).toUpperCase() + chainId.slice(1)} network`,
    });
  };

  const copyAddress = (address: string, chainId: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(chainId);
    setTimeout(() => setCopiedAddress(null), 2000);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const formatAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const connectedWallets = wallets.filter(w => w.connected);
  const totalUPX = connectedWallets.reduce((sum, w) => {
    const amount = parseInt(w.balance?.replace(/[^0-9]/g, "") || "0");
    return sum + amount;
  }, 0);

  return (
    <div className="container max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
          Multi-Chain Wallet
        </h1>
        <p className="text-muted-foreground">
          Connect your wallets across multiple blockchains to manage your UPX tokens
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <WalletIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Connected Wallets</p>
                <p className="text-2xl font-bold" data-testid="text-connected-count">
                  {connectedWallets.length} / {wallets.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total UPX Balance</p>
                <p className="text-2xl font-bold" data-testid="text-total-upx">
                  {totalUPX.toLocaleString()} UPX
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Supported Chains</p>
                <p className="text-2xl font-bold" data-testid="text-chain-count">
                  {wallets.length} Networks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wallets.map((wallet) => {
          const Icon = wallet.icon;
          const isConnecting = connecting === wallet.id;

          return (
            <Card 
              key={wallet.id} 
              className={`transition-all ${wallet.connected ? "border-green-500/30" : ""}`}
              data-testid={`card-wallet-${wallet.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${wallet.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${wallet.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{wallet.name}</CardTitle>
                      <CardDescription>{wallet.symbol} Network</CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={wallet.connected ? "default" : "secondary"}
                    className={wallet.connected ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""}
                  >
                    {wallet.connected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                {wallet.connected ? (
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Address</span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs" data-testid={`text-address-${wallet.id}`}>
                            {formatAddress(wallet.address!)}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyAddress(wallet.address!, wallet.id)}
                            data-testid={`button-copy-${wallet.id}`}
                          >
                            {copiedAddress === wallet.id ? (
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => window.open(`${wallet.explorerUrl}${wallet.address}`, "_blank")}
                            data-testid={`button-explorer-${wallet.id}`}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">UPX Balance</span>
                        <span className="font-medium" data-testid={`text-upx-balance-${wallet.id}`}>
                          {wallet.balance}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Native Balance</span>
                        <span className="font-medium" data-testid={`text-native-balance-${wallet.id}`}>
                          {wallet.nativeBalance}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleDisconnect(wallet.id)}
                        data-testid={`button-disconnect-${wallet.id}`}
                      >
                        <Unlink className="w-4 h-4 mr-2" />
                        Disconnect
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        data-testid={`button-refresh-${wallet.id}`}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Connect your {wallet.name} wallet to view your UPX balance
                      </p>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => handleConnect(wallet.id)}
                      disabled={isConnecting}
                      data-testid={`button-connect-${wallet.id}`}
                    >
                      {isConnecting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-4 h-4 mr-2" />
                          Connect {wallet.name}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium mb-1">Multi-Chain Support</p>
              <p className="text-sm text-muted-foreground">
                UnityPay 2045 supports UPX tokens across Ethereum, Polygon, Solana, and Bitcoin networks. 
                Your tokens are bridgeable across chains through the Prime Brain governance system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
