import { PureComponent } from "react";
import PropTypes from "prop-types";
import adapter from "webrtc-adapter";
import TwilioVideo from "twilio-video";
import { isEmpty } from "lodash";

import { getToken } from "../../api";

const SCREEN_TRACK_NAME = "screen";
const VIDEO_TRACK_NAME = "camera";
const AUDIO_TRACK_NAME = "microphone";

class AppContainer extends PureComponent {
  static propTypes = {
    render: PropTypes.func.isRequired
  };

  state = {
    videoRoom: null,
    isJoining: false,
    username: "",
    roomname: ""
  };

  async componentDidMount() {
    if (adapter.browserDetails.browser === "firefox") {
      adapter.browserShim.shimGetDisplayMedia(window, "screen");
    }
  }

  getToken = async () => {
    const { username } = this.state;

    const response = await getToken(username);

    return response.data.token;
  };

  joinRoom = async () => {
    const { roomname } = this.state;

    this.setState({ isJoining: true });

    try {
      const token = await this.getToken();

      const localVideoTrack = await TwilioVideo.createLocalVideoTrack({
        name: VIDEO_TRACK_NAME
      });

      const localAudioTrack = await TwilioVideo.createLocalAudioTrack({
        name: AUDIO_TRACK_NAME
      });

      const videoRoom = await TwilioVideo.connect(
        token,
        {
          name: roomname,
          tracks: [localVideoTrack, localAudioTrack]
        }
      );

      videoRoom.on("disconnected", () => {
        localVideoTrack.stop();
        localAudioTrack.stop();
        this.stopScreenTrack();

        this.setState({
          videoRoom: null,
          localVideoTrack: null,
          localAudioTrack: null
        });
      });

      this.setState({ videoRoom, localVideoTrack, localAudioTrack });
    } catch (error) {
      // TODO: add error indicator
    }

    this.setState({ isJoining: false });
  };

  leaveRoom = async () => {
    const { videoRoom } = this.state;

    if (videoRoom) {
      videoRoom.disconnect();
    }
  };

  stopScreenTrack = () => {
    const { screenTrack } = this.state;

    if (screenTrack) {
      screenTrack.stop();
      this.setState({ screenTrack: null });
    }
  };

  shareScreen = async () => {
    const { videoRoom, localVideoTrack, screenTrack } = this.state;

    if (!screenTrack) {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      const [screenTrack] = stream.getVideoTracks();
      this.setState({
        screenTrack: new TwilioVideo.LocalVideoTrack(screenTrack, {
          name: SCREEN_TRACK_NAME
        })
      });

      videoRoom.localParticipant.publishTrack(screenTrack);
      videoRoom.localParticipant.unpublishTrack(localVideoTrack);
    } else {
      const { screenTrack } = this.state;

      videoRoom.localParticipant.unpublishTrack(screenTrack);
      videoRoom.localParticipant.publishTrack(localVideoTrack);
      this.stopScreenTrack();
    }
  };

  changeUsername = username => this.setState({ username });

  changeRoomname = roomname => this.setState({ roomname });

  render() {
    const { render } = this.props;
    const { videoRoom, isJoining, username, roomname } = this.state;

    return render({
      videoRoom,
      username,
      roomname,
      isVideoSupported: TwilioVideo.isSupported,
      isScreenSharingSupported: Boolean(
        navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia
      ),
      canJoin: !isEmpty(username) && !isEmpty(roomname),
      isJoining,
      onJoin: this.joinRoom,
      onLeave: this.leaveRoom,
      onShare: this.shareScreen,
      onRoomnameChange: this.changeRoomname,
      onUsernameChange: this.changeUsername
    });
  }
}

export default AppContainer;
