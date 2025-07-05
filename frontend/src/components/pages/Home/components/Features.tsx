import {
  CalendarDaysIcon,
  LinkIcon,
  MicrophoneIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Voice-first scheduling",
    description:
      'Just say "I need to finish the auth ticket today" and watch your calendar organize itself with the right time blocks and links.',
    icon: MicrophoneIcon,
  },
  {
    name: "Powerful integrations",
    description:
      "Seamlessly connects to Notion, Linear, GitHub, Gmail, and more. Mention a ticket or PR and it automatically pulls in all the context you need.",
    icon: LinkIcon,
  },
  {
    name: "Universal calendar",
    description:
      "Import your schedules from Google Calendar, Proton Calendar and others in just one click. Your existing workflow, supercharged.",
    icon: CalendarDaysIcon,
  },
  {
    name: "Intuitive UI",
    description:
      "Beautiful, clean interface that gets out of your way. Drag and drop when you want to, or just speak your plans into existence.",
    icon: SparklesIcon,
  },
];

const Features = () => {
  return (
    <div className="mx-auto mt-32 max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:text-center">
        <h2 className="text-base/7 font-semibold text-indigo-600">Plan smarter</h2>
        <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
          Everything you need to plan your perfect day
        </p>
        <p className="mt-6 text-pretty text-lg/8 text-gray-600">
          Stop playing calendar tetris and start speaking your schedule into existence. Our
          AI-powered planner understands your day, finds optimal time slots, and connects all your
          tools automatically.
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map(feature => (
            <div key={feature.name} className="relative pl-16">
              <dt className="text-base/7 font-semibold text-gray-900">
                <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                  <feature.icon aria-hidden="true" className="size-6 text-white" />
                </div>
                {feature.name}
              </dt>
              <dd className="mt-2 text-base/7 text-gray-600">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default Features;
