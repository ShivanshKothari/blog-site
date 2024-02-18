import express from "express";
import {loginController, submitController } from "../controllers/usersControllers.js";


const router = express.Router();

/* GET users listing. */
router.get("/", loginController);

router.post("/submit", submitController);

// router.get("/editor", async (req, res) => {
//   if (
//     req.body["username"] === "ShivanshKothari" &&
//     req.body["password"] === "Skothari"
//   )
//     res.render("postmanager", {
//       postTiles: await Blog.find({})
//         .select("image_path heading url")
//         .sort({ id: -1 }),
//     });
//   else res.redirect(`./?cred-error`);
// });

export default router;
