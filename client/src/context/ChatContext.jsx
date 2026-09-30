import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as chatService from "../services/chat";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================
  // Load Chats
  // ==========================
  const loadChats = async () => {
    try {
      setLoading(true);

      const res = await chatService.getChats();

      const chatList = res.chats || [];

      setChats(chatList);

      const savedChatId =
        localStorage.getItem("chatId");

      if (savedChatId) {
        const existing = chatList.find(
          (chat) => chat._id === savedChatId
        );

        if (existing) {
          setSelectedChat(existing);
          return;
        }
      }

      if (chatList.length > 0) {
        setSelectedChat(chatList[0]);

        localStorage.setItem(
          "chatId",
          chatList[0]._id
        );
      } else {
        setSelectedChat(null);
        localStorage.removeItem("chatId");
      }

    } catch (err) {

      console.error("Load Chats Error:", err);

    } finally {

      setLoading(false);

    }
  };

  // ==========================
  // Create Chat
  // ==========================
  const createNewChat = async () => {
    try {

      const res =
        await chatService.createChat();

      if (!res.success) {
        return null;
      }

      const newChat = res.chat;

      setChats((prev) => [
        newChat,
        ...prev,
      ]);

      setSelectedChat(newChat);

      localStorage.setItem(
        "chatId",
        newChat._id
      );

      // IMPORTANT
      return res;

    } catch (err) {

      console.error(
        "Create Chat Error:",
        err
      );

      return null;
    }
  };

  // ==========================
  // Delete Chat
  // ==========================
  const removeChat = async (id) => {
    try {

      await chatService.deleteChat(id);

      const updatedChats = chats.filter(
        (chat) => chat._id !== id
      );

      setChats(updatedChats);

      if (selectedChat?._id === id) {

        if (updatedChats.length > 0) {

          setSelectedChat(updatedChats[0]);

          localStorage.setItem(
            "chatId",
            updatedChats[0]._id
          );

        } else {

          setSelectedChat(null);

          localStorage.removeItem(
            "chatId"
          );

        }
      }

    } catch (err) {

      console.error(
        "Delete Chat Error:",
        err
      );

    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        selectedChat,
        setSelectedChat,
        createNewChat,
        removeChat,
        loadChats,
        loading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () =>
  useContext(ChatContext);