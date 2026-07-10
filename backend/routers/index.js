import express from "express"
import photosRoutes from "./photos.js";
import usersRoutes from "./users.js";
import authRoutes from "./auth.js";
const router = express.Router()

router.use("/photos", photosRoutes)
router.use("/users", usersRoutes)
router.use("/login", authRoutes)


router.get("/", (req, res) => {
  res.send("PhotoVault API")
})

export default router