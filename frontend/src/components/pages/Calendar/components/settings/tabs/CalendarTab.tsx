import { CogIcon } from "@heroicons/react/24/outline";

const CalendarTab = () => {
  return (
    <section className="w-full flex flex-col p-8 space-y-12">
      <div className="space-y-8">
        <div className="flex flex-row space-x-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-600">
            <CogIcon aria-hidden="true" className="size-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-base">Calendar Preferences</h1>
            <p className="text-gray-500 text-sm">Customise how your calendar looks and behaves</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalendarTab;
