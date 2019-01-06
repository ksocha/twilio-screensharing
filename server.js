const express = require("express");
const twilio = require("twilio");

require("dotenv").config();

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const port = process.env.PORT || 5000;

const app = express();

app.listen(port);

app.get("/token", (req, res) => {
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

  token.addGrant(new VideoGrant());

  token.identity = req.query.user;

  res.send({ token: token.toJwt() });
});
