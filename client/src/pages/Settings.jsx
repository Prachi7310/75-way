import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  MessageSquare,
  Shield,
} from "lucide-react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Settings() {
  const [notifications, setNotifications] =
    useState(true);

  const [sound, setSound] =
    useState(true);

  const [autoScroll, setAutoScroll] =
    useState(true);

  // =====================================
  // Load Saved Settings
  // =====================================

  useEffect(() => {
    const savedSettings =
      localStorage.getItem("settings");

    if (!savedSettings) return;

    try {
      const settings =
        JSON.parse(savedSettings);

      setNotifications(
        settings.notifications ?? true
      );

      setSound(
        settings.sound ?? true
      );

      setAutoScroll(
        settings.autoScroll ?? true
      );

    } catch (error) {
      console.error(
        "Settings Load Error:",
        error
      );
    }
  }, []);

  // =====================================
  // Save Settings
  // =====================================

  const handleSave = () => {
    const settings = {
      notifications,
      sound,
      autoScroll,
    };

    localStorage.setItem(
      "settings",
      JSON.stringify(settings)
    );

    toast.success(
      "Settings saved successfully"
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 overflow-y-auto">

      <div className="max-w-4xl mx-auto">

        {/* Header */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="p-3 rounded-xl bg-blue-600">
              <SettingsIcon size={22} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Settings
              </h1>

              <p className="text-slate-400 mt-1">
                Customize your BN Technology AI experience
              </p>
            </div>

          </div>

        </div>

        {/* General */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5">

          <h2 className="text-lg font-semibold mb-1">
            General
          </h2>

          <p className="text-sm text-slate-500 mb-6">
            Manage your chat preferences
          </p>

          {/* Auto Scroll */}

          <div className="flex items-center justify-between py-4 border-b border-slate-800">

            <div className="flex items-center gap-4">

              <MessageSquare
                size={20}
                className="text-blue-400"
              />

              <div>
                <p className="font-medium">
                  Auto Scroll
                </p>

                <p className="text-sm text-slate-500">
                  Automatically scroll to new messages
                </p>
              </div>

            </div>

            <Toggle
              enabled={autoScroll}
              onClick={() =>
                setAutoScroll(
                  (prev) => !prev
                )
              }
            />

          </div>

          {/* Sound */}

          <div className="flex items-center justify-between py-4">

            <div className="flex items-center gap-4">

              <Bell
                size={20}
                className="text-purple-400"
              />

              <div>
                <p className="font-medium">
                  Response Sound
                </p>

                <p className="text-sm text-slate-500">
                  Play a sound when AI finishes responding
                </p>
              </div>

            </div>

            <Toggle
              enabled={sound}
              onClick={() =>
                setSound(
                  (prev) => !prev
                )
              }
            />

          </div>

        </section>

        {/* Notifications */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5">

          <h2 className="text-lg font-semibold mb-1">
            Notifications
          </h2>

          <p className="text-sm text-slate-500 mb-6">
            Control application notifications
          </p>

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <Bell
                size={20}
                className="text-yellow-400"
              />

              <div>
                <p className="font-medium">
                  Notifications
                </p>

                <p className="text-sm text-slate-500">
                  Show application notifications
                </p>
              </div>

            </div>

            <Toggle
              enabled={notifications}
              onClick={() =>
                setNotifications(
                  (prev) => !prev
                )
              }
            />

          </div>

        </section>

        {/* Appearance */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5">

          <h2 className="text-lg font-semibold mb-1">
            Appearance
          </h2>

          <p className="text-sm text-slate-500 mb-6">
            Choose how the application looks
          </p>

          <div className="flex items-center gap-4 bg-slate-800/60 rounded-xl p-4">

            <Moon
              size={20}
              className="text-blue-400"
            />

            <div>
              <p className="font-medium">
                Dark Mode
              </p>

              <p className="text-sm text-slate-500">
                Dark theme is currently enabled
              </p>
            </div>

            <div className="ml-auto px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-sm">
              Active
            </div>

          </div>

        </section>

        {/* Security */}

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">

          <h2 className="text-lg font-semibold mb-1">
            Security
          </h2>

          <p className="text-sm text-slate-500 mb-6">
            Your account security information
          </p>

          <div className="flex items-center gap-4 bg-slate-800/60 rounded-xl p-4">

            <Shield
              size={20}
              className="text-green-400"
            />

            <div>
              <p className="font-medium">
                Authentication
              </p>

              <p className="text-sm text-slate-500">
                Your account is protected using JWT authentication
              </p>
            </div>

            <div className="ml-auto text-green-400 text-sm">
              Protected
            </div>

          </div>

        </section>

        {/* Save */}

        <div className="flex justify-end">

          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-medium"
          >
            Save Settings
          </button>

        </div>

      </div>
    </div>
  );
}

// =====================================
// Toggle Component
// =====================================

function Toggle({
  enabled,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={enabled}
      className={`w-12 h-6 rounded-full transition relative ${
        enabled
          ? "bg-blue-600"
          : "bg-slate-700"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition ${
          enabled
            ? "left-7"
            : "left-1"
        }`}
      />
    </button>
  );
}