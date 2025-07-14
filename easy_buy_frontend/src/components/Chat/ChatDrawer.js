import React, { useState } from "react";

/**
 * ChatDrawer - Chat side drawer.
 * Props:
 *   user - current user
 *   open - whether the drawer is open
 *   onClose - function to close drawer
 *   mini - if true, show as floating icon, else as drawer
 */
function ChatDrawer({ user, open, onClose, mini }) {
  // Basic local chat state for demonstration
  const [messages, setMessages] = useState([
    // {from, to, text, timestamp}
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // PUBLIC_INTERFACE
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { from: user.name, to: "other", text: input, timestamp: Date.now() },
    ]);
    setInput("");
  };

  if (mini) {
    return (
      <div
        className="chat-mini"
        onClick={open ? undefined : onClose}
        title="Open chat"
        style={{
          position: "fixed",
          bottom: 28,
          right: 32,
          zIndex: 1500,
          cursor: "pointer",
        }}
      >
        <span role="img" aria-label="Chat" style={{ fontSize: 28 }}>💬</span>
      </div>
    );
  }

  return (
    <aside
      className={`chat-drawer${open ? " open" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 340,
        height: "100%",
        background: "var(--bg-secondary)",
        boxShadow: "-2px 0 8px #0001",
        transition: "transform 0.3s",
        transform: open ? "translateX(0)" : `translateX(120%)`,
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="chat-header" style={{ padding: 12, borderBottom: "1px solid var(--border-color)" }}>
        <span>Chat</span>
        <button
          className="btn btn-small"
          style={{ float: "right" }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <div
        className="chat-messages"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 14,
          background: "var(--bg-secondary)",
        }}
      >
        {messages.length === 0 ? (
          <div style={{ color: "var(--text-color)", opacity: 0.6 }}>
            No messages yet.
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.from === user.name
                  ? "chat-message outgoing"
                  : "chat-message incoming"
              }
              style={{ marginBottom: 8, textAlign: msg.from === user.name ? "right" : "left" }}
            >
              <span className="chat-bubble">{msg.text}</span>
            </div>
          ))
        )}
      </div>
      <form
        className="chat-input-container"
        onSubmit={handleSend}
        style={{ padding: 10, borderTop: "1px solid var(--border-color)" }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
          style={{ width: "75%", marginRight: 10 }}
          disabled={loading}
        />
        <button className="btn btn-accent" type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </aside>
  );
}

export default ChatDrawer;
