import { Button } from "@/components/common/Button";

const Header = () => {
  const navigation = [
    { name: "Product", href: "#features" },
    { name: "About", href: "#" },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">allocate</span>
            <img alt="Allocate Logo" src="/logo.svg" className="h-8 w-auto shrink-0" />
          </a>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map(item => (
            <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
              {item.name}
            </a>
          ))}
        </div>
        <div className="flex flex-1 justify-end">
          <a href="/login">
            <Button className="h-[30px] rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Log In
            </Button>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
