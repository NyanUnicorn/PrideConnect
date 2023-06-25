import Link from 'next/link';
import Image from 'next/image';
import NavItemsContainer from './NavItemsContainer';

export default function Navbar() {
  return (
    <nav className="navbar-container flex justify-between border-b border-black">
      <Link href="/">
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
      <NavItemsContainer />
    </nav>
  );
}
