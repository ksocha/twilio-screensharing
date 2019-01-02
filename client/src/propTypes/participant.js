import PropTypes from "prop-types";

export default PropTypes.shape({
  sid: PropTypes.string.isRequired,
  tracks: PropTypes.instanceOf(Map).isRequired
});
