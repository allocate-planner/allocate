import { Button } from "../Button";

const Header = () => {
  return (
    <div className="flex justify-between h-1/6 w-full p-12">
      <div className="flex flex-row justify-center items-center text-center space-x-16">
        <img src="/logo.svg" alt="Allocate Logo" />
        <h2 className="text-gray-600 text-sm font-semibold cursor-pointer hover:text-violet-500">
          Features
        </h2>
        <h2 className="text-gray-600 text-sm font-semibold cursor-pointer hover:text-violet-500">
          Pricing
        </h2>
        <h2 className="text-gray-600 text-sm font-semibold cursor-pointer hover:text-violet-500">
          FAQ
        </h2>
      </div>
      <div className="flex flex-row justify-center items-center text-center space-x-8">
        <h2 className="text-gray-600 text-sm font-semibold cursor-pointer hover:text-violet-500">
          Login
        </h2>
        <a href="/login">
          <Button className="bg-violet-500 hover:bg-violet-700 h-1/3">
            Sign Up
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Header;
