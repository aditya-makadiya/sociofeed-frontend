import { useState } from "react";
import { motion } from "framer-motion";
import {
  Close as CloseIcon,
  Send as SendIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { IconButton, TextField, InputAdornment } from "@mui/material";

const Chat = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "John Doe",
      message: "Hey! How are you doing?",
      time: "2:30 PM",
      avatar: "https://via.placeholder.com/32x32",
      isOwn: false,
    },
    {
      id: 2,
      user: "You",
      message: "I'm good! Just working on some projects.",
      time: "2:32 PM",
      avatar: "https://via.placeholder.com/32x32",
      isOwn: true,
    },
  ]);

  const [contacts] = useState([
    {
      id: 1,
      name: "John Doe",
      avatar: "https://via.placeholder.com/40x40",
      online: true,
      lastMessage: "Hey! How are you doing?",
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "https://via.placeholder.com/40x40",
      online: false,
      lastMessage: "See you tomorrow!",
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "https://via.placeholder.com/40x40",
      online: true,
      lastMessage: "Thanks for the help!",
    },
  ]);

  const [selectedContact, setSelectedContact] = useState(contacts[0]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: "You",
        message: message.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "https://via.placeholder.com/32x32",
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="h-full bg-white shadow-lg flex flex-col"
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={selectedContact.avatar}
              alt={selectedContact.name}
              className="w-8 h-8 rounded-full"
            />
            {selectedContact.online && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedContact.name}
            </h2>
            <p className="text-xs text-gray-500">
              {selectedContact.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <IconButton size="small" aria-label="More options">
            <MoreVertIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton onClick={onClose} aria-label="Close Chat">
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </div>
      </div>

      {/* Contacts List */}
      <div className="border-b border-gray-200 bg-gray-50">
        {/* Search Bar */}
        <div className="p-3">
          <TextField
            size="small"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 20, color: "gray" }} />
                </InputAdornment>
              ),
            }}
            className="w-full"
          />
        </div>

        {/* Contacts */}
        <div className="max-h-32 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-100 transition-colors ${
                selectedContact.id === contact.id
                  ? "bg-blue-50 border-r-2 border-blue-500"
                  : ""
              }`}
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-10 h-10 rounded-full"
                />
                {contact.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {contact.name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {contact.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-end space-x-2 max-w-xs ${msg.isOwn ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              <img
                src={msg.avatar}
                alt={msg.user}
                className="w-6 h-6 rounded-full"
              />
              <div
                className={`p-3 rounded-lg ${
                  msg.isOwn
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.isOwn ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <TextField
            size="small"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
            multiline
            maxRows={3}
          />
          <IconButton
            type="submit"
            disabled={!message.trim()}
            className={`${
              message.trim()
                ? "text-blue-500 hover:bg-blue-50"
                : "text-gray-400"
            }`}
            aria-label="Send message"
          >
            <SendIcon />
          </IconButton>
        </form>
      </div>
    </motion.div>
  );
};

export default Chat;
