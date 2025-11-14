import React from "react";
import { ConnectionProvider } from "./connection/ConnectionContext";
import { ConnectionBanner } from "./components/ConnectionBanner";
import { ConnectionEventsPanel } from "./components/ConnectionEventsPanel";

export const App: React.FC = () => {
  return (
    <ConnectionProvider>
      <div>
        <ConnectionBanner />
        <ConnectionEventsPanel />
        <main style={{ padding: "1rem" }}>
          <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>
            Command demo UI goes here.
          </p>
        </main>
      </div>
    </ConnectionProvider>
  );
};

export default App;
