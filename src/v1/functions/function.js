const jwt = require("jsonwebtoken");
const multer = require("multer");
const { OAuth2Client } = require("google-auth-library");
exports.GenerateToken = (user) => {
  const token = jwt.sign(
    {
      userCode: user.userCode,
      name: user.name,
      email: user.email,
    },
    process.env.SECRET,
    {
      expiresIn: "30days",
    }
  );
  return token;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

exports.upload = multer({ storage: storage });

const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

exports.verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
};
