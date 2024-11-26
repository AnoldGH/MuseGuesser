const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getAccessToken } = require("../utility/tokenManager");
const DailyChallenge = require("../models/dailyChallenge");
const User = require("../models/userModel");
const mongoose = require("mongoose");

function normalizeDate(date) {
    const normalized = new Date(date);
    normalized.setUTCHours(0, 0, 0, 0);
    return normalized;
}

router.get("/dailyChallenge", async (req, res) => {
    try {

        const today = normalizeDate(new Date());
        const challenge = await DailyChallenge.findOne({date: today});

        if (!challenge) {
            return res.status(404);
        }

        res.json(challenge);

    } catch (error) {
        console.error("Error fetching daily challenge:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.post("/updateDailyScore", async(req, res) => {
    const {userId, score} = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // if (user.dailyScore !== -1) {
        //     return res.status(400).json({ error: "Daily challenge already completed." });
        // }   

        user.dailyScore = score;
        await user.save();

        res.json({ message: "Daily score updated successfully!" });

    } catch(error) {
        console.error("Error updating score:", error);
        res.status(500).json({ error: "Internal server error." });
    }
})

module.exports = router;