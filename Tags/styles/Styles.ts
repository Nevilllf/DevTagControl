import { makeStyles, shorthands } from '@fluentui/react-components';

export const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "100%", // shrink with parent
    boxSizing: "border-box",
    overflow: "visible",
    zIndex: 1000,
    position: "relative",
  },
  tagPickerControl: {
    display: "flex",
    flexWrap: "wrap", //allow tags + input to wrap
    alignItems: "center",
    gap: "4px",
    width: "100%",
    ...shorthands.padding("4px"),
    boxSizing: "border-box",
  },
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
