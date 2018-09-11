import * as React from 'react';

interface LoadingProps {
  error: boolean;
  retry: EventHandler.clickHandler;
  timedOut: boolean;
  pastDelay: boolean;
}

function Loading(props: LoadingProps) {
  if (props.error) {
    return (
      <div>
        Error! <button onClick={props.retry}>Retry</button>
      </div>
    );
  } else if (props.timedOut) {
    return (
      <div>
        Taking a long time... <button onClick={props.retry}>Retry</button>
      </div>
    );
  } else if (props.pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}

export default Loading;
