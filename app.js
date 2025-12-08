// App.js
import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

// Holographic background
function HoloBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#1A1A2E] to-[#0D0D0D]">
      <div className="absolute inset-0 animate-pulse-slow bg-[radial-gradient(circle,rgba(255,106,0,0.2),transparent)]"></div>
    </div>
  );
}

// Navbar
function Navbar({ setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="w-full bg-gray-900 bg-opacity-80 backdrop-blur-md px-6 py-4 flex items-center justify-between fixed top-0 z-50">
      <div className="text-2xl font-bold text-orange-500 cursor-pointer" onClick={() => setPage("dashboard")}>UnityLedger</div>
      <div className="relative">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white px-4 py-2 rounded hover:bg-gray-800 transition">Menu</button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded shadow-lg overflow-hidden z-50">
            <button onClick={() => setPage("dashboard")} className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700">Dashboard</button>
            <button onClick={() => setPage("wallet")} className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700">Wallet</button>
            <button onClick={() => setPage("swap")} className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700">Swap</button>
            <button onClick={() => setPage("analytics")} className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700">Analytics</button>
            <button onClick={() => setPage("boardroom")} className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700">Boardroom</button>
            <button onClick={() => setPage("whitepaper")} className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700">White Paper</button>
            <button onClick={() => setPage("settings")} className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700">Settings</button>
          </div>
        )}
      </div>
    </nav>
  );
}

// Token Dashboard
function TokenCard() {
  const [balance, setBalance] = useState(0);
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  useEffect(() => {
    async function fetchBalance() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, [
          "function balanceOf(address owner) view returns (uint256)",
          "function totalSupply() view returns (uint256)"
        ], provider);
        const accounts = await provider.send("eth_requestAccounts", []);
        const bal = await contract.balanceOf(accounts[0]);
        setBalance(ethers.formatUnits(bal, 18));
      }
    }
    fetchBalance();
  }, []);

  return (
    <div className="token-card bg-white/5 rounded-2xl p-8 text-center shadow-lg hover:scale-105 transition transform">
      <h2 className="text-xl font-bold text-orange-500 mb-2">UPX Token</h2>
      <p className="text-gray-300 mb-4">Balance: {balance}</p>
    </div>
  );
}

// Wallet
function Wallet() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  useEffect(() => {
    async function connectWallet() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        const contract = new ethers.Contract(contractAddress, [
          "function balanceOf(address owner) view returns (uint256)",
          "function transfer(address to, uint256 amount) returns (bool)"
        ], provider.getSigner());
        const bal = await contract.balanceOf(accounts[0]);
        setBalance(ethers.formatUnits(bal, 18));
      }
    }
    connectWallet();
  }, []);

  const sendToken = async () => {
    if (!recipient || !amount) return alert("Enter recipient and amount");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, ["function transfer(address to, uint256 amount) returns (bool)"], provider.getSigner());
    const tx = await contract.transfer(recipient, ethers.parseUnits(amount, 18));
    await tx.wait();
    alert("Transaction completed");
  };

  return (
    <div className="wallet-page p-8 flex flex-col items-center">
      <h2 className="text-2xl text-orange-500 font-bold mb-4">Wallet</h2>
      <p className="mb-2">Connected Account: {account}</p>
      <p className="mb-4">Balance: {balance}</p>
      <input type="text" placeholder="Recipient Address" value={recipient} onChange={e=>setRecipient(e.target.value)} className="mb-2 p-2 rounded text-black w-80"/>
      <input type="number" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} className="mb-2 p-2 rounded text-black w-80"/>
      <button onClick={sendToken} className="bg-orange-500 px-6 py-3 rounded-lg text-white hover:shadow-lg transition">Send UPX</button>
    </div>
  );
}

// Swap
function Swap() {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const swapTokens = () => {
    if (!fromAmount || !toAmount) return alert("Enter amounts");
    alert(`Swapped ${fromAmount} UPX for ${toAmount} other token`);
  };

  return (
    <div className="swap-page p-8 flex flex-col items-center">
      <h2 className="text-2xl text-orange-500 font-bold mb-4">Swap</h2>
      <input type="number" placeholder="From UPX" value={fromAmount} onChange={e=>setFromAmount(e.target.value)} className="mb-2 p-2 rounded text-black w-80"/>
      <input type="number" placeholder="To Token" value={toAmount} onChange={e=>setToAmount(e.target.value)} className="mb-2 p-2 rounded text-black w-80"/>
      <button onClick={swapTokens} className="bg-orange-500 px-6 py-3 rounded-lg text-white hover:shadow-lg transition">Swap</button>
    </div>
  );
}

// Analytics
function Analytics() {
  const data = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun"],
    datasets: [{
      label: "UPX Price",
      data: [0.1,0.15,0.2,0.18,0.25,0.3],
      borderColor: "#FF6A00",
      backgroundColor: "rgba(255,106,0,0.3)",
      tension: 0.4
    }]
  };

  return (
    <div className="analytics-page p-8">
      <h2 className="text-2xl text-orange-500 font-bold mb-4">Analytics</h2>
      <Line data={data} />
    </div>
  );
}

// Boardroom with full intelligent AI
function Boardroom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const synthRef = useRef(window.speechSynthesis);
  const aiMemoryRef = useRef([]);

  const intelligentAIResponse = (msg) => {
    aiMemoryRef.current.push({ role: "user", content: msg });
    let response = "";

    const lower = msg.toLowerCase();
    if (lower.includes("balance") || lower.includes("upx")) {
      response = "Guardian: Your UPX balance is strong. Long-term strategy suggests holding while monitoring market signals.";
    } else if (lower.includes("swap") || lower.includes("exchange")) {
      response = "Nano-Agent: Consider diversifying: swap a portion of UPX to complementary assets to mitigate risk.";
    } else if (lower.includes("project") || lower.includes("task")) {
      response = "Guardian: Prioritize your Trinity project tasks in order of impact and feasibility.";
    } else if (lower.includes("code") || lower.includes("develop")) {
      response = "Nano-Agent: Modularize your code and implement robust AI agent interactions for efficiency and scalability.";
    } else if (lower.includes("strategy") || lower.includes("future")) {
      response = "Guardian: Forward-thinking recommendation: identify emerging trends, automate repetitive processes, and focus on long-term scalability.";
    } else {
      response = "Guardian: I understand. Let's consider this carefully. Can you clarify the goal so I can provide a forward-looking suggestion?";
    }

    aiMemoryRef.current.push({ role: "ai", content: response });
    return response;
  };

  const sendMessage = () => {
    if (!input) return;
    const userMsg = { from: "You", text: input };
    const aiText = intelligentAIResponse(input);
    const aiMsg = { from: aiText.split(":")[0], text: aiText.split(":")[1].trim() };

    setMessages(prev => [...prev, userMsg, aiMsg]);

    const utter = new SpeechSynthesisUtterance(aiMsg.text);
    synthRef.current.speak(utter);

    setInput("");
  };

  return (
    <div className="boardroom-page p-8 flex flex-col items-center">
      <h2 className="text-2xl text-orange-500 font-bold mb-4">Boardroom</h2>
      <div className="chat-window bg-white/5 rounded-xl p-4 w-full max-w-2xl h-96 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.from==="You"?"text-right":"text-left"}`}>
            <span className="font-bold">{m.from}: </span>{m.text}
          </div>
        ))}
      </div>
      <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type or speak..." className="mb-2 p-2 rounded text-black w-80"/>
      <button onClick={sendMessage} className="bg-orange-500 px-6 py-3 rounded-lg text-white hover:shadow-lg transition">
        Send / Speak
      </button>
    </div>
  );
}

// White Paper
function WhitePaper() {
  return (
    <div className="whitepaper-page p-8 flex flex-col items-center">
      <h2 className="text-2xl text-orange-500 font-bold mb-4">UnityLedger White Paper</h2>
      <iframe
        src="https://www.icloud.com/freeform/02fHfLyrHlotC1rOylwwvkfdA#UIX_Whitepaper"
        title="UnityLedger White Paper"
        className="w-full max-w-4xl h-[80vh] rounded-xl shadow-lg"
      ></iframe>
      <p className="text-gray-300 mt-4 text-center">Scroll or zoom to read the complete white paper.</p>
    </div>
  );
}

// Main App
function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="App min-h-screen text-white pt-20 relative">
      <HoloBackground/>
      <Navbar setPage={setPage}/>
      {page === "dashboard" && (
        <div className="text-center py-10">
          <h1 className="text-4xl font-bold text-orange-500 mb-4">UPX Token Dashboard</h1>
          <p className="text-gray-300">Manage your tokens and interact with UnityLedger</p>
          <div className="flex justify-center gap-8 flex-wrap mt-8 px-6">
            <TokenCard/>
          </div>
        </div>
      )}
      {page === "wallet" && <Wallet/>}
      {page === "swap" && <Swap/>}
      {page === "analytics" && <Analytics/>}
      {page === "boardroom" && <Boardroom/>}
      {page === "whitepaper" && <WhitePaper/>}
      {page === "settings" && (
        <div className="settings-page p-8">
          <h2 className="text-2xl text-orange-500 font-bold">Settings</h2>
          <p className="text-gray-300 mt-2">Customize your UnityLedger experience here.</p>
        </div>
      )}
    </div>
  );
}

export default App;