import User from "../models/user.model.js";
import sendResendEmail from '../utils/emailSender.js'

export async function generateAccessAndRefreshTokens(userId) {
  // 1) Load the user document
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found when generating tokens');
  }

  const accessToken  = user.getAccessToken();
  const refreshToken = user.getRefreshToken(); // ← use the correct method name!

  user.refreshToken = refreshToken;             // ← matches your schema field
  await user.save({ validateBeforeSave: false });

  // 4) Return both tokens
  return { accessToken, refreshToken };
}


export const register = async (req, res) => {
  try {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password should be at least 6 characters long" });
    }

    if (!email.includes("@") || !email.endsWith(".com")) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: "Username should be at least 3 characters long" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }


    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const result = await sendResendEmail(email, 'verify', code, username);
    console.log(result);

    if (!result.success) {
      return res.status(400).json({ message: "Error sending email" });
    }


    // ✅ Generate random avatar URL using DiceBear
    const seed = username + Date.now(); // makes it unique per user
    const avatar = `https://api.dicebear.com/8.x/fun-emoji/svg?seed=${encodeURIComponent(seed)}`;

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      prfileImage: avatar,
      verifieCode: code,
      verifieCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });


    res.status(201).json({ message: "User created successfully", user_id: user._id });


  } catch (error) {
    res.status(500).json({ message: error.message });

  }

}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "User not found please register" });
    }

    //pasword check
    if (!user.matchPassword(password)) {
      return res.status(400).json({ message: "Password is incorrect" });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const options = {
      httpOnly: true,
      secure: true
    }
    const sendUser = await User.findById(user._id).select("-password");


    return res.status(200).json({
      message: "Login successful",
      user: sendUser,
      accessToken,
      refreshToken
    });


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    console.log(code);

    // Find the user by matching code
    const user = await User.findOne({ verifieCode: code });
    if (!user) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.verifieCodeExpiry < new Date()) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    // Atomically set verified = true and remove the code & expiry fields
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: { verified: true },
        $unset: { verifieCode: "", verifieCodeExpiry: "" }
      },
      { new: true } // return the updated document
    ).select("-password");

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(updatedUser._id);
    console.log(accessToken, refreshToken)

    // Send response with tokens in JSON
    return res.status(200).json({
      message: "Email verified successfully",
      user: updatedUser,
      accessToken,
      refreshToken
    });

  } catch (err) {
    console.error("Email verification error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new code & expiry
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save to user
    user.verifieCode = newCode;
    user.verifieCodeExpiry = newExpiry;
    await user.save();

    // Send the email
    const result = await sendResendEmail(email, 'verify', newCode, user.username);
    if (!result.success) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    return res.status(200).json({ 
      message: "OTP has been resent to your email" 
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refresh = async (req, res) => {
   const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }
console.log(refreshToken)
  try {
   const user = await User.findOne({refreshToken: refreshToken }).select("-password -refreshToken") ;

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    return res.status(200).json({ accessToken, refreshToken ,user});
  
  }catch (error) {
    res.status(500).json({ message: error.message });
  }



}
