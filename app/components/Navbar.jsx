"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/Images/flag-logo.png";
import "./Navbar.css";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

export default function Navbar() {
  const [isClick, setisClick] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const toggleNavBar = () => {
    setisClick(!isClick);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos < prevScrollPos) {
        setVisible(true); // scrolling up
      } else {
        setVisible(false); // scrolling down
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      id="home-navbar"
      className={`navbar-item bg-black fixed w-full z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-9xl px-4 sm:px-6 lg-px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex shrink-0">
              <Link href="#home" className="logo">
                <Image alt="logo" src={logo} />
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center ml-4 space-x-4">
              <Link href="#home" className="link text-white hover:text-black hover:bg-white rounded-lg p-2">
                HOME
              </Link>
              <Link href="#about-us" className="link text-white hover:text-black hover:bg-white rounded-lg p-2">
                ABOUT US
              </Link>
              <Link href="#sermons" className="link text-white hover:text-black hover:bg-white rounded-lg p-2">
                SERMONS
              </Link>
              <Link href="#know-god" className="link text-white hover:text-black hover:bg-white rounded-lg p-2">
                KNOW GOD
              </Link>
              <Link href="#donate-us" className="link text-white hover:text-black hover:bg-white rounded-lg p-2">
                DONATE US
              </Link>
              <Link href="#footer" className="link text-white hover:text-black hover:bg-white rounded-lg p-2">
                CONTACT US
              </Link>
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-white
              hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleNavBar}
            >
              {isClick ? <CloseIcon /> : <MenuOpenIcon />}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-700 ease-in-out transform overflow-hidden ${
            isClick ? "translate-y-0 opacity-100 max-h-[500px]" : "-translate-y-4 opacity-0 max-h-0"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="#home" className="link block text-white hover:text-black hover:bg-white rounded-lg p-2">
              HOME
            </Link>
            <Link href="#about-us" className="link block text-white hover:text-black hover:bg-white rounded-lg p-2">
              ABOUT US
            </Link>
             <Link href="#sermons" className="link text-white hover:text-black hover:bg-white rounded-lg p-2">
                SERMONS
              </Link>
            <Link href="#know-god" className="link block text-white hover:text-black hover:bg-white rounded-lg p-2">
              KNOW GOD
            </Link>
            <Link href="#donate-us" className="link block text-white hover:text-black hover:bg-white rounded-lg p-2">
              DONATE US
            </Link>
            <Link href="#footer" className="link block text-white hover:text-black hover:bg-white rounded-lg p-2">
              CONTACT US
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
