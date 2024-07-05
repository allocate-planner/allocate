import { Button } from "../Button";

const Header = () => {
  const handleClickScroll = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex justify-between h-1/6 w-full p-12">
      <div className="flex flex-row justify-center items-center text-center space-x-16">
        <img src="/logo.svg" alt="Allocate Logo" />
        <a
          onClick={() => handleClickScroll("features")}
          className="text-gray-600 text-sm font-semibold cursor-pointer hover:text-violet-500"
        >
          Features
        </a>
        <a
          onClick={() => handleClickScroll("pricing")}
          className="text-gray-600 text-sm font-semibold cursor-pointer hover:text-violet-500"
        >
          Pricing
        </a>
        <a
          onClick={() => handleClickScroll("faq")}
          className="text-gray-600 text-sm font-semibold cursor-pointer hover:text-violet-500"
        >
          FAQ
        </a>
      </div>
      <div className="flex flex-row justify-center items-center text-center space-x-8">
        <a
          href="/login"
          className="text-gray-600 text-sm font-semibold cursor-pointer hover:text-violet-500"
        >
          Login
        </a>
        <a href="/register">
          <Button className="bg-violet-500 hover:bg-violet-700 h-1/3">
            Sign Up
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Header;
