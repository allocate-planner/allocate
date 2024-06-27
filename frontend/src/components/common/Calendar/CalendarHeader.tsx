import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const CalendarHeader = () => {
  return (
    <div className="grid grid-cols-7 grid-rows-1 w-full">
      <div className="border-r-[1px] border-b-[1px] border-gray-300 flex flex-row justify-center items-center space-x-8 p-4">
        <ArrowLeftIcon className="w-6 h-6" />
        <h2>July 2024</h2>
        <ArrowRightIcon className="w-6 h-6" />
      </div>
      <div className="border-r-[1px]  border-b-[1px] border-b-violet-400 border-gray-300 flex flex-col justify-center items-center p-4">
        <div className="flex flex-col">
          <h1 className="font-bold text-lg">Thursday</h1>
          <h2 className="text-sm">11th of July</h2>
        </div>
      </div>
      <div className="border-r-[1px] border-b-[1px] border-gray-300 flex flex-col justify-center items-center p-4">
        <div className="flex flex-col">
          <h1 className="font-bold text-lg">Thursday</h1>
          <h2 className="text-sm">11th of July</h2>
        </div>
      </div>
      <div className="border-r-[1px] border-b-[1px] border-gray-300 flex flex-col justify-center items-center p-4">
        <div className="flex flex-col">
          <h1 className="font-bold text-lg">Thursday</h1>
          <h2 className="text-sm">11th of July</h2>
        </div>
      </div>
      <div className="border-r-[1px] border-b-[1px] border-gray-300 flex flex-col justify-center items-center p-4">
        <div className="flex flex-col">
          <h1 className="font-bold text-lg">Thursday</h1>
          <h2 className="text-sm">11th of July</h2>
        </div>
      </div>
      <div className="border-r-[1px] border-b-[1px] border-gray-300 flex flex-col justify-center items-center p-4">
        <div className="flex flex-col">
          <h1 className="font-bold text-lg">Thursday</h1>
          <h2 className="text-sm">11th of July</h2>
        </div>
      </div>
      <div className="border-gray-300 border-b-[1px] flex flex-col justify-center items-center p-4">
        <div className="flex flex-col">
          <h1 className="font-bold text-lg">Thursday</h1>
          <h2 className="text-sm">11th of July</h2>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
