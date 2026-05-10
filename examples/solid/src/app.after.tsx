import { createSignal } from "solid-js";
import solidLogo from "./assets/solid.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  const [count, setCount] = createSignal(0);

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
          {/* @alt solid logo */}
          <img src={solidLogo} />

          {/* @class vite */}
          {/* @alt vite logo */}
          <img src={viteLogo} />
        </div>

        <div>
          <h1>get started</h1>
          <p>
            edit <code>src/app.tsx</code> and save to test <code>hmr</code>
          </p>
        </div>

        {/* @class counter */}
        <button type="button" onClick={() => setCount((count) => count + 1)}>
          count is {count()}
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

          <h2>documentation</h2>
          <p>your questions, answered</p>

          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                {/* @alt */}
                {/* @class logo */}
                <img src={viteLogo} />
                explore vite
              </a>
            </li>

            <li>
              <a href="https://solidjs.com/" target="_blank">
                {/* @class button-icon */}
                {/* @alt */}
                <img src={solidLogo} />
                learn more
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

          <h2>connect with us</h2>
          <p>join the vite community</p>

          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                {/* @class button-icon */}
                <svg role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                github
              </a>
            </li>

            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                {/* @class button-icon */}
                <svg role="presentation" aria-hidden="true">
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                discord
              </a>
            </li>

            <li>
              <a href="https://x.com/vite_js" target="_blank">
                {/* @class button-icon */}
                <svg role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                x.com
              </a>
            </li>

            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                {/* @class button-icon */}
                <svg role="presentation" aria-hidden="true">
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                bluesky
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
