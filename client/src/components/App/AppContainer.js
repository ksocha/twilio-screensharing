import { PureComponent } from "react";
import PropTypes from "prop-types";
import adapter from "webrtc-adapter";
import TwilioVideo from "twilio-video";
import { isEmpty, first } from "lodash";

import { getToken } from "../../api";

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

  componentDidMount() {
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

      const localVideoTrack = await TwilioVideo.createLocalVideoTrack();
      this.setState({ localVideoTrack });

      const localAudioTrack = await TwilioVideo.createLocalAudioTrack();
      this.setState({ localAudioTrack });

      const videoRoom = await TwilioVideo.connect(
        token,
        {
          name: roomName,
          tracks: [localVideoTrack, localAudioTrack],
          insights: false
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
    try {
      const { videoRoom, localVideoTrack, screenTrack } = this.state;

      if (!screenTrack) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        const newScreenTrack = first(stream.getVideoTracks());

        this.setState({
          screenTrack: new TwilioVideo.LocalVideoTrack(newScreenTrack)
        });

        videoRoom.localParticipant.publishTrack(newScreenTrack);
        videoRoom.localParticipant.unpublishTrack(localVideoTrack);
      } else {
        videoRoom.localParticipant.unpublishTrack(screenTrack);
        videoRoom.localParticipant.publishTrack(localVideoTrack);
        this.stopScreenTrack();
      }
    } catch (error) {
      this.stopScreenTrack();

      this.setState({
        errorMessage: error.message
      });
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
