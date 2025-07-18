# React Tagging Popup for Power Apps

This project adds a modern **React + TypeScript** popup inside a **Model-Driven Power App** to allow users to perform bulk tagging of selected records.

Since Power Apps Web Resources only support HTML and JavaScript files, we use **Webpack** to compile and inject the React app into a self-contained HTML file that Power Apps can load in a dialog.

---

## Getting Started

### 1. Installation

install the dependencies:

```bash
npm install
```

### 2. Build

Use the following command to build the popup inside Webpack Project\tagging-react-popup

```bash
npx webpack
```

This creates the following in the `dist/` folder:

- `tagging_popup_loader.js`: your compiled React app.
- `tagging_popup.html`: basic HTML shell that loads the React app.

### 3. Deployment to Power Apps

Upload both files as Web Resources in Power Apps:

- `tagging_popup_loader.js`
- `tagging_popup.html`

Then open the popup using:

```javascript
Xrm.Navigation.openWebResource("tagging_popup.html", options);
```

You can trigger this from a ribbon button, command bar, or JavaScript logic.

---

## Build and Test

- Webpack is configured via `webpack.config.js`
- React app entry point is `src/index.tsx`
- Business logic and services are inside `src/services/`

---

## Contribute

To contribute or make changes:

1. Modify components in `src/` (e.g., `BulkTagPopup.tsx`, `FluentTagInput.tsx`)
2. Run `npx webpack` to rebuild
3. Re-upload updated Web Resources to Power Apps

---

## Notes for Future Developers

- Power Apps doesn't support React or modules directly. This setup compiles everything into a **plain JavaScript loader** + HTML shell that Power Apps can consume.
- Don't rename the output files unless you update Power Apps Web Resource references accordingly.

---

## Learn More
- [WebPack TypeScript Documentation](https://webpack.js.org/guides/typescript/)
- [React Documentation](https://reactjs.org/)
- [Fluent UI](https://react.fluentui.dev/)
- [Power Apps Web Resources Guide](https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/web-resources)
