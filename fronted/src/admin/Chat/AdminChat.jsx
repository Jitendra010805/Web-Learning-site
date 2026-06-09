import React, { useState, useEffect, useRef } from "react";
import Layout from "../Utils/Layout";
import { motion } from "framer-motion";
import "../adminFeatures.css";
import { MdSend, MdPhone, MdVideocam } from "react-icons/md";

const initialContacts = [
  { id: 1, name: "Alice Walker", lastMsg: "Thanks for the feedback!", unread: 0 },
  { id: 2, name: "Bob Marley", lastMsg: "When is the next layout class?", unread: 2 },
  { id: 3, name: "Charlie Puth", lastMsg: "I need help with my assigned project.", unread: 0 },
];

const mockThreads = {
  1: [
    { id: 1, text: "Hello! Did you review my submission?", mine: false },
    { id: 2, text: "Yes Alice, it looked great! I left a few comments.", mine: true },
    { id: 3, text: "Thanks for the feedback!", mine: false },
  ],
  2: [
    { id: 1, text: "Hi instructor, just a quick question.", mine: false },
    { id: 2, text: "When is the next layout class?", mine: false },
  ],
  3: [
    { id: 1, text: "I need help with my assigned project.", mine: false },
  ],
};

const AdminChat = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const [activeContact, setActiveContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(mockThreads[contacts[0].id]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    setMessages(mockThreads[activeContact.id] || []);
    // Clear unread
    setContacts(prev => prev.map(c => c.id === activeContact.id ? { ...c, unread: 0 } : c));
  }, [activeContact]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMsg = (e) => {
    e.preventDefault();
    if(!input.trim()) return;

    const newMsg = { id: Date.now(), text: input.trim(), mine: true };
    setMessages(prev => [...prev, newMsg]);
    setInput("");

    // Simulate auto-reply
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now(), text: `Auto-reply to: "${newMsg.text}"`, mine: false }]);
    }, 1500);
  };

  return (
    <Layout>
      <motion.div 
        className="feature-page-container"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      >
        <div className="feature-header">
          <h2 className="feature-title">Student Chat</h2>
        </div>

        <div className="glass-panel chat-layout">
          {/* Left Contacts Pane */}
          <div className="contacts-pane">
            <h3 style={{ margin: "0 0 10px 5px", fontSize: "1rem" }}>Messages</h3>
            {contacts.map(c => (
              <div 
                key={c.id} 
                className={`contact-item ${activeContact.id === c.id ? "active" : ""}`}
                onClick={() => setActiveContact(c)}
              >
                <div className="contact-avatar">{c.name.charAt(0)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{c.name}</span>
                    {c.unread > 0 && <span style={{ background: "#ef4444", color: "white", borderRadius: "10px", padding: "2px 6px", fontSize: "0.65rem", fontWeight: "bold" }}>{c.unread}</span>}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.lastMsg}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Chat Pane */}
          <div className="chat-pane" style={{ borderLeft: "1px solid var(--border-color)", paddingLeft: "20px" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "15px", marginBottom: "10px" }}>
               <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                 <div className="contact-avatar">{activeContact.name.charAt(0)}</div>
                 <div>
                   <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{activeContact.name}</h3>
                   <span style={{ fontSize: "0.75rem", color: "#16a34a" }}>Online</span>
                 </div>
               </div>
               <div style={{ display: "flex", gap: "10px", color: "var(--text-muted)" }}>
                 <MdPhone size={22} style={{ cursor: "pointer" }} />
                 <MdVideocam size={22} style={{ cursor: "pointer" }} />
               </div>
             </div>

             <div className="chat-history">
               {messages.map(m => (
                 <motion.div key={m.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`msg-bubble ${m.mine ? "msg-mine" : "msg-theirs"}`}>
                   {m.text}
                 </motion.div>
               ))}
               <div ref={endRef} />
             </div>

             <form className="chat-input-area" onSubmit={sendMsg}>
               <input 
                 type="text" 
                 value={input} onChange={e => setInput(e.target.value)} 
                 placeholder="Type your message..." 
                 style={{ flex: 1, padding: "12px 16px", borderRadius: "20px", border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-color)", outline:"none" }}
               />
               <button type="submit" style={{ background: "var(--accent-color)", color: "white", border: "none", width: "45px", height: "45px", borderRadius: "50%", display: "flex", alignItems: "center", justify: "center", cursor: "pointer" }}>
                 <MdSend size={20} />
               </button>
             </form>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default AdminChat;
