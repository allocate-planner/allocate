import { useAuth } from "@/AuthProvider";
import type { SupportedProviders } from "@/models/IProvider";
import { integrationService } from "@/services/IntegrationService";

import { LinkIcon } from "@heroicons/react/24/outline";

type IntegrationItem = {
  name: string;
  description: string;
  iconPath: string;
};

const integrations: IntegrationItem[] = [
  {
    name: "Notion",
    description: "Access your pages, databases, and workspace content.",
    iconPath: "/brands/notion.svg",
  },
  {
    name: "Gmail",
    description: "Access your emails, drafts, and scheduled messages.",
    iconPath: "/brands/gmail.svg",
  },
  {
    name: "Linear",
    description: "Access your issues, tickets, and project roadmaps.",
    iconPath: "/brands/linear.svg",
  },
  {
    name: "GitHub",
    description: "Access your repositories, issues, and pull requests.",
    iconPath: "/brands/github.svg",
  },
  {
    name: "Figma",
    description: "Access your design files, projects, and prototypes.",
    iconPath: "/brands/figma.svg",
  },
  {
    name: "Slack",
    description: "Access your channels, messages, and team conversations.",
    iconPath: "/brands/slack.svg",
  },
];

const IntegrationsTab = () => {
  const { accessToken } = useAuth();

  const handleConnect = async (provider: string) => {
    if (accessToken) {
      try {
        const oauth_provider = provider.toLowerCase() as SupportedProviders;
        const response = await integrationService.connectIntegration(oauth_provider, accessToken);
        sessionStorage.setItem("oauth-provider", oauth_provider);
        window.location.href = response.authorization_url;
      } catch (error) {
        /* empty */
      }
    }
  };

  return (
    <section className="w-full flex flex-col p-8 space-y-12">
      <div className="space-y-8">
        <div className="flex flex-row space-x-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-600">
            <LinkIcon aria-hidden="true" className="size-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-base">Integrations</h1>
            <p className="text-gray-500 text-sm">
              Connect your favorite tools and services and supercharge your workflow
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {integrations.map((integration: IntegrationItem, index: number) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative"
          >
            <button
              onClick={() => handleConnect(integration.name)}
              className="absolute top-4 right-4 py-1.5 px-3 rounded-lg text-sm font-medium bg-white text-gray-700 border"
            >
              Connect
            </button>
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-3">
              <img
                src={integration.iconPath}
                alt={`${integration.name} icon`}
                className="w-8 h-8"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 pr-20">{integration.name}</h3>
            <p className="text-sm text-gray-600 pr-4">{integration.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IntegrationsTab;
