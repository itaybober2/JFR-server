const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();

const cors = require("cors");


// Initialize Express.js
const app = express();
app.use(express.json());

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
    methods: ["GET", "POST", "DELETE"],
}));

// Routes
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.post("/reports", async (req, res) => {
    const { crowded, inspector, roadBlock, pathChange, pathChangeDescription, lineNumber, lineId, closestStop } = req.body;

    if (
        typeof crowded !== "boolean" ||
        typeof inspector !== "boolean" ||
        typeof roadBlock !== "boolean" ||
        typeof pathChange !== "boolean" ||
        typeof lineNumber !== "string" ||
        typeof pathChangeDescription !== "string" ||
        typeof lineId !== "number" ||
        typeof closestStop !== "string"
    ) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    try {
        const { data, error } = await supabase
            .from("reports")
            .insert([{
                crowded,
                inspector,
                roadBlock,
                pathChange,
                pathChangeDescription,
                lineNumber,
                lineId,
                closestStop
            }]);

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

app.delete("/reports", async (req, res) => {
    const { lineId } = req.params;

    if (!lineId) {
        return res.status(400).json({ error: "Invalid input data" });
    }

    try {
        const { data, error } = await supabase
            .from("reports")
            .delete()
            .eq("lineId", lineId);

        if (error) throw error;

        res.status(200).json(data);

    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
