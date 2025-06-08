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

const PricingCard = ({
  title,
  subtitle,
  point_1,
  point_2,
  point_3,
  point_4,
  pricing,
}: PricingCardProps) => {
  const points = [point_1, point_2, point_3, point_4];

  return (
    <div className="p-6 md:p-8 border border-1 border-[#DBDBDB] rounded-2xl bg-[#F8F8F8] space-y-6 md:space-y-8 shadow-xl">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold">{title}</h1>
          {pricing && <h1 className="text-sm md:text-base font-light">${pricing}/month</h1>}
        </div>
        <h2 className="text-base md:text-lg font-light">{subtitle}</h2>
      </div>
      <div className="space-y-3 md:space-y-4">
        {points.map((point, index) => (
          <div key={index} className="flex flex-row space-x-2 items-center">
            <CheckCircleIcon className="w-5 h-5 md:w-6 md:h-6" />
            <h3 className="text-xs md:text-sm font-light">{point}</h3>
          </div>
        ))}
      </div>
      <div>
        <a href="/login">
          <Button className="bg-violet-500 hover:bg-violet-700 w-full h-max font-bold text-sm md:text-base py-2 md:py-3">
            Get Started
          </Button>
        </a>
      </div>
    </div>
  );
};

export default PricingCard;
