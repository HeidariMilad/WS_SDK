import React from "react";
import { ConnectionProvider } from "./connection/ConnectionContext";
import { ConnectionBanner } from "./components/ConnectionBanner";
import { ConnectionEventsPanel } from "./components/ConnectionEventsPanel";
import { InteractiveCanvas } from "./components/InteractiveCanvas";

export const App: React.FC = () => {
  return (
    <ConnectionProvider>
      <div>
        <ConnectionBanner />
        <ConnectionEventsPanel />
        <main>
          <InteractiveCanvas />
        </main>
      </div>
    </ConnectionProvider>
  );
};

export default App;
