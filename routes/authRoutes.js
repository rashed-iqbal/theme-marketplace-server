const router = require("express").Router();

const {
    handleSignin,
    handleSignup,
    handleGoogleSignin,
    forgotPasswordRequest,
    handleVerifyEmail,
    handleResetPassword,
    handleResendEmail,
} = require("../controllers/authController");

router.post("/signin", handleSignin);

router.post("/signup", handleSignup);

router.post("/google-signin", handleGoogleSignin);

router.post("/signup/:id/verify/:token", handleVerifyEmail);

router.post("/forgot-password", forgotPasswordRequest);

router.put("/reset-password", handleResetPassword);

router.post("/resend-email", handleResendEmail);

module.exports = router;
