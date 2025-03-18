import React, { useState } from "react";
import axios from "axios";
import { FaRobot, FaPaperPlane, FaSpinner } from "react-icons/fa";
import "./CSS/Agent.css";

const Agent = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const sendQuery = async () => {
    if (!query.trim()) return; // Prevent empty queries
    setLoading(true);
    setResponse(""); // Clear previous response

    try {
      const res = await axios.post("http://localhost:3001/ask-agent", {
        query: query,
      });

      setResponse(res.data.response);
    } catch (error) {
      setResponse("Error fetching response from AI.");
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (text) => {
    if (!text) return null;
    
    // Split by headings (starts with **)
    const sections = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
    
    return (
      <div className="formatted-response">
        {sections.map((section, index) => {
          if (section.startsWith('**') && section.endsWith('**')) {
            // This is a heading
            return <h3 key={index} className="response-heading">{section.replace(/\*\*/g, '')}</h3>;
          } else {
            // This is regular content - split by bullet points or paragraphs
            const paragraphs = section.split(/\n-|\n/).filter(Boolean);
            return paragraphs.map((para, pIndex) => {
              if (para.trim().startsWith('-') || para.trim().startsWith('•')) {
                return <div key={`${index}-${pIndex}`} className="response-bullet">{para.replace(/^-|^•/, '').trim()}</div>;
              } else {
                return <p key={`${index}-${pIndex}`} className="response-paragraph">{para.trim()}</p>;
              }
            });
          }
        })}
      </div>
    );
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendQuery();
    }
  };

  return (
    <div className="agent-container">
      <div className="agent-header">
        <FaRobot className="agent-icon" />
        <h1>AI Assistant</h1>
      </div>

      <div className="query-container">
        <textarea
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyPress}
          placeholder="Ask me anything..."
          rows="4"
          className="query-input"
        />
        <button onClick={sendQuery} disabled={loading} className="send-button">
          {loading ? <FaSpinner className="loading-icon" /> : <FaPaperPlane />}
          <span>{loading ? "Processing..." : "Send"}</span>
        </button>
      </div>

      {response && (
        <div className="response">
          <h2>Response</h2>
          <div className="response-content">
            {formatResponse(response)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Agent;
