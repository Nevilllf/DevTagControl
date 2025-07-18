var Tagging = Tagging || {};

/**
 * Opens the Tagging Popup for any entity
 * @param {string[]} selectedIds - Array of selected record IDs
 * @param {"add" | "remove"} mode - Operation mode ("add" or "remove")
 * @param {string} entityLogicalName - Logical name of the entity (e.g., "account")
 */
Tagging.openTaggingPopup = function (selectedIds, mode = "add", entityLogicalName = "evergrn_case") {
  try {
    sessionStorage.setItem("tagging_selectedIds", JSON.stringify(selectedIds));
    sessionStorage.setItem("tagging_mode", mode);
    sessionStorage.setItem("tagging_entityName", entityLogicalName);

    const pageInput = {
      pageType: "webresource",
      webresourceName: "evergrn_tagging_popup", 
      data: JSON.stringify({
        selectedIds: selectedIds,
        mode: mode,
        entityLogicalName: entityLogicalName,
      }),
    };

    const navigationOptions = {
      target: 2, // Open as dialog
      width: { value: 600, unit: "px" },
      height: { value: 400, unit: "px" },
      position: 1,
    };

    Xrm.Navigation.navigateTo(pageInput, navigationOptions);
  } catch (e) {
    console.error("Error opening tagging popup:", e);
  }
};
