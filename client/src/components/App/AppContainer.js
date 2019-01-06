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
    userName: "",
    roomName: "",
    errorMessage: null
  };

  async componentDidMount() {
    if (adapter.browserDetails.browser === "firefox") {
      adapter.browserShim.shimGetDisplayMedia(window, "screen");
    }
  }

  getToken = async () => {
    const { userName } = this.state;

    const response = await getToken(userName);

    return response.data.token;
  };

  joinRoom = async () => {
    const { roomName } = this.state;

    this.setState({ isJoining: true });

    try {
      const token = await this.getToken();

      const localVideoTrack = await TwilioVideo.createLocalVideoTrack({
        name: VIDEO_TRACK_NAME
      });

      this.setState({ localVideoTrack });

      const localAudioTrack = await TwilioVideo.createLocalAudioTrack({
        name: AUDIO_TRACK_NAME
      });

      this.setState({ localAudioTrack });

      const videoRoom = await TwilioVideo.connect(
        token,
        {
          name: roomName,
          tracks: [localVideoTrack, localAudioTrack]
        }
      );

      videoRoom.on("disconnected", () => {
        this.stopVideoTrack();
        this.stopAudioTrack();
        this.stopScreenTrack();

        this.setState({
          videoRoom: null
        });
      });

      this.setState({ videoRoom });
    } catch (error) {
      this.stopVideoTrack();
      this.stopAudioTrack();

      this.setState({
        errorMessage: error.message
      });
    }

    this.setState({ isJoining: false });
  };

  leaveRoom = async () => {
    const { videoRoom } = this.state;

    if (videoRoom) {
      videoRoom.disconnect();
    }
  };

  stopTrack = trackName => {
    const track = this.state[trackName];

    if (track) {
      track.stop();
      this.setState({ [trackName]: null });
    }
  };

  stopScreenTrack = () => this.stopTrack("screenTrack");
  stopVideoTrack = () => this.stopTrack("localVideoTrack");
  stopAudioTrack = () => this.stopTrack("localAudioTrack");

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

  hideErrorMessage = () => this.setState({ errorMessage: null });

  changeUserName = userName => this.setState({ userName });

  changeRoomName = roomName => this.setState({ roomName });

  render() {
    const { render } = this.props;
    const {
      videoRoom,
      isJoining,
      userName,
      roomName,
      errorMessage,
      screenTrack
    } = this.state;

    return render({
      videoRoom,
      userName,
      roomName,
      isVideoSupported: TwilioVideo.isSupported,
      isScreenSharingSupported: Boolean(
        navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia
      ),
      isScreenSharingEnabled: Boolean(screenTrack),
      canJoin: !isEmpty(userName) && !isEmpty(roomName),
      isJoining,
      onJoin: this.joinRoom,
      onLeave: this.leaveRoom,
      onShare: this.shareScreen,
      onRoomNameChange: this.changeRoomName,
      onUserNameChange: this.changeUserName,
      errorMessage,
      onErrorMessageHide: this.hideErrorMessage
    });
  }
}

export default AppContainer;
