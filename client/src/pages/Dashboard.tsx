import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  Coins,
  History,
  PieChart,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import { format } from "date-fns";

interface PortfolioData {
  totalValue: string;
  upxBalance: string;
  upxValue: string;
  change24h: number;
  walletAddress?: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: string;
  currency: string;
  status: string;
  txHash?: string;
  chain?: string;
  createdAt: string;
}

export default function Dashboard() {
  const [copied, setCopied] = useState(false);

  const { data: portfolio } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const mockPortfolio: PortfolioData = portfolio || {
    totalValue: "$12,450.00",
    upxBalance: "45,000 UPX",
    upxValue: "$9,000.00",
    change24h: 5.2,
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f6aa45",
  };

  const mockTransactions: Transaction[] = transactions.length > 0 ? transactions : [
    { id: "1", type: "purchase", amount: "5000", currency: "UPX", status: "completed", txHash: "0xabc...123", chain: "Ethereum", createdAt: new Date().toISOString() },
    { id: "2", type: "transfer", amount: "1000", currency: "UPX", status: "completed", txHash: "0xdef...456", chain: "Polygon", createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: "3", type: "purchase", amount: "2500", currency: "UPX", status: "pending", chain: "Ethereum", createdAt: new Date(Date.now() - 172800000).toISOString() },
  ];

  const handleCopyAddress = () => {
    if (mockPortfolio.walletAddress) {
      navigator.clipboard.writeText(mockPortfolio.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case "transfer":
        return <ArrowUpRight className="w-4 h-4 text-blue-500" />;
      case "withdrawal":
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      default:
        return <Coins className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6" data-testid="dashboard-page">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            My Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your UPX tokens and track transactions
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" data-testid="button-connect-wallet">
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
          <Button size="sm" data-testid="button-buy-upx">
            <CreditCard className="w-4 h-4 mr-2" />
            Buy UPX
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                UPX Balance
              </span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-upx-balance">{mockPortfolio.upxBalance}</p>
            <p className="text-xs text-muted-foreground mt-1">{mockPortfolio.upxValue}</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Portfolio Value
              </span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-portfolio-value">{mockPortfolio.totalValue}</p>
            <div className="flex items-center gap-1 mt-1">
              {mockPortfolio.change24h >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span className={`text-xs ${mockPortfolio.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                {mockPortfolio.change24h >= 0 ? "+" : ""}{mockPortfolio.change24h}% (24h)
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <History className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Transactions
              </span>
            </div>
            <p className="text-2xl font-bold" data-testid="text-transaction-count">{mockTransactions.length}</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Wallet
              </span>
            </div>
            {mockPortfolio.walletAddress ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono truncate" data-testid="text-wallet-address">
                  {mockPortfolio.walletAddress.slice(0, 6)}...{mockPortfolio.walletAddress.slice(-4)}
                </p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={handleCopyAddress}
                  data-testid="button-copy-address"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not connected</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">Ethereum Mainnet</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="transactions" data-testid="tab-transactions">
            Transaction History
          </TabsTrigger>
          <TabsTrigger value="portfolio" data-testid="tab-portfolio">
            Portfolio
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="mt-4">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <CardDescription>Your latest UPX transactions across all chains</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Chain</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Tx</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((tx) => (
                      <TableRow key={tx.id} data-testid={`row-transaction-${tx.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(tx.type)}
                            <span className="capitalize">{tx.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          {tx.amount} {tx.currency}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{tx.chain || "N/A"}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(tx.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(tx.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {tx.txHash ? (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              data-testid={`button-view-tx-${tx.id}`}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="portfolio" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Token Holdings</CardTitle>
                <CardDescription>Your multi-chain portfolio breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">UPX</span>
                      </div>
                      <div>
                        <p className="font-medium">UnityPay Token</p>
                        <p className="text-xs text-muted-foreground">Ethereum</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-medium">45,000 UPX</p>
                      <p className="text-xs text-muted-foreground">$9,000.00</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-500">ETH</span>
                      </div>
                      <div>
                        <p className="font-medium">Ethereum</p>
                        <p className="text-xs text-muted-foreground">Mainnet</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-medium">1.25 ETH</p>
                      <p className="text-xs text-muted-foreground">$2,500.00</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-purple-500">MATIC</span>
                      </div>
                      <div>
                        <p className="font-medium">Polygon</p>
                        <p className="text-xs text-muted-foreground">Layer 2</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-medium">500 MATIC</p>
                      <p className="text-xs text-muted-foreground">$450.00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Connected Chains</CardTitle>
                <CardDescription>Networks you've connected to</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="font-medium">Ethereum Mainnet</span>
                    </div>
                    <Badge variant="outline">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="font-medium">Polygon</span>
                    </div>
                    <Badge variant="outline">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                      <span className="font-medium">Solana</span>
                    </div>
                    <Badge variant="secondary">Not Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                      <span className="font-medium">Bitcoin</span>
                    </div>
                    <Badge variant="secondary">Not Connected</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
