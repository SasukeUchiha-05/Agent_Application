require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true,
}
));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const authRoutes = require("./Routes/Auth");
app.use("/auth", authRoutes);

const AGENT1_API_URL = "http://localhost:5001/ask-agent";

app.post("/ask-agent", async (req, res) => {
    try {
        const { query } = req.body;
        console.log("HIHIHIHIHIHIHIHIHIHIHIH")
        const response = await axios.post(AGENT1_API_URL, { query });

        res.json({ response: response.data.response });
    } catch (error) {
        console.error("Error calling Python API:", error);
        res.status(500).json({ error: "Failed to get response from AI agent" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
