"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuthContext } from "../app/provider";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react"; // Import icons

export default function Navbar() {
  const router = useRouter();
  const { isAuth } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Hamburger menu state
  const modalRef = useRef(null);
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsOpen(false);
    }
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen || isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMenuOpen]);

  return (
    <div className="w-full max-w-[72rem] mx-auto py-4 flex justify-between items-center z-50 p-[1rem]">
      {/* Logo */}
      <Link href="/" className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
        <img src="/images/logo.svg" alt="logo" />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4 ">
        <Link href="/company" className="bg-background px-4 py-2 rounded-md text-[1.1rem] font-medium">
          Companies
        </Link>
        <Link href="/blogs" className="bg-background px-4 py-2 rounded-md text-[1.1rem] font-medium">
          Blogs
        </Link>

        {/* Employer Dropdown */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-background px-4 py-2 rounded-md text-[1.1rem] font-medium"
        >
          For Employer
        </button>
        <div
          ref={modalRef}
          className={`${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          } flex flex-col gap-2 absolute top-20 right-0 bg-zinc-50 p-2 rounded-md text-base shadow-lg transition ease-in-out duration-300 z-50 border-[1px] border-zinc-200/75`}
        >
          <Link href="/business" className="hover:bg-zinc-100 px-4 py-2 rounded-md font-medium">
            What we offer
          </Link>
          <Link href="/postjob" className="hover:bg-zinc-100 px-4 py-2 rounded-md font-medium">
            Post a Job
          </Link>
          <Link href="/dashboard" className="hover:bg-zinc-100 px-4 py-2 rounded-md font-medium">
            Dashboard
          </Link>
          {isAuth && (
            <Link href="/setting/profile" className="hover:bg-zinc-100 px-4 py-2 rounded-md font-medium">
              Setting
            </Link>
          )}
          {isAuth ? (
            <button
              onClick={() => {
                localStorage.removeItem("isLogin");
                cookies.remove("token");
                setIsOpen(false);
                router.push("/");
              }}
              className="hover:bg-red-100 bg-red-50 text-accent-red-1 px-4 py-2 rounded-md font-medium text-start"
            >
              Log Out
            </button>
          ) : (
            <Link href="/login" className="hover:bg-blue-100 bg-blue-50 text-accent-blue-1 px-4 py-2 rounded-md font-medium">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(true)} className="text-black">
          <Menu size={28} />
        </button>

        {/* Sliding Sidebar Menu */}
        <div
          ref={menuRef}
          className={`fixed top-0 left-0 h-full w-[250px] bg-white shadow-lg transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
        >
          {/* Close Button */}
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4">
            <X size={24} />
          </button>

          {/* Sidebar Links */}
          <div className="flex flex-col mt-12 px-6 space-y-4">
            <Link href="/company" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              Companies
            </Link>
            <Link href="/blogs" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              Blogs
            </Link>
            <hr className="border-gray-300" />
            <Link href="/business" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              What we offer
            </Link>
            <Link href="/postjob" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              Post a Job
            </Link>
            <Link href="/dashboard" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            {isAuth && (
              <Link href="/setting/profile" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                Setting
              </Link>
            )}
            {isAuth ? (
              <button
                onClick={() => {
                  localStorage.removeItem("isLogin");
                  cookies.remove("token");
                  setIsMenuOpen(false);
                  router.push("/");
                }}
                className="text-red-600 font-medium text-start"
              >
                Log Out
              </button>
            ) : (
              <Link href="/login" className="text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
