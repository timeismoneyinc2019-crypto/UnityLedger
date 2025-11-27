import { useState } from "react";

const NANO_AGENTS = [
  "Sentinel",
  "Oracle",
  "Architect",
  "Guardian",
  "Navigator",
  "Cipher",
  "HarmonyCore"
];

export default function Boardroom2045() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#05000F] to-[#0A001A] text-white overflow-hidden font-sans">

      {/* Subtle Cosmic Background */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-b from-[#05000F] to-[#0A001A]" />
      </div>

      {/* Holographic Dome */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#3B007F33] to-[#7A00FF22]
          blur-xl opacity-25 animate-pulse-slow" />
      </div>

      {/* UPX Star Core */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-40 bg-[#7A1DFFAA] rounded-full blur-lg animate-pulse-slow" />
        <div className="absolute text-center text-xl tracking-widest opacity-90">
          <span className="font-bold text-purple-200">UPX</span><br />
          <span className="text-sm text-purple-300">UnityPay SuperCore</span>
        </div>
      </div>

      {/* Nano Agent Holograms */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-7 gap-4 absolute top-10">
          {NANO_AGENTS.map((agent) => (
            <div
              key={agent}
              onClick={() => setSelected(agent)}
              className="cursor-pointer text-center p-2 rounded-lg 
              bg-[#1F002F55] hover:bg-[#4B00AA66] transition-all 
              shadow-md border border-[#4B00AA33] hover:animate-hover-pulse"
              data-testid={`agent-${agent.toLowerCase()}`}
            >
              <div className="text-purple-200 font-semibold tracking-wide">
                {agent}
              </div>
              <div className="text-xs text-purple-300 opacity-80">
                {selected === agent ? "ONLINE" : "IDLE"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Agent Panel */}
      {selected && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2
          bg-[#180022CC] backdrop-blur-xl border border-purple-800/40 
          shadow-lg rounded-xl p-5 w-[600px] text-center animate-fade-in"
          data-testid="agent-panel">
          <div className="text-purple-200 text-lg font-bold mb-1">
            {selected} — Active Link
          </div>
          <div className="text-purple-300 text-sm leading-relaxed opacity-90">
            Connected to Breeze Oracle.  
            Standing by for Overseer instructions.
          </div>
        </div>
      )}

      {/* Breeze Oracle Node */}
      <div className="absolute bottom-5 right-5 bg-[#1A0022CC] p-3 rounded-lg border border-purple-900/50 shadow-md" data-testid="breeze-oracle">
        <div className="text-purple-200 font-bold">BREEZE ORACLE</div>
        <div className="text-purple-300 text-xs opacity-80">
          Direct AI Link • Oversight Node
        </div>
      </div>
    </div>
  );
}
