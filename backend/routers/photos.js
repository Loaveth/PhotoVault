import express from "express";
import { sendEvent } from "./events.js"
import * as data from "../data.js";

const router = express.Router();

router.get("/", (req, res) => {
    if (!req.userName) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const photos = data.getPhotos(req.query.order, req.query);
    res.json(photos);
});

router.post("/", (req, res) => {
    if (!req.userName) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { filename, caption } = req.body;
    const id = data.insertPhoto(filename, caption, req.userName);

    sendEvent(JSON.stringify({
        type: 'newPhoto',
        photo: { id, filename, caption, uploadedBy: req.userName }
    }))
    res.status(201).json({ id, filename, caption, uploadedBy: req.userName });
});

router.delete("/:id", (req, res) => {
    if (!req.userName) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const photo = data.getPhoto(req.params.id);

    if (!photo) {
        return res.status(404).json({ error: "Photo not found" });
    }

    if (photo.uploadedBy !== req.userName && req.userLevel < 8) {
        return res.status(403).json({ error: "Forbidden" });
    }

    data.deletePhoto(req.params.id);
    res.status(204).send();
});

export default router;