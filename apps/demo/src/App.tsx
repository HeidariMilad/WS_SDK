import React from "react";
import { ConnectionProvider } from "./connection/ConnectionContext";
import { ConnectionBanner } from "./components/ConnectionBanner";
import { ConnectionEventsPanel } from "./components/ConnectionEventsPanel";
import { InteractiveCanvas } from "./components/InteractiveCanvas";
import { ChatbotDrawer } from "./components/ChatbotDrawer";
import { CommandTimeline } from "./components/CommandTimeline";

export const App: React.FC = () => {
  return (
    <ConnectionProvider>
      <div>
        <ConnectionBanner />
        <ConnectionEventsPanel />
        <CommandTimeline />
        <main>
          <InteractiveCanvas />
        </main>
        <ChatbotDrawer />
      </div>
    </ConnectionProvider>
  );
};

export default App;
