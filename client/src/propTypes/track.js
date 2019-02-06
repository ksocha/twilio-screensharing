import PropTypes from "prop-types";

export default PropTypes.shape({
  attach: PropTypes.func.isRequired,
  detach: PropTypes.func.isRequired,
  kind: PropTypes.oneOf(["video", "audio"]).isRequired
});
