import { check, validationResult } from 'express-validator';

export const dataValidation = [
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/\d/).withMessage('Password must contain a number')
        .matches(/\W/).withMessage('Password must contain a special character'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMsgs = errors.array().map(err => err.msg).join(', ');
            return res.render('signup', { errorMsg: errorMsgs });
        }
        next();
    }
];
