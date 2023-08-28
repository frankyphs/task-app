// import React from "react";
import { initializeIcons } from "@fluentui/font-icons-mdl2";

import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
initializeIcons();

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
