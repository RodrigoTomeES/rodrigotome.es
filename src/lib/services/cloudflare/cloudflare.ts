export class CloudflareError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CloudflareError';
  }
}

export class CloudflareService {
  private apiToken: string = import.meta.env.CLOUDFLARE_API_TOKEN as string;
  private accountId: string = import.meta.env.CLOUDFLARE_ACCOUNT_ID as string;
  private projectName: string = import.meta.env
    .CLOUDFLARE_PAGES_PROJECT as string;
  private deployHookUrl: string = import.meta.env
    .CLOUDFLARE_DEPLOY_HOOK_URL as string;

  public isConfigured(): boolean {
    return (
      !!this.apiToken &&
      !!this.accountId &&
      !!this.projectName &&
      !!this.deployHookUrl
    );
  }

  /**
   * Sets a production environment variable (as a secret) of the Pages project.
   * It only takes effect after the next deployment.
   */
  public async updatePagesSecret(name: string, value: string): Promise<void> {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/pages/projects/${this.projectName}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deployment_configs: {
            production: {
              env_vars: { [name]: { type: 'secret_text', value } },
            },
          },
        }),
      },
    );

    if (!response.ok) {
      throw new CloudflareError(
        `Could not update ${name} in Cloudflare Pages (${response.status})`,
      );
    }
  }

  public async triggerDeploy(): Promise<void> {
    const response = await fetch(this.deployHookUrl, { method: 'POST' });

    if (!response.ok) {
      throw new CloudflareError(
        `Could not trigger the deploy hook (${response.status})`,
      );
    }
  }
}
