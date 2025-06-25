import { useDroppable } from "@dnd-kit/core";

interface IProps {
  id: string;
  onClick?: () => void;
}

const EmptyTimeSlot = (props: IProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: props.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col text-sm items-start w-full h-[28px] box-border px-4 py-1 row-span-1 ${
        isOver ? "bg-violet-100" : ""
      }`}
      onClick={props.onClick}
    />
  );
};

export default EmptyTimeSlot;
