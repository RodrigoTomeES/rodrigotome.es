export class TelegramService {
  private botToken: string = import.meta.env.TELEGRAM_BOT_TOKEN as string;
  private chatId: string = import.meta.env.TELEGRAM_CHAT_ID as string;

  public isConfigured(): boolean {
    return !!this.botToken && !!this.chatId;
  }

  /**
   * Sends a message to the configured chat. Never throws: a failing
   * notification must not break the caller.
   */
  public async sendMessage(text: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.botToken}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: this.chatId, text }),
        },
      );
      return response.ok;
    } catch {
      return false;
    }
  }
}
