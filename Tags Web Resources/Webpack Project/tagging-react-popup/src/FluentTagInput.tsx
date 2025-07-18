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
  makeStyles,
  Tag,
  Avatar,
} from "@fluentui/react-components";
import { fetchAllTags } from "./services/tagDefinitionService";
import { isTagCreationAllowed } from "./services/tagSettingsService";

interface FluentTagInputProps {
  value: string;
  onChange: (value: string) => void;
  overrideOptions?: string[];
}

const useStyles = makeStyles({
  tagTruncated: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "100px",
  },
  optionText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  },
});

const formatTag = (tag: string) =>
  tag.charAt(0).toUpperCase() + tag.slice(1);

const FluentTagInput: React.FC<FluentTagInputProps> = ({
  value,
  onChange,
  overrideOptions,
}) => {
  const styles = useStyles();
  const [query, setQuery] = React.useState<string>("");
  const [options, setOptions] = React.useState<string[]>([]);
  const [allowTagCreation, setAllowTagCreation] = React.useState<boolean>();
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>(
    value
      ? value
          .split(",")
          .filter(Boolean)
          .map((t) => formatTag(t))
      : []
  );

  React.useEffect(() => {
    const storedEntity = sessionStorage.getItem("tagging_entityName");

    if (storedEntity) {
      isTagCreationAllowed(storedEntity)
        .then((allowed) => {
          setAllowTagCreation(allowed);
        })
        .catch(() => {
          console.warn("Failed to fetch tag creation permission in popup");
          setAllowTagCreation(false);
        });
    }
  }, []);

  React.useEffect(() => {
    if (overrideOptions) {
      const formatted = overrideOptions.map(formatTag);
      setOptions(formatted);
    } else {
      fetchAllTags()
        .then((tags) => setOptions(tags.map(formatTag)))
        .catch(console.error);
    }
  }, [overrideOptions]);

  const onOptionSelect: TagPickerProps["onOptionSelect"] = (e, data) => {
    if (data.value === "no-matches") return;

    const formattedOptions = data.selectedOptions.map(formatTag);
    setSelectedOptions(formattedOptions);
    setQuery("");
    onChange(formattedOptions.join(","));
  };

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

  return (
    <FluentProvider theme={webLightTheme}>
      <TagPicker
        onOptionSelect={onOptionSelect}
        selectedOptions={selectedOptions}
        positioning="below-start"
        disabled={false}
      >
        <TagPickerControl>
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                const rawInput = query.trim();
                const formattedInput = formatTag(rawInput);

                const existingMatch = options.find(
                  (opt) => opt.toLowerCase() === formattedInput.toLowerCase()
                );

                const normalizedTag = existingMatch ?? formattedInput;

                if (
                  selectedOptions.find(
                    (opt) =>
                      opt.toLowerCase() === normalizedTag.toLowerCase()
                  )
                ) {
                  setQuery("");
                  return;
                }

                if (allowTagCreation === undefined) {
                  console.warn("TAG Creation: Still loading tag setting...");
                  return;
                }
                if (!allowTagCreation) {
                  console.warn("TAG Creation: Tag creation not allowed.");
                  return;
                }

                const newTags = [...selectedOptions, normalizedTag];
                setSelectedOptions(newTags);
                onChange(newTags.join(","));
                setQuery("");
              }
            }}
          />
        </TagPickerControl>
        <TagPickerList style={{ maxHeight: 200, overflowY: "auto" }}>
          {children}
        </TagPickerList>
      </TagPicker>
    </FluentProvider>
  );
};

export default FluentTagInput;
