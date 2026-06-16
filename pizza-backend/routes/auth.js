const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

router.post("/register" , async (req , res) => {
    try{
        const{ name , email , password } = req.body;
         const existing = await User.findOne({email});

         if(existing){
            return res.status(400).json({ error: " Email Already Registered"});
         }

         const salt = await bcrypt.genSalt(10);
         const hashed = await bcrypt.hash(password , salt);


         const verifyToken = crypto.randomBytes(32).toString("hex");


         const user = await User.create({
            name,
            email,
            password: hashed,
            verifyToken
         });

        try {
          const verifyURL = `${process.env.BACKEND_URL}/api/auth/verify/${verifyToken}`;
          await sendEmail({
            to: email,
            subject: 'Verify your Pizza App account',
            text: `Click to verify your account: ${verifyURL}`
          });
        } catch (emailErr) {
          console.log('Email failed (ignored):', emailErr.message);
        }


        res.json({ message: 'Registered successfully!' });
    }catch(err){
        res.status(500).json({error: err.message})
    }

});


router.post("/login" , async (req , res) => {
    try{
        const{ email , password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({error: "No Account with this Email"});
        }

        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(400).json({error: "Wrong Password"});
        }

        if(!user.isVerified){
             return res.status(403).json({error: "Please verify your Email first"});
        }

        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "7d"}
        );

        res.json({
            token,
            user: {id: user._id, name: user.name, isAdmin: user.isAdmin }
        });
    }catch(err){
        res.status(500).json({error: err.message})        
    }
})

router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verifyToken: req.params.token });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired link' });
    }

    user.isVerified  = true;
    user.verifyToken = undefined; 
    await user.save();

   res.redirect(`${process.env.FRONTEND_URL}/?verified=true`);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: 'No account with this email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetToken  = resetToken;
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset your Pizza App password',
      text: `Reset link (expires in 1 hour): ${resetURL}`
    });

    res.json({ message: 'Reset link sent to your email' });

  } catch (err) {
  console.log("FORGOT PASSWORD ERROR:", err);
  res.status(500).json({ error: err.message });
}
});

router.post('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({ resetToken: req.params.token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired link' });
    }

    const salt       = await bcrypt.genSalt(10);
    user.password    = await bcrypt.hash(req.body.password, salt);
    user.resetToken  = undefined; 
    await user.save();

    res.json({ message: 'Password reset! You can now log in.' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
