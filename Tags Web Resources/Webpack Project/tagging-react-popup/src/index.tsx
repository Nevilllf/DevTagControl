import * as React from "react";
import * as ReactDOM from "react-dom/client";
import BulkTagPopup from "./BulkTagPopup";

document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.getElementById("tag-root");
  if (!rootEl) {
    console.error("tag-root element not found");
    return;
  }

  const root = ReactDOM.createRoot(rootEl);
  root.render(<BulkTagPopup />);
});
