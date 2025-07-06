export type SupportedProviders = "Notion" | "Slack";

export type IntegrationDetails = {
  authorization_url: string;
  provider: SupportedProviders;
};
