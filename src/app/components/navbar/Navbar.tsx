import Link from "next/link";
import Image from "next/image";
import NavItem from "./NavItem";

const Navbar = () => {
  return (
    <nav className="navbar-container flex justify-between border-b border-black">
      <Link href={"/"}>
        <div className="flex items-center ml-20 mb-2">
          <Image
            src="/logo.png"
            alt="PrideConnect Logo"
            className="rounded-full"
            width={50}
            height={24}
            priority
          />
          <span className="ml-2">PrideConnect</span>
        </div>
      </Link>
      <span className="ml-2 items-end mr-48 mt-4">
        Hello welcome to this page
      </span>
    </nav>
  );
};

export default Navbar;
