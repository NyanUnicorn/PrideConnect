import Link from "next/link";

type NavItemProps = {
  text: string;
  href: string;
  active?: boolean;
};

function NavItem({ text, href, active }: NavItemProps) {
  return (
    <Link href={href}>
      <a className={`nav__item ${active ? "active" : ""}`} href='/'>
        {" "}
        {text}
      </a>
    </Link>
  );
}

NavItem.defaultProps = {
  active: false,
};

export default NavItem;
