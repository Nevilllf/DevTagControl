const choiceToEntityMap: Record<number, string> = {
  0: "account",
  1: "contact",
  2: "evergrn_case",
  3: "appointment",
  4: "activitypointer",
  5: "transactioncurrency",
  6: "email",
  7: "mailbox",
  8: "phonecall",
  9: "queue",
  10: "task",
  11: "team",
  12: "systemuser",
  13: "evergrn_approvalsteps",
  14: "evergrn_approvaltemplate",
  15: "evergrn_approvaltemplatesteps",
  16: "evergrn_calendar",
  17: "evergrn_case_contact",
  18: "evergrn_casecategory",
  19: "evergrn_casepriority",
  20: "evergrn_caseresolution",
  21: "evergrn_caseseverity",
  22: "evergrn_casesource",
  23: "evergrn_casesubstatus",
  24: "evergrn_domain",
  25: "evergrn_emailtemplatelookup",
  26: "evergrn_follow",
  27: "evergrn_holiday",
  28: "evergrn_item",
  29: "evergrn_itemcategory",
  30: "evergrn_itemkit",
  31: "evergrn_itemvendor",
  32: "evergrn_knowledgearticle",
  33: "evergrn_knowledgearticle_evergr",
  34: "evergrn_knowledgearticleattachm",
  35: "evergrn_knowledgearticletemplat",
  36: "evergrn_knowledgecategory",
  37: "evergrn_notificationconfig",
  38: "evergrn_notificationdynamicsub",
  39: "evergrn_notificationstatus",
  40: "evergrn_notificationstatustrans",
  41: "evergrn_notificationsub",
  42: "evergrn_notificationtrigger",
  43: "evergrn_paymentterms",
  44: "evergrn_pricelist",
  45: "evergrn_pricelistproduct",
  46: "evergrn_product",
  47: "evergrn_service",
  48: "evergrn_servicecategory",
  49: "evergrn_servicevendor",
  50: "evergrn_skill",
  51: "evergrn_skillcategory",
  52: "evergrn_skilllevel",
  53: "evergrn_skillvendor",
  54: "evergrn_spamemailtracking",
  55: "evergrn_survey",
  56: "evergrn_surveycategory",
  57: "evergrn_surveydefinition",
  58: "evergrn_surveydefinitionversion",
  59: "evergrn_surveyquestion",
  60: "evergrn_surveyresponse",
  61: "evergrn_systemconfig",
  62: "evergrn_tagdefinition",
  63: "evergrn_tagsettings",
  64: "evergrn_taxexemption",
  65: "evergrn_taxrate",
  66: "evergrn_taxrateadjustment",
  67: "evergrn_taxrateassociation",
  68: "evergrn_unitofmeasure",
  69: "evergrn_workschedule"
};

export async function isTagCreationAllowed(
  currentEntityLogicalName: string
): Promise<boolean> {
  try {
    const matchingChoiceEntry = Object.entries(choiceToEntityMap).find(
      ([choiceValue, logicalName]) => logicalName === currentEntityLogicalName
    );

    if (!matchingChoiceEntry) {
      console.warn(
        "Entity not mapped in choiceToEntityMap:",
        currentEntityLogicalName
      );
      return true;
    }

    const [choiceValue] = matchingChoiceEntry;

    const result = await Xrm.WebApi.retrieveMultipleRecords(
      "evergrn_tagsettings",
      `?$filter=evergrn_entityname eq ${choiceValue}`
    );

    if (result.entities.length > 0) {
      const rawValue = result.entities[0].evergrn_allowtagcreation;
      return rawValue == 1;
    }

    return true;
  } catch (error) {
    console.error("Error checking tag creation setting:", error);
    return true;
  }
}
