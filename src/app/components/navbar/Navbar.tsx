"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import NavItem from "./NavItem";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className='bg-white shadow-lg rounded-lg mb-3 border-black'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          <Link href='/' className='flex flex-row items-center'>
            <Image
              className='h-8 w-auto'
              src='/logo.png'
              alt='PrideConnect Logo'
              width={400}
              height={400}
            />
            <span className='ml-2 font-bold text-lg text-gray-800'>
              PrideConnect
            </span>
          </Link>

          {/* add responsive nav dropdown */}
          <div className='hidden md:flex md:flex-col md:justify-center'>
            {/* dropdown */}
            <div className='ml-10 flex justify items-baseline space-x-4'>
              <NavItem href='/' label='Home' />
              <NavItem href='/about' label='About' />
              <NavItem href='/contact' label='Contact' />
            </div>
          </div>

          {/* Hamburger button */}
          <div className='-mr-2 flex md:hidden'>
            <button
              type='button'
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
              aria-controls='mobile-menu'
              aria-expanded='false'
              onClick={toggleMenu}
            >
              <span className='sr-only'>Open main menu</span>
              {isOpen ? (
                <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
              ) : (
                <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${isOpen ? "block" : "hidden"} md:hidden bg-white`}
        id='mobile-menu'
      >
        <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center'>
          <NavItem href='/' label='Home' />
          <NavItem href='/about' label='About' />
          <NavItem href='/contact' label='Contact' />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
