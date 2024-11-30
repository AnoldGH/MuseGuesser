const express = require("express");
const router = express.Router();
const axios = require("axios");
const { getAccessToken } = require("../utility/tokenManager");
const DailyChallenge = require("../models/dailyChallenge");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const { Room } = require("../utility/room");
const { Player } = require("../utility/player");
const { generateQuestionSets } = require("../utility/gameManager");

function normalizeDate(date) {
    const normalized = new Date(date);
    normalized.setUTCHours(0, 0, 0, 0);
    return normalized;
}

router.post("/joinRoom", async (req, res) => {
    try {
        const { code, userId } = req.body   // Get room code & player infos

        console.log("User %s requests to join room %s", userId, code)    // complete log

        let room = Room.getRoom(code)
        if (room !== undefined) {  // room exists
            // TODO: Room operation
            let player = new Player(userId)

            room.join(player)   // join

            // Response
            res.status(200).json({
                code: code,
                players: Array.from(room.players),
                questionSets: room.questionSets
            })
        }
        else {
            res.status(400) // bad request, room doesn't exist

            // TODO: we can choose to create room with specific code
        }

    } catch (error) {
        console.log("Error fetch room status:", error);
        res.status(500).json({ error: "Internal server error." });
    }
})

router.post("/createRoom", async (req, res) => {
    try {
        const { userId } = req.body   // Get room code & player infos

        // Create room
        let newRoom = new Room()

        let player = new Player(userId)
        newRoom.join(player)

        console.log("Created room with code", newRoom.getRoomCode())

        // Generate question sets
        newRoom.addQuestionSets(await generateQuestionSets(5)) // TODO: more options

        console.log("Question sets generated", newRoom.questionSets)

        // Response
        res.status(200).json({
            code: newRoom.getRoomCode(),
            questionSets: newRoom.questionSets
        })
    } catch(error) {
        console.error("Error creating room:", error);
        res.status(500).json({ error: "Internal server error." });
    }
})

router.post("/submitAnswer", async (req, res) => {
    try {
        const { code, userId, qSet, choice, score } = req.body // Room code | userId | questionSet index | choice index

        // Verify answer
        let room = Room.getRoom(code)
        let questionSet = room.questionSets[qSet]   // TODO: error handling

        let correct = questionSet.isCorrect(choice)
        if (correct) {    // correct answer
            let player = room.players[userId]
            player.addScore(score)
            console.log("Room %s, player %s add %d score", code, userId, score)
        } else {                                // wrong answer
            let player = room.players[userId]
            player.update()
            console.log("Room %s, player %s wrong answer", code, userId)
        }

        res.status(200).json({
            correct: correct,
            score: score
        })

    } catch(error) {
        console.error("Error verifying answer:", error);
        res.status(500).json({ error: "Internal server error." });
    }
})

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

router.get("/dailyChallengeScores", async (req, res) => {
    try {

        const users = await User.find();
        if (!users) {
            return res.status(404);
        }
        console.log(users)
        res.status(200).json({users: users});

    } catch (error) {
        console.error("Error fetching daily challenge scores:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;