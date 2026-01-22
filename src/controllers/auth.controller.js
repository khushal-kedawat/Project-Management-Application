import {User} from "../models/user.model.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import {asyncHandler} from "../utils/async-handler.js"
import { emailVerificationMailContent, sendEmail } from "../utils/email.js"


const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})
    return {accessToken, refreshToken}
  } catch (error) {
    throw new ApiError("something is went wrong while generating access token" , 500)
  }

}



const registerUser = asyncHandler(async (req , res) => {
  const {username , email , password , role} = req.body

  const existingUser = await User.findOne({
    $or: [{username} ,{email}]
  })
  if(existingUser){
    throw new ApiError("User with this username or email already exits" , 409)
  }
  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false
  })

  const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken()
  user.emailVerificationToken = hashedToken
  user.emailVerificationTokenExpiry = tokenExpiry
  await user.save({validateBeforeSave:false})

  await sendEmail(
    {
      email: user?.email,
      subject: "Please verify your Email",
      MailgenContent: emailVerificationMailContent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`
      ),
    }
  )
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry"
  )
  if(!createdUser){
    throw new ApiError("Something went wrong while regestering the user", 500)
  }
  return res
         .status(201)
         .json(
           new ApiResponse(
            200,
            {user: createdUser},
            "User registered successfully and verification email sent to your email"
           )
         )
})

export {registerUser}