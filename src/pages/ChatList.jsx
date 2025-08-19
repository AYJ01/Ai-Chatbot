import React, { useEffect, useState, useMemo } from "react";
import { Plus, Clock, Shield } from "lucide-react";
import getChats from "../getChats.cjs";
import { useUserData } from "@nhost/react";
import { useNavigate } from "react-router-dom";

const ChatList = () => {
  const userData = useUserData();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);

  // Fallback to sessionStorage in case of refresh
  const user = userData || JSON.parse(sessionStorage.getItem("user"));

  // Fetch chats on component mount
  useEffect(() => {
    if (user) {
      getChats(user, setChats);
    }
  }, [user]);

  // Group chats by localid & pick last message
  const chatList = useMemo(() => {
    const grouped = {};

    chats.forEach((chat) => {
      if (!grouped[chat.localid]) {
        grouped[chat.localid] = [];
      }
      grouped[chat.localid].push(chat);
    });

    return Object.entries(grouped).map(([localid, chatArray]) => {
      // Sort by time descending (latest first)
      chatArray.sort((a, b) => new Date(b.message_time) - new Date(a.message_time));

      const lastMessage = chatArray[0]; // latest message

      return {
        localid,
        lastMessage: lastMessage?.message || "No messages yet",
        message_time: lastMessage?.message_time,
        messageCount: chatArray.length,
      };
    });
  }, [chats]);
  const num = useMemo(() => {
  if (chatList.length === 0) return 0;
  return Math.max(...chatList.map(c => c.localid));
}, [chatList]);
  // Handle a new chat creation
  const handleNewChat = () => {
    console.log("New chat clicked!");
    
    navigate(`/chat/${num+1}`)
    // Logic to create a new chat goes here
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Chats</h1>
            <p className="text-gray-400">Secure conversations</p>
          </div>
          <button
            onClick={handleNewChat}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20">
          <Shield className="w-4 h-4 text-green-400" />
          <span>All conversations are end-to-end encrypted</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3">
          {chatList.map((chat) => (
            <div
              key={chat.localid}
              onClick={() => navigate(`/chat/${chat.localid}`)}
              className="bg-dark-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 cursor-pointer hover:bg-dark-700/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-white font-medium truncate">
                      {chat.lastMessage}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Shield className="w-3 h-3" />
                      <span>Encrypted</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {chat.message_time
                          ? new Date(chat.message_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                    <span>{chat.messageCount || 0} messages</span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
