import Link from "next/link";

type NavItemProps = {
  href: string;
  label: string;
  active?: boolean;
};

function NavItem({ href, label, active }: NavItemProps) {
  const activeClassName = active ? "bg-gray-900 text-white" : "";
  return (
    <Link
      href={href}
      className={`text-gray-800 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${activeClassName}`}
    >
      {label}
    </Link>
  );
}

NavItem.defaultProps = {
  active: false,
};

export default NavItem;
