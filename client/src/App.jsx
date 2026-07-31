import AppRoutes from "./routes/AppRoutes";
import useSocketEvents from "./hooks/useSocketEvents";

function App() {
  useSocketEvents();

  return <AppRoutes />;
}

export default App;
