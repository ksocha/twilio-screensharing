# Twilio Video chat with screen sharing - React app

This is a simple React app that demonstrates how to use [Twilio Programmable Video](https://www.twilio.com/video) and implement browser extension free screen sharing feature.

This project includes both backend and frontend part of the app. I've tried to simplify things as much I could.

## Why

Various browsers support screen sharing by using custom extensions. While it works, it takes relatively a lot of time to implement such extension and publish it, not to mention that this kind of solution is not very user-friendly. With WebRTC trying to standardize the API, now we can try to implement a cross-browser solution.

**Note that not all major browsers support the standard just yet**. There are also some differences across various implementations. To handle these differences, we're going to use [WebRTC adapter](https://github.com/webrtchacks/adapter) library. That way, we'll end up with a code that (hopefully) will require very little changes to enable screen sharing on remaining browsers. At the moment, **only** FireFox supports screen-sharing.

You can find more information on WebRTC standard implementation in the [article](https://blog.mozilla.org/webrtc/getdisplaymedia-now-available-in-adapter-js/).

## Prerequisites

- Active [Twilio](https://www.twilio.com/) account (can be a trial account)
- Node.js installed

## How to run the app

To run the app locally, you need to start up the Express backend server and React dev server simultaneously.

To do this, simply:

1. Navigate to the root of the project.
2. Install the dependencies by executing `yarn install`
3. Create `.env` file with Twilio account details in the root directory. It should look like this (replace with your own values):

   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

   You can obtain the values after logging to your account. `API_KEY` and `API_SECRET` pair must be generated [here](https://www.twilio.com/console/video/runtime/api-keys).

4. Start up the Express server: `node server.js`
5. Navigate to `client` sub-directory
6. Install frontend dependencies by executing `yarn install`
7. Start up the React dev server: `yarn start`

After this you can open `http://localhost:3000/` in your browser, the app should be running.

To join the video room, type the user name, room name and click `Join`.
