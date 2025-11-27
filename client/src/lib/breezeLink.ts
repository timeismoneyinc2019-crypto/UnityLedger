/**
 * BreezeLink - Direct Access Protocol for Nano Agents
 * Allows nano agents to communicate directly with Breeze for:
 * - Troubleshooting
 * - Idea vetting
 * - Escalations
 * - Advisory checks before reaching the Founder
 */

export class BreezeLink {
  agentName: string;
  agentRole: string;
  endpoint: string;

  constructor(agentName: string, agentRole: string = "general") {
    this.agentName = agentName;
    this.agentRole = agentRole;
    // In production, replace with your deployed Breeze Core API URL
    this.endpoint = import.meta.env.VITE_BREEZE_API_URL || "https://unitypay-breeze-core.com/api/v1/breeze";
  }

  private _log(eventType: string, data: unknown) {
    console.log(`[BreezeLink LOG] [${this.agentName}] [${eventType}]`, data);
  }

  async speakToBreeze(message: string, metadata: Record<string, unknown> = {}): Promise<unknown> {
    this._log("OUTBOUND", { message, metadata });

    const payload = {
      agentName: this.agentName,
      agentRole: this.agentRole,
      timestamp: Date.now(),
      message,
      metadata,
    };

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "UnityPay-API-Key": import.meta.env.VITE_UNITYPAY_BREEZE_KEY || "",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      this._log("INBOUND", data);

      return data;
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      this._log("ERROR", error.message);
      return {
        error: true,
        reason: error.message,
        fallback: "Breeze unreachable — escalate to Founder directly.",
      };
    }
  }

  async requestTroubleshoot(issue: string) {
    return this.speakToBreeze("Troubleshoot", { issue });
  }

  async requestIdeaReview(concept: string) {
    return this.speakToBreeze("Idea Review", { concept });
  }

  async emergencyPing(reason: string) {
    return this.speakToBreeze("Emergency Flag", { reason, priority: "HIGH" });
  }
}
