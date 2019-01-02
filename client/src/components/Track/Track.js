import React, { PureComponent } from "react";

import trackPropType from "../../propTypes/track";

class Track extends PureComponent {
  media = React.createRef();

  static propTypes = {
    track: trackPropType.isRequired
  };

  componentDidMount() {
    const { track } = this.props;

    track.attach(this.media.current);
  }

  render() {
    const { track } = this.props;

    return <track.kind autoPlay ref={this.media} />;
  }
}

export default Track;
