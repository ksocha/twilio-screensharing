import React from "react";

import participantPropType from "../../propTypes/participant";
import Track from "../Track/Track";
import { mapToArray } from "../../utils";

import styles from "./Participant.module.scss";

const Participant = ({ participant }) => (
  <div className={styles.participant}>
    {mapToArray(participant.tracks).map(
      trackPublication =>
        trackPublication.track && (
          <Track
            key={trackPublication.track.name}
            track={trackPublication.track}
          />
        )
    )}
  </div>
);

Participant.propTypes = {
  participant: participantPropType.isRequired
};

export default Participant;
