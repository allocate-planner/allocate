import { memo } from "react";
import { useDroppable } from "@dnd-kit/core";

interface IProps {
  id: string;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const EventEmptyComponent = ({ id, onClick, onContextMenu }: IProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: id });

  return (
    <div
      ref={setNodeRef}
      className={`relative flex flex-col text-sm items-start w-full h-[28px] box-border px-4 py-1 row-span-1 ${
        isOver ? "bg-indigo-100" : ""
      }`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    />
  );
};

EventEmptyComponent.displayName = "EventEmpty";

export default memo(EventEmptyComponent);
