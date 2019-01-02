import React from "react";
import PropTypes from "prop-types";

import "react-bulma-components/dist/react-bulma-components.min.css";
import { Section, Container, Button, Form } from "react-bulma-components";

import videoRoomPropType from "../../propTypes/videoRoom";
import VideoRoom from "../VideoRoom/VideoRoom";

import AppContainer from "./AppContainer";

const App = ({
  videoRoom,
  username,
  roomname,
  isJoining,
  isVideoSupported,
  isScreenSharingSupported,
  canJoin,
  onJoin,
  onLeave,
  onShare,
  onUsernameChange,
  onRoomnameChange
}) => {
  let content = null;

  if (!isVideoSupported) {
    content = <div>Video is not supported</div>;
  } else {
    content = videoRoom ? (
      <>
        {<VideoRoom videoRoom={videoRoom} />}

        <Form.Field kind="group" align="centered">
          <Form.Control>
            <Button
              onClick={() => onLeave()}
              // loading={isConnecting}
            >
              Disconnect
            </Button>
          </Form.Control>

          <Form.Control>
            <Button
              onClick={() => onShare()}
              // loading={isConnecting}
              disabled={!isScreenSharingSupported}
            >
              Share screen
            </Button>
          </Form.Control>
        </Form.Field>
      </>
    ) : (
      <>
        <Form.Field>
          <Form.Control>
            <Form.Input
              onChange={e => onUsernameChange(e.target.value)}
              name="username"
              placeholder="User name"
              value={username}
            />
          </Form.Control>
        </Form.Field>

        <Form.Field>
          <Form.Control>
            <Form.Input
              onChange={e => onRoomnameChange(e.target.value)}
              name="roomname"
              placeholder="Room name"
              value={roomname}
            />
          </Form.Control>
        </Form.Field>

        <Form.Field kind="group" align="centered">
          <Form.Control>
            <Button
              onClick={() => onJoin()}
              loading={isJoining}
              disabled={!canJoin}
            >
              Join
            </Button>
          </Form.Control>
        </Form.Field>
      </>
    );
  }

  return (
    <Section>
      <Container>
        {/* TODO: add proper text */}
        <h1>WebRTC app</h1>
        {content}
      </Container>
    </Section>
  );
};

App.propTypes = {
  videoRoom: videoRoomPropType,
  username: PropTypes.string.isRequired,
  roomname: PropTypes.string.isRequired,
  isJoining: PropTypes.bool.isRequired,
  isVideoSupported: PropTypes.bool.isRequired,
  isScreenSharingSupported: PropTypes.bool.isRequired,
  canJoin: PropTypes.bool.isRequired,
  onJoin: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onUsernameChange: PropTypes.func.isRequired,
  onRoomnameChange: PropTypes.func.isRequired
};

export { App as AppUnwrapped };

const render = containerProps => <App {...containerProps} />;
export default props => <AppContainer render={render} {...props} />;
