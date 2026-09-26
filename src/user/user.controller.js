import express from "express";
import { searchuser } from "../user.service.js";

const userRouter = express.Router();

userRouter.get("/search", async (req, res) => {
    const result = await searchuser(req.query);
    return res.status(200).json({ msg: "done", result: result[0] });
});

export default userRouter;