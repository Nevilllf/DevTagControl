/**
 * Creates a new TagDefinition record in Dataverse if it doesn't exist.
 * Returns the existing or newly created tag name, or null on error.
 */
export async function createNewTag(name: string): Promise<string | null> {
  try {
    const trimmedName = name.trim();
    const encodedName = trimmedName.replace(/'/g, "''"); // Escape single quotes for OData

    // Use contains to check for exact match
    const filter = `startswith(evergrn_name, '${encodedName}') or endswith(evergrn_name, '${encodedName}') or evergrn_name eq '${encodedName}'`;

    const result = await Xrm.WebApi.retrieveMultipleRecords(
      "evergrn_tagdefinition",
      `?$select=evergrn_name&$filter=${filter}`
    );

    const match = result.entities.find(
      (tag) => tag.evergrn_name?.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (match?.evergrn_name) {
      return match.evergrn_name.trim();
    }

    // No match, create new tag
    const createResult = await Xrm.WebApi.createRecord("evergrn_tagdefinition", {
      evergrn_name: trimmedName,
    });

    return trimmedName;
  } catch (error) {
    console.error("Failed to create new tag:", error);
    return null;
  }
}
