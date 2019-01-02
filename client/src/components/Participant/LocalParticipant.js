import React, { PureComponent } from "react";

import participantPropType from "../../propTypes/participant";
import EventSubscriber from "../EventSubscriber/EventSubscriber";
import Participant from "./Participant";

const EVENTS = ["trackPublished", "trackPublicationFailed"];

class LocalParticipant extends PureComponent {
  static propTypes = {
    participant: participantPropType.isRequired
  };

  update = () => this.forceUpdate();

  render() {
    const { participant } = this.props;

    return (
      <EventSubscriber
        events={EVENTS}
        eventEmitterObject={participant}
        onUpdate={this.update}
      >
        <Participant participant={participant} />
      </EventSubscriber>
    );
  }
}

export default LocalParticipant;
