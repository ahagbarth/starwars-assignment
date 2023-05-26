"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavBar() {
  const pathname = usePathname();
  const items = [
    {
      href: "/",
      title: "People",
    },
    {
        href: "/films",
        title: "Films",
    },
    {
        href: "/starships",
        title: "Starships",
    },
    // {
    //     href: "/vehicles",
    //     title: "Vehicles",
    // },
    // {
    //     href: "/species",
    //     title: "Species",
    // },
    // {
    //     href: "/planets",
    //     title: "Planets",
    // },
  ];

  return (
    <nav data-testid="navbar" className="navbar flex flex-col justify-center">
      <div className="py-4 flex justify-center">
        <img
          id="local-nav-logo-desktop"
          data-testid="navbar-logo"
          className="w-48 h-20"
          src="https://lumiere-a.akamaihd.net/v1/images/sw_logo_stacked_2x-52b4f6d33087_7ef430af.png?region=0,0,586,254"
          alt="Star Wars Logo"
        ></img>
      </div>
      <div className="">
        <ul className="flex flex-row justify-center p-1 space-x-8">
          {items.map((link) => {
            const isActive = pathname === link.href;
            return <Link 
                        href={link.href}
                        key={link.title}
                        className="nav-item"
                    >{link.title}
                    <div className={isActive ? 'nav-item-active' : 'nav-item-bar'}></div>
                  </Link>;
          })}
        </ul>
      </div>
    </nav>
  );
}
