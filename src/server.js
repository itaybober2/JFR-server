const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Express.js
const app = express();
app.use(express.json()); // Middleware for parsing JSON requests

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Routes
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Create a new report
app.post("/reports", async (req, res) => {
    const { content } = req.body;

    const { data, error } = await supabase
        .from("reports")
        .insert([{ content }]);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ data });
});

// Get all reports
app.get("/reports", async (req, res) => {
    const { data, error } = await supabase
        .from("reports")
        .select("*");

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ data });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
