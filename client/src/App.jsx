import { Analytics } from "@vercel/analytics/react";
import AppRoutes from "./routes/AppRoutes";
import useSocketEvents from "./hooks/useSocketEvents";

function App() {
  useSocketEvents();

  return (
    <>
      <AppRoutes />
      <Analytics />
    </>
  );
}

export default App;
