"use client";

import { useTheme } from "@/context/ThemeContext";
import { Menu, MenuItem } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsMoon, BsSun } from "react-icons/bs";

type Props = {};

function Navbar({}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerBg = isScrolled
    ? theme === "dark"
      ? "bg-[#141414]"
      : "bg-white shadow-md"
    : theme === "dark"
      ? "hover:bg-[#141414]"
      : "hover:bg-white/90";

  const textColor = theme === "dark" ? "text-white" : "text-gray-900";

  const navItemClass = `navBarComponents ${
    theme === "dark"
      ? "text-[#e5e5e5] hover:text-[#b3b3b3]"
      : "text-gray-700 hover:text-gray-900"
  }`;

  return (
    <header className={`header ${headerBg}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
        <p className={`font-bold text-3xl ${textColor}`}>
          Movie<span className="text-red-500">App</span>
        </p>
        <ul className="hidden md:space-x-4 md:flex cursor-pointer items-center">
          <li
            className={`${navItemClass} ${
              pathname === "/" &&
              "bg-red-500 !text-white px-2.5 py-2.5 rounded-md"
            }`}
            onClick={() => router.push("/")}
          >
            Home
          </li>
          <li
            className={`${navItemClass} ${
              pathname === "/tv" &&
              "bg-red-500 !text-white px-2.5 py-2.5 rounded-md"
            }`}
            onClick={() => router.push("/tv")}
          >
            TV Shows
          </li>
          <li className={navItemClass} onClick={() => router.push("/")}>
            Movies
          </li>
          <li
            className={`${navItemClass} ${
              pathname === "/people" &&
              "bg-red-500 !text-white px-2.5 py-2.5 rounded-md"
            }`}
            onClick={() => router.push("/people")}
          >
            People
          </li>
          <li
            className={`${navItemClass} ${
              pathname === "/search" &&
              "bg-red-500 !text-white px-2.5 py-2.5 rounded-md"
            }`}
            onClick={() => router.push("/search")}
          >
            Search
          </li>
          {session && (
            <li
              className={`${navItemClass} ${
                pathname === "/playlist" &&
                "bg-red-500 !text-white px-2.5 py-2.5 rounded-md"
              }`}
              onClick={() => router.push("/playlist")}
            >
              Playlist
            </li>
          )}
          {session && (
            <li
              className={`${navItemClass} ${
                pathname === "/profile" &&
                "bg-red-500 !text-white px-2.5 py-2.5 rounded-md"
              }`}
              onClick={() => router.push("/profile")}
            >
              Profile
            </li>
          )}
        </ul>
      </div>

      <div className="font-light flex items-center space-x-4 text-sm mr-8">
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className={`p-2 rounded-full transition-colors ${
            theme === "dark"
              ? "hover:bg-gray-700 text-yellow-400"
              : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          {theme === "dark" ? (
            <BsSun className="text-xl" />
          ) : (
            <BsMoon className="text-xl" />
          )}
        </button>

        {session ? (
          <div>
            <button onClick={handleClick}>
              <img
                src={session.user.image!}
                alt={session.user.name!}
                className="w-8 rounded-full"
              />
            </button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{ "aria-labelledby": "basic-button" }}
            >
              <MenuItem onClick={() => router.push("/profile")}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => router.push("/profile")}>
                My account
              </MenuItem>
              <MenuItem onClick={() => signOut()}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <button
            className="bg-red-500 px-2.5 py-2.5 rounded-md text-sm font-medium text-white"
            onClick={() => signIn("google")}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
