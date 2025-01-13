const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const cors = require("cors");


// Initialize Express.js
const app = express();
app.use(express.json()); // Middleware for parsing JSON requests

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

const allowedOrigins = [
    "http://localhost:3000", // Development environment
    "https://jfr-git-main-itay-bobers-projects.vercel.app" // Production environment
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
}));

// Routes
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.post("/reports", async (req, res) => {
    const { crowdedness, lineNumber } = req.body;

    // Validate inputs
    if (typeof crowdedness !== "number" || typeof lineNumber !== "string") {
        return res.status(400).json({ error: "Invalid input data" });
    }

    try {
        const { data, error } = await supabase
            .from("reports")
            .insert([{ crowdedness, lineNumber }]);

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error("Error inserting report:", error);
        res.status(500).json({ error: error.message });
    }
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
