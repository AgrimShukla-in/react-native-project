import User from "../models/user.model.js";
import sendResendEmail from '../utils/emailSender.js'


const  generateAccessAndRefereshTokens =async(userId)=>{
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = user.getAccessToken();
    const refreshToken = user.getRfrshToken();
    user.rfreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    return { accessToken,
      refreshToken };
  

    
    
  } catch (error) {
    console.log("error in generateAccessAndRefereshTokens"+error);
  }
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


res.status(201).json({ message: "User created successfully",user_id:user._id });

       
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
   
  const user = await User.findOne({email})
 
  if (!user) {
   return res.status(400).json({ message: "User not found please register" });
  }
   
  //pasword check
  if (!user.matchPassword(password)) {
   return res.status(400).json({ message: "Password is incorrect" });
  }
   const {accessToken,refreshToken} = generateAccessAndRefereshTokens(user._id);
  const options = {
     httpOnly: true,
     secure: true
 }
 const sendUser=await User.findById(user._id).select("-password");
 
 res.cookie("accessToken", accessToken, options);
 res.cookie("refreshToken", refreshToken, options);
 res.status(200).json({message:"Login successful",sendUser});
   
 
 } catch (error) {
  res.status(500).json({ message: error.message });
 }
}


export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    // Find user with matching code
    const user = await User.findOne({ verifieCode: code });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Check if code has expired
    if (user.verifieCodeExpiry < new Date()) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    // Mark as verified
    user.verified = true;
    user.verifieCode = null; // Clear code
    user.verifieCodeExpiry = null; // Clear expiry
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });

  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
