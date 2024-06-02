import express from "express";
import { UserController } from "../controllers/user.controller.js";
import {ensureAuthenticated} from "../middlewares/ensureAuthenticated.js";
import { dataValidation } from "../middlewares/validation.middleware.js";

const router = express.Router();
const userController = new UserController();

router.get('/signup', (req, res) => res.render("signup", {errorMsg:null}));
router.get('/signin', (req, res) => res.render("signin", {errorMsg:null}));
router.get(
    '/home', 
    ensureAuthenticated, 
    (req, res) => res.render("home", {user:req.session.user})
);

router.get("/reset-password", (req, res) => res.render("reset", {errorMsg:null}))
router.get("/forgot-password", (req, res) => res.render("forgot", {errorMsg:null, successMsg:null}))

router.get('/signout', userController.signout);
router.post('/signup', dataValidation('signup'), userController.signup);
router.post('/signin', userController.signin);
router.post('/forgot', userController.forgotPassword)
router.post('/reset-password', dataValidation('reset'), userController.resetPassword);

export default router

