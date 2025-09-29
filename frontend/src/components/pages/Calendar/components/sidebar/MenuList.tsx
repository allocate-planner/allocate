import type { MenuItem } from "@/components/pages/Calendar/components/sidebar/Sidebar";

interface IProps {
  menuItems: MenuItem[];
  className?: string;
}

const MenuList = ({ menuItems, className = "" }: IProps) => {
  return (
    <div className={`mt-4 flex flex-col items-center gap-2 h-full ${className}`}>
      {menuItems.map((item: MenuItem, index: number) => (
        <div
          key={index}
          onClick={item.onClick}
          className={`
            flex flex-row items-center space-x-2 w-4/5 py-1 ${item.classNames ? item.classNames : ""}
            ${item.hasBackground ? "border border-[#DBDBDB] rounded-xl bg-[#F8F8F8]" : ""}
            ${item.onClick ? "hover:cursor-pointer" : ""}
          `}
        >
          {item.icon ? <item.icon className="ml-2 w-6 h-6" /> : null}
          {item.customContent ? item.customContent : <h2>{item.title}</h2>}
        </div>
      ))}
    </div>
  );
};

export default MenuList;
