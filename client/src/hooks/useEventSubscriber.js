import { useEffect, useState } from "react";

const useEventSubscriber = (eventEmitterObject, eventTypes) => {
  const [, setLastUpdate] = useState(new Date().toISOString());

  const handleUpdate = () => {
    setLastUpdate(new Date().toISOString());
  };

  useEffect(() => {
    eventTypes.forEach(event =>
      eventEmitterObject.addListener(event, handleUpdate)
    );

    return () => {
      eventTypes.forEach(event =>
        eventEmitterObject.removeListener(event, handleUpdate)
      );
    };
  }, [eventEmitterObject]);
};

export default useEventSubscriber;
