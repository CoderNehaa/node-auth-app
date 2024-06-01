import express from "express";
import { UserController } from "../controllers/user.controller.js";

const router = express.Router();
const userController = new UserController();

router.get('/signup', (req, res) => res.render("signup"));
router.get('/signin', (req, res) => res.render("signin"));
router.get('/home', (req, res) => res.render("home"));


router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

export default router