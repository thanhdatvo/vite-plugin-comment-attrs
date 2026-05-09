import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* @id center */}
      <section>
        {/* @class hero */}
        <div>
          {/* @class base */}
          {/* @alt */}
          <img src={heroImg} width="170" height="179" />

          {/* @class framework */}
          {/* @alt React logo */}
          <img src={reactLogo} />

          {/* @class vite */}
          {/* @alt Vite logo */}
          <img src={viteLogo} />
        </div>

        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>

        {/* @class counter */}
        <button type="button" onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
      </section>

      {/* @class ticks */}
      <div></div>

      {/* @id next-steps */}
      <section>
        {/* @id docs */}
        <div>
          {/* @class icon */}
          <svg role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>

          <h2>Documentation</h2>
          <p>Your questions, answered</p>

          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                {/* @alt */}
                {/* @class logo */}
                <img src={viteLogo} />
                Explore Vite
              </a>
            </li>

            <li>
              <a href="https://react.dev/" target="_blank">
                {/* @alt */}
                {/* @class button-icon */}
                <img src={reactLogo} />
                Learn more
              </a>
            </li>
          </ul>
        </div>

        {/* @id social */}
        <div>
          {/* @class icon */}
          <svg role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>

          <h2>Connect with us</h2>
          <p>Join the Vite community</p>

          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                {/* @class button-icon */}
                <svg role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>

            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                {/* @class button-icon */}
                <svg role="presentation" aria-hidden="true">
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>

            <li>
              <a href="https://x.com/vite_js" target="_blank">
                {/* @class button-icon */}
                <svg role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>

            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                {/* @class button-icon */}
                <svg role="presentation" aria-hidden="true">
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* @class ticks */}
      <div></div>

      {/* @id spacer */}
      <section></section>
    </>
  );
}

export default App;
