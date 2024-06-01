export class UserController {
    signup(req, res){
        console.log(req.body);
        res.redirect('/signin');
    }

    signin(req, res){
        console.log(req.body);
        res.redirect('/home');
    }

}

