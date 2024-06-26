import { CheckCircleIcon } from "@heroicons/react/24/solid";

import { Button } from "../Button";

interface PricingCardProps {
  title: string;
  subtitle: string;
  point_1: string;
  point_2: string;
  point_3: string;
  point_4: string;
  pricing?: string;
}

const PricingCard = (props: PricingCardProps) => {
  return (
    <div className="p-8 border border-1 border-[#DBDBDB] rounded-2xl bg-[#F8F8F8] space-y-8 shadow-xl">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-4xl font-extrabold">Free</h1>
          {props.pricing && (
            <h1 className="text-base font-light">${props.pricing}/month</h1>
          )}
        </div>
        <h2 className="text-lg font-light">Lorem ipsum dolor sit amet.</h2>
      </div>
      <div className="space-y-4">
        <div className="flex flex-row space-x-2 items-center">
          <CheckCircleIcon className="w-6 h-6" />
          <h3 className="text-sm font-light">Lorem ipsum dolor sit amet.</h3>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <CheckCircleIcon className="w-6 h-6" />
          <h3 className="text-sm font-light">Lorem ipsum dolor sit amet.</h3>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <CheckCircleIcon className="w-6 h-6" />
          <h3 className="text-sm font-light">Lorem ipsum dolor sit amet.</h3>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <CheckCircleIcon className="w-6 h-6" />
          <h3 className="text-sm font-light">Lorem ipsum dolor sit amet.</h3>
        </div>
      </div>
      <div>
        <a href="/login">
          <Button className="bg-violet-500 hover:bg-violet-700 w-full h-max font-bold text-base">
            Get Started
          </Button>
        </a>
      </div>
    </div>
  );
};

export default PricingCard;
