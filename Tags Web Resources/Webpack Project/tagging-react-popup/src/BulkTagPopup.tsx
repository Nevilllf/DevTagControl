import * as React from "react";
import {
  FluentProvider,
  webLightTheme,
  makeStyles,
  Button,
  Text,
} from "@fluentui/react-components";
import FluentTagInput from "./FluentTagInput";
import { fetchAllTags } from "./services/tagDefinitionService";
import { createNewTag } from "./services/tagCreationService";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    boxSizing: "border-box",
    height: "94vh",
  },
  header: {
    marginBottom: "1rem",
  },
  buttonRow: {
    marginTop: "auto",
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.5rem",
  },
});

const formatTag = (tag: string) => tag.charAt(0).toUpperCase() + tag.slice(1);

const BulkTagPopup: React.FC = () => {
  const styles = useStyles();
  const [availableTags, setAvailableTags] = React.useState<string[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const selectedIds: string[] = React.useMemo(() => {
    return JSON.parse(sessionStorage.getItem("tagging_selectedIds") || "[]");
  }, []);

  const mode: "add" | "remove" | "clear" = React.useMemo(() => {
    try {
      const stored = sessionStorage.getItem("tagging_mode");
      return stored?.toLowerCase() === "remove"
        ? "remove"
        : stored?.toLowerCase() === "clear"
        ? "clear"
        : "add";
    } catch {
      return "add";
    }
  }, []);

  const entityName: string = React.useMemo(() => {
    return sessionStorage.getItem("tagging_entityName") || "evergrn_case";
  }, []);

  React.useEffect(() => {
    if (mode !== "clear") {
      fetchAllTags()
        .then((tags) => setAvailableTags(tags.map(formatTag)))
        .catch((err) => console.error("Error fetching tags:", err));
    }
  }, [mode]);

  const normalizeAndCreateTags = async (input: string): Promise<string[]> => {
    const tagCandidates = input
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const finalTags: string[] = [];

    for (const tag of tagCandidates) {
      const formatted = formatTag(tag);
      const existing = availableTags.find(
        (t) => t.toLowerCase() === formatted.toLowerCase()
      );
      if (existing) {
        finalTags.push(existing);
      } else {
        const newTag = await createNewTag(formatted);
        if (newTag) {
          finalTags.push(newTag);
          setAvailableTags((prev) => [...prev, newTag]);
        }
      }
    }

    return [...new Set(finalTags)].sort((a, b) => a.localeCompare(b));
  };

  const handleSubmitTags = async () => {
    for (const id of selectedIds) {
      try {
        let updatedTags: string;

        if (mode === "clear") {
          updatedTags = "";
        } else {
          const record = await Xrm.WebApi.retrieveRecord(
            entityName,
            id,
            "?$select=evergrn_tags"
          );

          const currentTags = (record.evergrn_tags ?? "")
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean);

          if (mode === "add") {
            updatedTags = [...new Set([...currentTags, ...selectedTags])]
              .sort((a, b) => a.localeCompare(b))
              .join(",");
          } else {
            updatedTags = currentTags
              .filter((t: string) => !selectedTags.includes(t))
              .sort((a: string, b: string) => a.localeCompare(b))
              .join(",");
          }
        }

        await Xrm.WebApi.updateRecord(entityName, id, {
          evergrn_tags: updatedTags,
        });
      } catch (err) {
        console.warn(`Skipped record ${id}`, err);
      }
    }

    if (
      typeof Xrm !== "undefined" &&
      Xrm.Utility?.refreshParentGrid &&
      selectedIds.length > 0
    ) {
      Xrm.Utility.refreshParentGrid({
        entityType: entityName,
        id: selectedIds[0],
        name: "",
      });
    }

    window.close();
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>
        <Text size={400} weight="semibold" className={styles.header}>
          {mode === "add"
            ? "Select or enter tags to add:"
            : mode === "remove"
            ? "Select tags to remove:"
            : "Are you sure you want to clear all tags from the selected records? This action cannot be undone."}
        </Text>

        {mode !== "clear" && (
          <FluentTagInput
            value=""
            onChange={async (val) => {
              const resolved = await normalizeAndCreateTags(val);
              setSelectedTags(resolved);
            }}
            overrideOptions={availableTags}
          />
        )}

        <div className={styles.buttonRow}>
          <Button appearance="primary" onClick={handleSubmitTags}>
            {mode === "add" ? "Add" : mode === "remove" ? "Remove" : "Clear"}
          </Button>
          
          <Button appearance="secondary" onClick={() => window.close()}>
            Cancel
          </Button>
          
        </div>
      </div>
    </FluentProvider>
  );
};

export default BulkTagPopup;
