import React from "react";

import participantPropType from "../../propTypes/participant";
import useEventSubscriber from "../../hooks/useEventSubscriber";
import Participant from "./Participant";

const EVENTS = ["trackPublished", "trackPublicationFailed"];

const LocalParticipant = ({ participant }) => {
  useEventSubscriber(participant, EVENTS);

  return <Participant participant={participant} />;
};

LocalParticipant.propTypes = {
  participant: participantPropType.isRequired
};

export default LocalParticipant;
