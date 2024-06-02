import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

export class UserController {
    async signup(req, res) {
        const { name, email, password } = req.body;
        try {
            const userExists = await UserModel.doesUserExist(email);
            if (userExists) {
                res.render("signup", { errorMsg: "EMail already exists" });
            } else {
                await UserModel.createUser(name, email, password);
                res.redirect('/signin');
            }
        } catch (error) {
            console.log(error, " signup ");
            res.render("signup", { errorMsg: "Error creating user" });
        }
    }

    async signin(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserModel.signin(email, password);
            if (!user) {
                return res.render("signin", { errorMsg: "User does not exist" })
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.render("signin", { errorMsg: "Password incorrect" })
            }
            req.session.user = user;
            res.render("home", { user });
        } catch (e) {
            console.log('error in signin', e);
            res.render("signin", { errorMsg: e });
        }
    }

    signout(req, res) {
        req.session.destroy(err => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('signin');
            }
        })
    }

    async forgotPassword(req, res) {
        try{
            const { email } = req.body;
            const userExist = await UserModel.doesUserExist(email);
            if (userExist) {
                const userName = userExist.name
                const randomPassword = crypto.randomBytes(8).toString('hex');
                const hashedPassword = await bcrypt.hash(randomPassword, 10);
                await UserModel.updateUserPassword(email, hashedPassword);
    
                // Send email
                let transporter = nodemailer.createTransport({
                    service:"gmail",
                    auth:{
                        user:'nagdaneha97@gmail.com',
                        pass:'rylb sysd umyl hkcd'
                    }
                })
    
                let mailOptions = {
                    from:"",
                    to:email,
                    subject:"Use new password in NodeJS Authentication",
                    text:`Hello ${userName},\n\nWe have sent you a new password. Please log in using this password first and then you can reset your password in the app once you are logged in.\n\nNew Password: ${randomPassword}`
                }
    
                await transporter.sendMail(mailOptions);
                res.render("forgot", { successMsg: "A new password has been sent to your email.", errorMsg:null });
            } else {
                res.render("forgot", { errorMsg: "User does not exist", successMsg:null });
            }
        } catch (e){
            console.log("error while sending new password ", e);
        }
    }

    async resetPassword (req, res){
        const {password, confirmPassword} = req.body;
        const {email} = req.session.user;
        if(password != confirmPassword){
            return res.render("reset", {errorMsg:"Password does not match with confirm password", user:req.session.user});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.updateUserPassword(email, hashedPassword);
        req.session.destroy(err => {
            if (err) {
                console.log(err);
            } else {
                res.render('signin', {errorMsg:null});
            }
        })
    }
}


