import {
  Bell,
  Moon,
  Search,
  Sun,
  X,
  ShieldCheck,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme =
      localStorage.getItem("theme");

    return savedTheme !== "light";
  });

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showSearch, setShowSearch] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const notificationRef = useRef(null);

  // =====================================
  // User Information
  // =====================================

  const displayName =
    user?.name ||
    user?.username ||
    "User";

  const email =
    user?.email ||
    "No email";

  const role =
    user?.role ||
    "user";

  const avatarLetter =
    displayName
      .charAt(0)
      .toUpperCase();

  // =====================================
  // Restore Theme
  // =====================================

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "light") {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  }, []);

  // =====================================
  // Theme Toggle
  // =====================================

  const handleThemeToggle = () => {
    setDarkMode((prev) => {
      const nextMode = !prev;

      localStorage.setItem(
        "theme",
        nextMode
          ? "dark"
          : "light"
      );

      return nextMode;
    });
  };

  // =====================================
  // Close Notifications Outside
  // =====================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =====================================
  // Search
  // =====================================

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchClose = () => {
    setSearch("");
    setShowSearch(false);
  };

  return (
    <header className="h-20 bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-8 relative z-20">

      {/* =====================================
          Title
      ===================================== */}

      <div className="min-w-0">

        <h1 className="text-2xl font-bold text-white truncate">
          BN Technology AI Assistant
        </h1>

        <p className="text-slate-400 text-sm">
          Smart Company Knowledge Assistant
        </p>

      </div>

      {/* =====================================
          Actions
      ===================================== */}

      <div className="flex items-center gap-3">

        {/* Search */}

        {showSearch ? (
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3">

            <Search
              size={17}
              className="text-slate-400 shrink-0"
            />

            <input
              autoFocus
              value={search}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-40 bg-transparent outline-none text-white text-sm px-2 py-2"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-slate-400 hover:text-white mr-1"
                title="Clear"
              >
                <X size={15} />
              </button>
            )}

            <button
              onClick={handleSearchClose}
              className="text-slate-400 hover:text-white"
              title="Close"
            >
              <X size={16} />
            </button>

          </div>
        ) : (
          <button
            onClick={() =>
              setShowSearch(true)
            }
            className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
            title="Search"
          >
            <Search
              size={18}
              className="text-white"
            />
          </button>
        )}

        {/* Notifications */}

        <div
          ref={notificationRef}
          className="relative"
        >

          <button
            onClick={() =>
              setShowNotifications(
                (prev) => !prev
              )
            }
            className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
            title="Notifications"
          >
            <Bell
              size={18}
              className="text-white"
            />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-14 w-80 bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl p-4">

              <div className="flex items-center justify-between">

                <h3 className="text-white font-semibold">
                  Notifications
                </h3>

                <button
                  onClick={() =>
                    setShowNotifications(false)
                  }
                  className="text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>

              </div>

              <div className="mt-4 rounded-xl bg-slate-900 border border-slate-800 p-4">

                <div className="flex items-center gap-3">

                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Bell
                      size={17}
                      className="text-blue-400"
                    />
                  </div>

                  <div>
                    <p className="text-white text-sm font-medium">
                      You're all caught up
                    </p>

                    <p className="text-slate-500 text-xs mt-1">
                      No new notifications.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* Theme */}

        <button
          onClick={handleThemeToggle}
          className="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
          title={
            darkMode
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >

          {darkMode ? (
            <Moon
              size={18}
              className="text-white"
            />
          ) : (
            <Sun
              size={18}
              className="text-yellow-300"
            />
          )}

        </button>

        {/* User */}

        <div className="flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-2">

          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
            {avatarLetter}
          </div>

          <div className="max-w-[150px]">

            <h3 className="text-white font-medium truncate">
              {displayName}
            </h3>

            <div className="flex items-center gap-1">

              {role === "admin" && (
                <ShieldCheck
                  size={12}
                  className="text-green-400"
                />
              )}

              <p className="text-slate-400 text-xs truncate">
                {role === "admin"
                  ? "Administrator"
                  : email}
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}