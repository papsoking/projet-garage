// import AppRoute from "./routes/routes";

import Navbar from "./components/navbar";
import AppRoute from "./Routes/routes";
import "./App.css";

export default function App() {
  return (
    <div>
      <Navbar />
      <div className="container py-4 py-lg-5">
        {/* Contenu des routes */}
        <AppRoute />
      </div>
    </div>

  );
}
