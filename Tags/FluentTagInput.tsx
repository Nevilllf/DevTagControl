import * as React from "react";
import {
  TagPicker,
  TagPickerList,
  TagPickerInput,
  TagPickerControl,
  TagPickerProps,
  TagPickerOption,
  TagPickerGroup,
  useTagPickerFilter,
  FluentProvider,
  webLightTheme,
  Tag,
  Avatar,
} from "@fluentui/react-components";

import { fetchAllTags } from "./services/tagDefinitionService";
import { createNewTag } from "./services/tagCreationService";
import { isTagCreationAllowed } from "./services/tagSettingsService";
import { useStyles } from "./styles/Styles";

/**
 * Props for FluentTagInput component
 * `value` is a comma-separated string of tags
 * `onChange` is called when selected tags change
 */
interface FluentTagInputProps {
  value: string;
  entityName: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * FluentTagInput is a custom tag selector using Fluent UI v9 components.
 * It supports:
 * - Live filtering
 * - Tag creation on Enter
 * - Styled display with avatars
 */
const FluentTagInput: React.FC<FluentTagInputProps> = ({
  value,
  entityName,
  onChange,
  disabled = false,
}) => {
  const [query, setQuery] = React.useState<string>("");
  const [options, setOptions] = React.useState<string[]>([]);
  const [allowTagCreation, setAllowTagCreation] = React.useState<boolean>();
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>(
    value ? value.split(",").filter(Boolean) : []
  );
  const styles = useStyles();

  /**
   *
   */
  React.useEffect(() => {
    //console.log("DEBUG TAG INPUT USE EFFECT: entityname: ", entityName);
    if (entityName) {
      isTagCreationAllowed(entityName)
        .then((allowed) => {
          //console.log("allowTagCreation resolved:", allowed);
          setAllowTagCreation(allowed);
          return;
        })
        .catch(() => {
          setAllowTagCreation(false);
          console.warn("Failed to fetch tag creation setting");
        });
    }
  }, [entityName]);

  /**
   * Fetch tag options on initial mount
   */
  React.useEffect(() => {
    fetchAllTags()
      .then(setOptions)
      .catch((error) => {
        console.error("Failed to load tags:", error);
      });
  }, []);

  /**
   * Handles selecting an existing tag from the dropdown
   */
  const onOptionSelect: TagPickerProps["onOptionSelect"] = (e, data) => {
    if (data.value === "no-matches") return;

    setSelectedOptions(data.selectedOptions);
    setQuery("");
    onChange(data.selectedOptions.join(","));
  };

  /**
   * Handles Enter key for creating/selecting tags
   */
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();

      let trimmedQuery = query.trim();

      // Prevent very short tags
      if (trimmedQuery.length < 2) {
        console.warn("Tag too short");
        return;
      }

      // Capitalize first letter
      trimmedQuery =
        trimmedQuery.charAt(0).toUpperCase() + trimmedQuery.slice(1);

      const normalizedQuery = trimmedQuery.toLowerCase();

      // 1. Check if tag is already selected
      const alreadySelected = selectedOptions.some(
        (tag) => tag.toLowerCase() === normalizedQuery
      );
      if (alreadySelected) {
        //console.log("Tag already selected");
        setQuery("");
        return;
      }

      // 2. Check if tag already exists in options
      const existingTag = options.find(
        (tag) => tag.toLowerCase() === normalizedQuery
      );
      if (existingTag) {
        const updated = [...selectedOptions, existingTag].sort((a, b) =>
          a.localeCompare(b)
        );
        setSelectedOptions(updated);
        onChange(updated.join(","));
        setQuery("");
        return;
      }

      // 3. Else, create a new tag, only if allowed in tag settings
      if (allowTagCreation === undefined) {
        console.warn("TAG Creation: Still loading tag setting...");
        return;
      }
      if (!allowTagCreation) {
        console.warn("TAG Creation: Tag creation not allowed.");
        return;
      }
      const newTag = await createNewTag(trimmedQuery);
      if (newTag) {
        const updated = [...selectedOptions, newTag].sort((a, b) =>
          a.localeCompare(b)
        );
        setSelectedOptions(updated);
        setOptions((prev) => [...prev, newTag]);
        onChange(updated.join(","));
        setQuery("");
      }
    }
  };

  /**
   * Filters dropdown options and renders matching ones
   */
  const children = useTagPickerFilter({
    query,
    options,
    noOptionsElement: (
      <TagPickerOption value="no-matches">No matches found</TagPickerOption>
    ),
    renderOption: (option) => (
      <TagPickerOption
        key={option}
        value={option}
        text={option}
        media={<Avatar name={option} color="colorful" shape="square" />}
        title={option}
      >
        <div className={styles.optionText}>{option}</div>
      </TagPickerOption>
    ),
    filter: (option) =>
      !selectedOptions.includes(option) &&
      option.toLowerCase().includes(query.toLowerCase()),
  });

  /**
   * Full Tag Picker UI with:
   * - Selected tags
   * - Input field
   * - Filtered list
   */
  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.wrapper}>
        <TagPicker
          onOptionSelect={onOptionSelect}
          selectedOptions={selectedOptions}
          positioning={{
            position: 'below',     
            align: 'start',        
            strategy: 'absolute'   
          }}
          disabled={disabled}
        >
          <TagPickerControl className={styles.tagPickerControl}>
            <TagPickerGroup aria-label="Selected Tags">
              {selectedOptions.map((option) => (
                <Tag
                  key={option}
                  value={option}
                  shape="rounded"
                  media={<Avatar name={option} color="colorful" />}
                  title={option}
                  primaryText={{ className: styles.tagTruncated }}
                >
                  {option}
                </Tag>
              ))}
            </TagPickerGroup>
            <TagPickerInput
              aria-label="Select Tags"
              value={query}
              disabled={disabled} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              onKeyDown={handleKeyDown}
              style={{ flex: "1 1 auto", minWidth: "120px" }} // allow shrinking
            />
          </TagPickerControl>
          <TagPickerList style={{ maxHeight: 200, overflowY: "auto" }}>
            {children}
          </TagPickerList>
        </TagPicker>
      </div>
    </FluentProvider>
  );
};

export default FluentTagInput;
