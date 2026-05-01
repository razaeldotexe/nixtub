import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { App } from "./src/App";

const renderer = await createCliRenderer();
const root = createRoot(renderer);
root.render(<App />);
