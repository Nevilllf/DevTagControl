/**
 * TODO
 */
export interface TagDefinition {
  tagdefinitionid: string;
  new_name: string;
}

/**
 * Fetch all TagDefinitions from Dataverse.
 * Only returns active tags
 */
export async function fetchAllTags(): Promise<string[]> {
  try {
    const result = await Xrm.WebApi.retrieveMultipleRecords(
      "new_tagdefinition",
      "?$select=new_name"
    );

    const tags: string[] = result.entities
      .map((record: TagDefinition) => record.new_name?.trim())
      .filter((tag): tag is string => !!tag);

    return [...new Set(tags)]; // Deduplicate
  } catch (error) {
    console.error("Failed to fetch TagDefinitions:", error);
    return [];
  }
}
