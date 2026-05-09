/* @refresh reload */
import { render } from "solid-js/web";
import "./index.css";
// import App from "./app.before.tsx";
import App from "./app.after.tsx";

const root = document.getElementById("root");

render(() => <App />, root!);
