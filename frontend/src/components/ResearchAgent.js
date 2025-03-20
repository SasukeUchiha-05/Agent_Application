import React, { useState } from "react";
import axios from "axios";
import { FaRobot, FaPaperPlane, FaSpinner } from "react-icons/fa";
import "./CSS/Agent2.css";

const ResearchAgent = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null); // Store response as an object
  const [loading, setLoading] = useState(false);

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const sendQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null); // Clear previous response

    try {
      const res = await axios.post("http://localhost:3001/research", {
        query: query,
      });

      console.log("Backend response:", res.data); // Debugging

      setResponse(res.data); // Store JSON directly
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse({ error: "Error fetching response from AI." });
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (response) => {
    if (!response || response.error) {
      return <p className="error-message">{response?.error || "No response available."}</p>;
    }

    const { summary, source } = response; // No need to parse, response is already an object

    return (
      <div className="formatted-response">
        <h3 className="response-heading">Summary</h3>
        <p className="response-paragraph">{summary}</p>

        <h3 className="response-heading">Sources</h3>
        <ul className="response-source-list">
          {source.map((link, index) => (
            <li key={index}>
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
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
          <div className="response-content">{formatResponse(response)}</div>
        </div>
      )}
    </div>
  );
};

export default ResearchAgent;
