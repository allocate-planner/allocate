import type { Nullable } from "./IUtility";

export type SupportedProviders = "Notion" | "Slack";

export type IntegrationDetails = {
  authorization_url: string;
  provider: SupportedProviders;
};

export type IntegrationResponse = {
  bot_id: Nullable<string>;
  provider: SupportedProviders;
  accesss_token: string;
  refresh_token: Nullable<string>;
  expires_at: Nullable<Date>;
  scope: Nullable<string>;
  workspace_name: Nullable<string>;
  workspace_id: Nullable<string>;
  user_id: number;
};
