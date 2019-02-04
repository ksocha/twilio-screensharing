import React, { useRef, useLayoutEffect } from "react";

import trackPropType from "../../propTypes/track";

const Track = ({ track }) => {
  const mediaElement = useRef(null);
  useLayoutEffect(() => {
    track.attach(mediaElement.current);

    return () => {
      track.detach(mediaElement.current);
    };
  }, [track]);

  return <track.kind autoPlay ref={mediaElement} />;
};

Track.propTypes = {
  track: trackPropType.isRequired
};

export default Track;
