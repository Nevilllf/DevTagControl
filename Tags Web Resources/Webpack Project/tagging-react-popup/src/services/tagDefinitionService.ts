export interface TagDefinition {
  tagdefinitionid: string;
  evergrn_name: string;
}

async function waitForXrm(timeout = 5000): Promise<void> {
  const start = Date.now();
  while (typeof Xrm === "undefined") {
    if (Date.now() - start > timeout) throw new Error("Xrm not available");
    await new Promise((r) => setTimeout(r, 100));
  }
}

export async function fetchAllTags(): Promise<string[]> {
  await waitForXrm();

  if (typeof Xrm === "undefined" || typeof Xrm.WebApi === "undefined") {
    console.error("Xrm or Xrm.WebApi not available");
    return [];
  }

  try {
    const result = await Xrm.WebApi.retrieveMultipleRecords(
      "evergrn_tagdefinition",
      "?$select=evergrn_name"
    );

    const tags: string[] = result.entities
      .map((record: TagDefinition) => record.evergrn_name?.trim())
      .filter((tag): tag is string => !!tag);

    return [...new Set(tags)];
  } catch (error) {
    console.error("Failed to fetch TagDefinitions:", error);
    return [];
  }
}
