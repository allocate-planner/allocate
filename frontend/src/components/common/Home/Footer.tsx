const footerNavigation = {
  company: [
    { name: "About", href: "#" },
    { name: "Contact Us", href: "#" },
  ],
  legal: [
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="relative mx-auto mt-32 max-w-7xl px-6 lg:px-8">
      <div className="border-t border-gray-900/10 py-16 sm:py-24 lg:py-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <img alt="allocate" src="logo.svg" className="h-9" />
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 justify-self-end">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm/6 font-semibold text-gray-900">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.company.map(item => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm/6 text-gray-600 hover:text-gray-900">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm/6 font-semibold text-gray-900">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.legal.map(item => (
                    <li key={item.name}>
                      <a href={item.href} className="text-sm/6 text-gray-600 hover:text-gray-900">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
