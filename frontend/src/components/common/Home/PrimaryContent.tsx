import { Button } from "../Button";

const PrimaryContent = () => {
  return (
    <div className="h-5/6 w-full flex flex-row space-x-24 pr-12 justify-center items-center">
      <div className="bg-topography justify-center items-center w-2/5 h-5/6 space-y-4">
        <h1 className="text-7xl font-light p-12">
          Increase your productivity ten-fold with the help of a voice
          controlled AI-powered day planner.
        </h1>
        <img
          src="/stroke.svg"
          alt="Arrow"
          className="absolute bottom-44 left-80 scale-80"
        />
        <div className="pl-14 pt-14 pb-8">
          <Button className="bg-violet-500 hover:bg-violet-700 h-1/3 rounded-2xl font-light w-2/3">
            <span className="font-semibold">Introductory Offer&nbsp;</span> —
            first&nbsp;<span className="underline">3 months</span>&nbsp;for
            only&nbsp; <span className="underline">$3</span>&nbsp;a month!
          </Button>
        </div>
      </div>
      <div className="w-3/5">
        <img
          src="/calendar.png"
          alt="An image showcasing the Dashboard of Allocate"
        />
      </div>
    </div>
  );
};

export default PrimaryContent;
