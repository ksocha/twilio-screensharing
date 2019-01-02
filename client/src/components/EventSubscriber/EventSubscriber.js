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

    if (eventEmitterObject !== prevProps.eventEmitterObject) {
      if (eventEmitterObject) {
        this.subscribeEvents(eventEmitterObject);
      }

      if (prevProps.eventEmitterObject) {
        this.unsubscribeEvents(prevProps.eventEmitterObject);
      }
    }
  }

  componentWillUnmount() {
    const { eventEmitterObject } = this.props;

    if (eventEmitterObject) {
      this.unsubscribeEvents(eventEmitterObject);
    }
  }

  subscribeEvents = room => {
    const { events } = this.props;

    events.forEach(event => room.addListener(event, this.update));
  };

  unsubscribeEvents = room => {
    const { events } = this.props;

    events.forEach(event => room.removeListener(event, this.update));
  };

  update = () => {
    const { onUpdate } = this.props;

    onUpdate();
  };

  render() {
    return this.props.children;
  }
}
