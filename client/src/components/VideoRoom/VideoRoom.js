import React from "react";
import { Panel, Columns } from "react-bulma-components";
import { isEmpty } from "lodash";

import videoRoomPropType from "../../propTypes/videoRoom";
import Participant from "../Participant/Participant";
import LocalParticipant from "../Participant/LocalParticipant";
import useEventSubscriber from "../../hooks/useEventSubscriber";
import { mapToArray } from "../../utils";

const EVENTS = [
  "dominantSpeakerChanged",
  "participantConnected",
  "participantDisconnected",
  "reconnected",
  "reconnecting",
  "trackDimensionsChanged",
  "trackDisabled",
  "trackEnabled",
  "trackPublished",
  "trackStarted",
  "trackSubscribed",
  "trackUnpublished",
  "trackUnsubscribed"
];

const VideoRoom = ({ videoRoom }) => {
  useEventSubscriber(videoRoom, EVENTS);

  const remoteParticipants = mapToArray(videoRoom.participants);

  return (
    <Columns>
      <Columns.Column>
        <Panel>
          <Panel.Header>Local Participant</Panel.Header>
          <Panel.Block paddingless>
            <LocalParticipant participant={videoRoom.localParticipant} />
          </Panel.Block>
        </Panel>
      </Columns.Column>

      <Columns.Column>
        <Panel>
          <Panel.Header>Remote Participants</Panel.Header>
          <Panel.Block paddingless={!isEmpty(remoteParticipants)}>
            {!isEmpty(remoteParticipants)
              ? remoteParticipants.map(participant => (
                  <Participant
                    key={participant.sid}
                    participant={participant}
                  />
                ))
              : "No connected participants"}
          </Panel.Block>
        </Panel>
      </Columns.Column>
    </Columns>
  );
};

VideoRoom.propTypes = {
  videoRoom: videoRoomPropType.isRequired
};

export default VideoRoom;
