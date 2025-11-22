// src/App.tsx
import { SessionKeyProvider } from "./providers/SessionKeyProvider";
import { MessagingClientProvider } from "./providers/MessagingClientProvider";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <SessionKeyProvider>
      <MessagingClientProvider>
        <LandingPage />
      </MessagingClientProvider>
    </SessionKeyProvider>
  );
}

export default App;
