import express from "express";
import bcrypt from "bcrypt";
import { sendEvent } from "./events.js"
import * as data from "../data.js";

const router = express.Router();

router.get("/", (req, res) => {
    if (!req.userName) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const users = data.getUsers();
    res.json(users);
});

router.post("/", (req, res) => {
    if (!req.userLevel || req.userLevel < 8) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const { name, password, level } = req.body;
    const passwordHash = bcrypt.hashSync(password, 12);

    const changes = data.insertUser(name, passwordHash, level);

    if (changes === 0) {
        return res.status(409).json({ error: "User already exists" });
    }

    res.status(201).json({ name, level });
});

router.get("/:name/likes", (req, res) => {
    if (!req.userName) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const likes = data.getLikedPhotos(req.params.name);
    res.json(likes);
});

router.post("/:name/likes", (req, res) => {
    if (!req.userName) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.userName !== req.params.name) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const changes = data.insertLike(req.body.photoId, req.params.name);

    if (changes === 0) {
        return res.status(409).json({ error: "Like already exists" });
    }

    const photo = data.getPhoto(req.body.photoId)
    sendEvent(JSON.stringify({
        type: 'like',
        user: req.params.name,
        photo: photo.caption ?? photo.filename
    }))
    res.status(201).json({ photoId: req.body.photoId })
});

router.delete("/:name/likes/:photoId", (req, res) => {
    if (!req.userName) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.userName !== req.params.name) {
        return res.status(403).json({ error: "Forbidden" });
    }

    const changes = data.deleteLike(req.params.photoId, req.params.name);

    if (changes === 0) {
        return res.status(404).json({ error: "Like not found" });
    }

    res.status(204).send();
});

export default router;