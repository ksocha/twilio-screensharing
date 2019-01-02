const express = require("express");
const twilio = require("twilio");

const credentials = require("./twilioCredentials");

const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const port = process.env.PORT || 5000;

const app = express();

app.listen(port);

app.get("/token", (req, res) => {
  const token = new AccessToken(
    credentials.accountSid,
    credentials.apiKey,
    credentials.apiSecret
  );

  token.addGrant(new VideoGrant());

  token.identity = req.query.user;

  res.send({ token: token.toJwt() });
});
