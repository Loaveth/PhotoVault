import express from "express";
import * as data from "../data.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET = "secret-key";
const invalidText = "Invalid credentials"

router.post("/", (req, res) => {
    const user = data.getUser(req.body.name);
    if (!user) {
        return res.status(401).json({error: invalidText});
    }

    const ok = bcrypt.compareSync(req.body.password, user.bcryptPassword);
    if (!ok) {
        return res.status(401).json({error: invalidText});
    }

    const token = jwt.sign({name: user.name, level: user.level}, SECRET);
    res.json({ token });
});

function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (header) {
        const token = header.replace("Bearer ", "");
        try {
            const payload = jwt.verify(token, SECRET);
            req.userName = payload.name;
            req.userLevel = payload.level;
        }catch (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
    }
    next()
}

export default router;
export { authMiddleware };