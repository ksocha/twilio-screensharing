import PropTypes from "prop-types";

import participantPropType from "./participant";

export default PropTypes.shape({
  localParticipant: participantPropType.isRequired,
  participants: PropTypes.instanceOf(Map).isRequired
});
