import { CalendarIcon } from "@heroicons/react/24/outline";

import FeatureCard from "./FeatureCard";

const Features = () => {
  return (
    <div className="h-5/6 w-full flex flex-col justify-center items-center space-y-8">
      <div className="flex flex-col -space-y-8">
        <h1 className="text-6xl font-extrabold">Only the features you want</h1>
        <div className="flex flex-row space-x-2 items-center justify-center">
          <p className="text-lg font-light">
            Everything you need to manage your schedule efficiently and
            effortlessly.
          </p>
          <img src="/scribble.svg" alt="Scribble" className="mt-8" />
        </div>
      </div>
      <div className="bg-wiggle h-1/2 w-1/2 grid grid-rows-3 grid-cols-2 p-12 rounded-3xl gap-x-24 gap-y-8">
        <FeatureCard
          Icon={CalendarIcon}
          title="Lorem Ipsum"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit."
        />
        <FeatureCard
          Icon={CalendarIcon}
          title="Lorem Ipsum"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit."
        />
        <FeatureCard
          Icon={CalendarIcon}
          title="Lorem Ipsum"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit."
        />
        <FeatureCard
          Icon={CalendarIcon}
          title="Lorem Ipsum"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit."
        />
        <FeatureCard
          Icon={CalendarIcon}
          title="Lorem Ipsum"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit."
        />
        <FeatureCard
          Icon={CalendarIcon}
          title="Lorem Ipsum"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit."
        />
      </div>
    </div>
  );
};

export default Features;
