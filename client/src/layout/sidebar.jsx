import { useState } from "react";
import {
  Menu,
  X,
  Plus,
  Search,
  MessageSquare,
  Trash2,
  Settings,
  User,
  LogOut,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const {
    chats,
    selectedChat,
    setSelectedChat,
    createNewChat,
    removeChat,
    loading,
  } = useChat();

  const filteredChats = chats.filter((chat) =>
    chat.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =====================================
  // Logout
  // =====================================

  const handleLogout = () => {
    logout();

    localStorage.removeItem("chatId");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  // =====================================
  // Delete Chat
  // =====================================

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Delete this chat?"
    );

    if (!ok) return;

    try {
      await removeChat(id);

      toast.success("Chat deleted");
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to delete chat"
      );
    }
  };

  // =====================================
  // Navigate
  // =====================================

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <motion.div
      animate={{
        width: collapsed ? 85 : 320,
      }}
      transition={{
        duration: 0.3,
      }}
      className="bg-[#08111F] border-r border-slate-800 h-screen flex flex-col"
    >
      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <div className="h-20 px-5 flex items-center justify-between">

        {!collapsed && (
          <div className="flex items-center gap-2">

            <div className="bg-blue-600 p-2 rounded-xl">
              <Sparkles
                className="text-white"
                size={20}
              />
            </div>

            <div>
              <h1 className="font-bold text-white text-lg">
                BN AI
              </h1>

              <p className="text-xs text-slate-400">
                Technology Assistant
              </p>
            </div>

          </div>
        )}

        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
          className="hover:bg-slate-800 p-2 rounded-lg"
        >
          {collapsed ? (
            <Menu className="text-white" />
          ) : (
            <X className="text-white" />
          )}
        </button>

      </div>

      {/* ================================= */}
      {/* New Chat */}
      {/* ================================= */}

      <div className="px-4">

        <button
          onClick={createNewChat}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-white flex items-center justify-center gap-2 hover:scale-[1.02] transition"
        >
          <Plus size={18} />

          {!collapsed && "New Chat"}
        </button>

      </div>

      {/* ================================= */}
      {/* Search Chats */}
      {/* ================================= */}

      {!collapsed && (
        <div className="px-4 mt-5">

          <div className="bg-slate-900 rounded-xl flex items-center px-3 border border-slate-700">

            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search chats..."
              className="bg-transparent flex-1 p-3 outline-none text-white"
            />

          </div>

        </div>
      )}

      {/* ================================= */}
      {/* History */}
      {/* ================================= */}

      <div className="flex-1 overflow-y-auto mt-6 px-3">

        {!collapsed && (
          <p className="text-slate-500 text-xs uppercase mb-3 px-2 tracking-wider">
            Recent Chats
          </p>
        )}

        {loading ? (
          <p className="text-center text-slate-400 mt-5">
            Loading...
          </p>
        ) : filteredChats.length === 0 ? (
          <p className="text-center text-slate-500 mt-5">
            No chats found
          </p>
        ) : (
          filteredChats.map((chat) => (
            <motion.div
              key={chat._id}
              whileHover={{
                x: 5,
              }}
              className="group"
            >

              <button
                onClick={() =>
                  setSelectedChat(chat)
                }
                className={`w-full flex items-center justify-between rounded-xl p-3 mb-2 transition ${
                  selectedChat?._id ===
                  chat._id
                    ? "bg-blue-600"
                    : "hover:bg-slate-800"
                }`}
              >

                <div className="flex items-center gap-3 min-w-0">

                  <MessageSquare
                    size={18}
                    className="text-white shrink-0"
                  />

                  {!collapsed && (
                    <span className="truncate text-white">
                      {chat.title}
                    </span>
                  )}

                </div>

                {!collapsed && (
                  <Trash2
                    size={16}
                    className="text-red-400 opacity-0 group-hover:opacity-100 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();

                      handleDelete(
                        chat._id
                      );
                    }}
                  />
                )}

              </button>

            </motion.div>
          ))
        )}

      </div>

      {/* ================================= */}
      {/* Bottom Navigation */}
      {/* ================================= */}

      <div className="border-t border-slate-800 p-4 space-y-2">

        {/* Knowledge - ADMIN ONLY */}

        {user?.role === "admin" && (
          <button
            onClick={() =>
              handleNavigation(
                "/knowledge"
              )
            }
            className="w-full rounded-xl hover:bg-blue-500/10 transition p-3 flex items-center gap-3 text-blue-400"
          >
            <BookOpen size={18} />

            {!collapsed && (
              <span>Knowledge</span>
            )}
          </button>
        )}

        {/* Profile */}

        <button
          onClick={() =>
            handleNavigation(
              "/profile"
            )
          }
          className="w-full rounded-xl hover:bg-slate-800 transition p-3 flex items-center gap-3 text-slate-300"
        >
          <User size={18} />

          {!collapsed && (
            <span>Profile</span>
          )}
        </button>

        {/* Settings */}

        <button
          onClick={() =>
            handleNavigation(
              "/settings"
            )
          }
          className="w-full rounded-xl hover:bg-slate-800 transition p-3 flex items-center gap-3 text-slate-300"
        >
          <Settings size={18} />

          {!collapsed && (
            <span>Settings</span>
          )}
        </button>

        {/* Logout */}

        <button
          onClick={handleLogout}
          className="w-full rounded-xl hover:bg-red-500/10 transition p-3 flex items-center gap-3 text-red-400"
        >
          <LogOut size={18} />

          {!collapsed && (
            <span>Logout</span>
          )}
        </button>

      </div>

    </motion.div>
  );
}