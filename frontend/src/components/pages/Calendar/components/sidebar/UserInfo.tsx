import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";

interface IProps {
  firstName: string;
  lastName: string;
  emailAddress: string;
  onLogout: () => void;
  className?: string;
}

const UserInfo = ({ firstName, lastName, emailAddress, onLogout, className = "" }: IProps) => {
  return (
    <div
      className={`border-t-[1px] border-gray-200 flex flex-row justify-between items-center p-6 ${className}`}
    >
      <div className="flex flex-col">
        <h1 className="font-bold">
          {firstName} {lastName}
        </h1>
        <h2 className="font-light text-sm">{emailAddress}</h2>
      </div>
      <ArrowLeftStartOnRectangleIcon className="w-6 h-6 hover:cursor-pointer" onClick={onLogout} />
    </div>
  );
};

export default UserInfo;
