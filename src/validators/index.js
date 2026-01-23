import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
      body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
      body(username)
        .trim()
        .notEmpty()
        .withMessage("username is required")
        .isLowercase()
        .withMessage("username should be lowercase")
        .length({min:3})
        .withMessage("username should be atleast 3 characters long"),
      body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required")
        .length({min:4})
        .withMessage("password should be atleast 4 characters")
    ]
}

export {userRegisterValidator}