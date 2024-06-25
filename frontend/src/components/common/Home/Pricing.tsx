import PricingCard from "./PricingCard";

const Pricing = () => {
  return (
    <div className="h-5/6 w-full flex flex-col justify-center items-center space-y-8">
      <div className="flex flex-col -space-y-4">
        <div className="flex flex-row space-x-12 items-center justify-center">
          <h1 className="text-6xl font-extrabold">Pricing Plans</h1>
          <img src="/dollar.svg" alt="Dollar Sign" />
        </div>
        <p className="text-lg font-light max-w-md">
          No surprises, no hidden fees. Just simple, transparent pricing.
        </p>
      </div>
      <div className="h-2/3 w-3/4 grid grid-rows-1 grid-cols-3 p-12 rounded-3xl gap-x-24">
        <PricingCard
          title="Lorem Ipsum"
          subtitle="Lorem ipsum dolor sit amet."
          point_1="Lorem ipsum dolor sit amet."
          point_2="Lorem ipsum dolor sit amet."
          point_3="Lorem ipsum dolor sit amet."
          point_4="Lorem ipsum dolor sit amet."
        />
        <PricingCard
          title="Lorem Ipsum"
          subtitle="Lorem ipsum dolor sit amet."
          point_1="Lorem ipsum dolor sit amet."
          point_2="Lorem ipsum dolor sit amet."
          point_3="Lorem ipsum dolor sit amet."
          point_4="Lorem ipsum dolor sit amet."
          pricing="5"
        />
        <PricingCard
          title="Lorem Ipsum"
          subtitle="Lorem ipsum dolor sit amet."
          point_1="Lorem ipsum dolor sit amet."
          point_2="Lorem ipsum dolor sit amet."
          point_3="Lorem ipsum dolor sit amet."
          point_4="Lorem ipsum dolor sit amet."
          pricing="10"
        />
      </div>
    </div>
  );
};

export default Pricing;
