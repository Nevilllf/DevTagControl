/**
 * Creates a new TagDefinition record in Dataverse if it doesn't exist.
 * Returns the existing or newly created tag name, or null on error.
 */
export async function createNewTag(name: string): Promise<string | null> {
  try {
    const trimmedName = name.trim();
    const encodedName = trimmedName.replace(/'/g, "''"); // Escape single quotes for OData

    // Use contains to check for exact match
    const filter = `startswith(new_name, '${encodedName}') or endswith(new_name, '${encodedName}') or new_name eq '${encodedName}'`;

    const result = await Xrm.WebApi.retrieveMultipleRecords(
      "new_tagdefinition",
      `?$select=new_name&$filter=${filter}`
    );

    const match = result.entities.find(
      (tag) => tag.new_name?.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (match?.new_name) {
      return match.new_name.trim();
    }

    // No match, create new tag
    const createResult = await Xrm.WebApi.createRecord("new_tagdefinition", {
      new_name: trimmedName,
    });

    return trimmedName;
  } catch (error) {
    console.error("Failed to create new tag:", error);
    return null;
  }
}
