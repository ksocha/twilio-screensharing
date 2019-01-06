import { PureComponent } from "react";
import PropTypes from "prop-types";

export default class EventSubscriber extends PureComponent {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.string).isRequired,
    eventEmitterObject: PropTypes.shape({}),
    onUpdate: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  };

  static defaultProps = {
    eventEmitterObject: null
  };

  componentDidMount() {
    const { eventEmitterObject } = this.props;

    if (eventEmitterObject) {
      this.subscribeEvents(eventEmitterObject);
    }
  }

  componentDidUpdate(prevProps) {
    const { eventEmitterObject } = this.props;

    if (prevProps.eventEmitterObject === eventEmitterObject) {
      return;
    }

    if (eventEmitterObject) {
      this.subscribeEvents(eventEmitterObject);
    } else {
      this.unsubscribeEvents(prevProps.eventEmitterObject);
    }
  }

  componentWillUnmount() {
    const { eventEmitterObject } = this.props;

    if (eventEmitterObject) {
      this.unsubscribeEvents(eventEmitterObject);
    }
  }

  subscribeEvents = room => {
    const { events, onUpdate } = this.props;

    events.forEach(event => room.addListener(event, onUpdate));
  };

  unsubscribeEvents = room => {
    const { events, onUpdate } = this.props;

    events.forEach(event => room.removeListener(event, onUpdate));
  };

  render() {
    return this.props.children;
  }
}
