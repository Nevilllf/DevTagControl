# Tags PCF Control for Model Driven Apps

This PCF control adds a modern, Fluent UI–based tag picker to model-driven forms in EvergreenWorx applications. It enables flexible tagging of records using comma-delimited text fields, auto-suggestions, and inline tag management.

---

## Overview

This project implements the **EvergreenWorx Base Layer Tagging Feature**, enabling tagging functionality across supported entities in EvergreenWorx products. The goal is to allow users to assign, create, and remove tags directly on forms using a user-friendly interface.

Key features include:

- Free-text entry with auto-suggestions from existing `TagDefinition` records.
- New tags can be created by pressing Enter or Tab.
- Fluent UI `TagPicker` component for modern UI.
- Tags rendered inline, with "x" icon for removal.
- Tags stored in a comma-delimited text field, sorted alphanumerically.
- Tag creation rules enforced using `TagSettings`.

---

## File Structure

```
Tags/
├── generated/
├── services/
│   ├── tagCreationService.ts
│   ├── tagDefinitionService.ts
│   └── tagSettingsService.ts
├── styles/
│   ├── Styles.ts
├── FluentTagInput.tsx
├── ControlManifest.Input.xml
├── index.ts
├── Tags Web Resources/ (bulk tasks scripts, not related to this pcf)
├── package.json
├── tsconfig.json
├── pcfconfig.json
├── Tags PCF.pcfproj
└── tsconfig.json
```

---

## Setup and Build

### 1. Installation

Make sure you have [Node.js](https://nodejs.org/) and [Power Platform CLI](https://learn.microsoft.com/en-us/power-apps/developer/cli/introduction) installed.

```bash
npm install
```

### 2. Build the PCF Control

```bash
npm run build
```

### 3. Build the Dataverse Solution

```bash
msbuild /t:build /restore /p:configuration=Release             
```


---

## Fluent UI Integration

This control uses Fluent UI’s `TagPicker` component from Fluent UI v9. It supports:

- Tag suggestions with avatars and truncation
- Keyboard navigation and accessibility
- Inline tag display and removal

More examples: [Fluent UI TagPicker](https://react.fluentui.dev/?path=/docs/components-tagpicker--docs)

---

## Data Model

### TagDefinition
Defines all tags available in the system.

| Field           | Type     | Description               |
|----------------|----------|---------------------------|
| TagDefinitionId| GUID     | Primary Key               |
| Name           | Text     | The tag value             |
| CreatedOn      | DateTime | Tag creation timestamp    |

### TagSettings
Controls whether new tag creation is allowed per entity.

| Field           | Type      | Description                         |
|----------------|-----------|-------------------------------------|
| TagSettingsId  | GUID      | Primary Key                         |
| EntityName     | OptionSet | Entity name (nullable = default)    |
| AllowTagCreation| Boolean  | If new tags can be created          |

---

## Developer Notes

- Tags are case-insensitive and duplicates are disallowed in `TagDefinition`.
- Tag suggestions are loaded from `TagDefinitionService`.
- Tag creation uses `tagCreationService.ts` if allowed by `TagSettingsService`.

---

## Related Features

This PCF control supports the EvergreenWorx tagging specification.

- Bulk operations planned: tag, untag, clear (Look at Tags Web Resources folder for better understanding)
- A read-only grid cell renderer for tags on Entity Views (Look at RecordImageCellRenderer for better understanding)
- Filtering on tags in views supported

---

## Resources

- [PCF Gallery](https://pcf.gallery/)
- [Fluent UI](https://react.fluentui.dev/?path=/docs/components-tagpicker--docs)
- [Power Apps Component Framework Docs](https://learn.microsoft.com/en-us/power-apps/developer/component-framework/overview)
