import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const name =
    user?.name ||
    user?.username ||
    "User";

  const email =
    user?.email ||
    "No email available";

  const role =
    user?.role || "user";

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 overflow-y-auto">

      <div className="max-w-4xl mx-auto">

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Profile
          </h1>

          <p className="text-slate-400 mt-1">
            View your BN Technology AI account information
          </p>
        </div>

        {/* Profile Card */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          {/* Cover */}

          <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500" />

          {/* User */}

          <div className="px-8 pb-8">

            <div className="flex items-end gap-5 -mt-12 mb-8">

              <div className="w-24 h-24 rounded-2xl bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-3xl font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </div>

              <div className="pb-2">
                <h2 className="text-2xl font-bold">
                  {name}
                </h2>

                <p className="text-slate-400">
                  {role === "admin"
                    ? "Administrator"
                    : "User"}
                </p>
              </div>

            </div>

            {/* Information */}

            <div className="grid md:grid-cols-2 gap-4">

              <div className="bg-slate-800/60 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <User
                    size={18}
                    className="text-blue-400"
                  />

                  <span className="text-sm text-slate-400">
                    Full Name
                  </span>
                </div>

                <p className="font-medium">
                  {name}
                </p>
              </div>

              <div className="bg-slate-800/60 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Mail
                    size={18}
                    className="text-blue-400"
                  />

                  <span className="text-sm text-slate-400">
                    Email
                  </span>
                </div>

                <p className="font-medium break-all">
                  {email}
                </p>
              </div>

              <div className="bg-slate-800/60 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck
                    size={18}
                    className="text-green-400"
                  />

                  <span className="text-sm text-slate-400">
                    Account Role
                  </span>
                </div>

                <p className="font-medium capitalize">
                  {role}
                </p>
              </div>

              <div className="bg-slate-800/60 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <CalendarDays
                    size={18}
                    className="text-purple-400"
                  />

                  <span className="text-sm text-slate-400">
                    Account Status
                  </span>
                </div>

                <p className="font-medium text-green-400">
                  Active
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}