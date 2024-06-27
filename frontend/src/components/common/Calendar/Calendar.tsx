import CalendarHeader from "./CalendarHeader";

const Calendar = () => {
  return (
    <div className="h-4/5 w-[87.5%] flex flex-col items-start border-[1px] bg-[#F8F8F8] rounded-xl border-gray-300 m-12">
      <CalendarHeader />
      <div className="grid auto-cols-fr auto-rows-fr w-full">
        <div className="grid grid-cols-7 grid-rows-1 w-full">
          <div className="border-r-[1px] border-gray-300 flex flex-col justify-center items-start p-4">
            <h2 className="text-sm">05:00am</h2>
          </div>
          <div className="border-r-[1px] border-gray-300 flex flex-col justify-center items-center p-4">
            <h2 className="text-sm"></h2>
          </div>
          <div className="border-r-[1px] border-gray-300 flex flex-col justify-center items-center p-4">
            <h2 className="text-sm"></h2>
          </div>
          <div className="border-r-[1px] border-gray-300 flex flex-col justify-center items-center p-4">
            <h2 className="text-sm"></h2>
          </div>
          <div className="border-r-[1px] border-gray-300 flex flex-col justify-center items-center p-4">
            <h2 className="text-sm"></h2>
          </div>
          <div className="border-r-[1px] border-gray-300 flex flex-col justify-center items-center p-4">
            <h2 className="text-sm"></h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
