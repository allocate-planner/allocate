import { useDroppable } from "@dnd-kit/core";

interface IProps {
  id: string;
  onClick?: () => void;
}

const EventEmpty = ({ id, onClick }: IProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col text-sm items-start w-full h-[28px] box-border px-4 py-1 row-span-1 ${
        isOver ? "bg-violet-100" : ""
      }`}
      onClick={onClick}
    />
  );
};

export default EventEmpty;
