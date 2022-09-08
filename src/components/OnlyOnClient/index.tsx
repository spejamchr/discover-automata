import * as React from 'react';

const OnlyOnClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [renderReady, setRenderReady] = React.useState(false);

  React.useEffect(() => setRenderReady(true), []);

  return renderReady ? <>{children}</> : <></>;
};

export default OnlyOnClient;
