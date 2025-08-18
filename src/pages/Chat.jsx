import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, Shield, Lock } from "lucide-react";
import getChats from "../getChats.cjs";
import sendMsg from "../sendMsg.cjs";

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();

  // Get user from sessionStorage for persistence across refresh
  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch chats from server
  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      try {
        await getChats(user, setChats);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }
    };

    fetchChats();
  }, [user]);

  // Set active chat and messages based on chatId
  useEffect(() => {
    if (!chatId || chats.length === 0) return;

    const currentChat = chats.filter(
      (c) => String(c.localid) === String(chatId)
    );

    if (currentChat.length > 0) {
      setActiveChat({ title: currentChat[0].title, localid: chatId });
      setMessages(
        currentChat.map((msg) => ({
          id: msg.id,
          content: msg.message,
          sender: msg.usertype,
          reply: msg.reply || null,
          timestamp: msg.message_time,
        }))
      );
    }
  }, [chatId, chats]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message handler
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const tempId = Date.now().toString();
    const newMsg = {
      id: tempId,
      content: newMessage,
      sender: "user",
      reply: null,
      timestamp: new Date().toISOString(),
    };

    // Optimistic UI
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");

    try {
      const serverResponse = await sendMsg(user, newMessage.trim(), chatId);
      if (serverResponse) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? {
                  ...msg,
                  id: serverResponse.id || tempId,
                  reply: serverResponse.reply || null,
                  timestamp: serverResponse.timestamp || msg.timestamp,
                }
              : msg
          )
        );
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  // If user is missing
  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400">User not found. Please login again.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="bg-dark-800/50 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/chats")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-white font-semibold">
             {activeChat?.title 
  ? activeChat.title 
  : activeChat?.localid 
    ? `Chat ${activeChat.localid}` 
    : "New Chat"}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3 text-green-400" />
                <span>End-to-end encrypted</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
            <Lock className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400">Secure</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2">
            <div
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white"
                    : "bg-dark-800/70 backdrop-blur-sm text-gray-100 border border-gray-700/50"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p
                  className={`text-xs mt-2 ${
                    msg.sender === "user" ? "text-primary-100" : "text-gray-400"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {msg.reply && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-dark-800/70 backdrop-blur-sm text-gray-100 border border-gray-700/50">
                  <p className="text-sm leading-relaxed">{msg.reply}</p>
                  <p className="text-xs mt-2 text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-700/50 p-6">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your secure message..."
              className="w-full px-4 py-3 bg-dark-800/50 backdrop-blur-sm border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Shield className="w-3 h-3 text-green-400" />
            </div>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3 rounded-full hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <div className="flex items-center justify-center mt-3 text-xs text-gray-500 space-x-2">
          <Lock className="w-3 h-3" />
          <span>Messages are encrypted and secure</span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
