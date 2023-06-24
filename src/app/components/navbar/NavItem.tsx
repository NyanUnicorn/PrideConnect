import Link from "next/link";

type NavItemProps = {
  text: string;
  href: string;
  active?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ text, href, active }) => {
  return (
    <Link href={href}>
      <a className={`nav__item ${active ? "active" : ""}`}> {text}</a>
    </Link>
  );
};

export default NavItem;
