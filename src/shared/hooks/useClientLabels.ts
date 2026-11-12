import { useTerminology } from "../../core/terminology/hooks/useTerminology";
import { useTranslation } from "react-i18next";

export function useClientLabels() {
  const { getLabel} = useTerminology();
  const { t } = useTranslation(["clients", "common"]);

  const entity = getLabel("client");
  const entities = getLabel("client", true);

  return {
    entity: entity,
    title: t("title", {entity: entities}),
    description: t("description", {entity: entities}),
    add: t("add", {entity}),
    search: t("search", {entity: entities}),
    empty: t("empty", {entity: entities}),
    previous: t("previous"),
    next: t("next"),
    profile: entity,
    
    //Forms
    id: t("common:id"),
    type_id: t("common:type_id"),
    age: t("common:age"),
    age_one: t("common:age_one"),
    age_other: t("common:age_other"),
    emailColumn: t("common:email"),
    phoneColumn: t("common:phone"),
    email: t("common:email"),
    email_long: t("common:email_long"),
    phone: t("common:phone"),
    address: t("common:address"),
    deparment: t("common:deparment"),
    city: t("common:city"),
    birth_date: t("common:birth_date"),
    gender: t("common:gender"),
    drop_your_image_here: t("common:drop_your_image_here", {entity: entity}),
    entity_name: t("entity_name", {entity: entity}),
    entity_last_name: t("entity_last_name", {entity: entity}),
    entity_profile: t("entity_profile", {entity: entity}),
    entity_id: t("entity_id", {entity: entity}),

    //Actions
    edit: t("common:edit"),
    save: t("common:save"),
    saving: t("common:saving"),
    cancel: t("common:cancel"),
    new_entity: t("common:new_entity", {entity: entity}),
    edit_entity: t("common:new_entity", {entity: entity}),

    //Validations
    entity_id_required: t("common:entity_id_required", {entity: entity}),
    entity_name_required: t("common:entity_name_required", {entity: entity}),
    entity_last_name_required: t("common:entity_last_name_required", {entity: entity}),
    entity_gender_required: t("common:entity_gender_required", {entity: entity}),
    entity_birth_date_required: t("common:entity_birth_date_required"),
    invalid_phone: t("common:invalid_phone"),
    invalid_email: t("common:invalid_email"),

    //Messages
    entity_updated_successfully: t("common:entity_updated_successfully", {entity: entity}),
    entity_created_successfully: t("common:entity_updated_successfully", {entity: entity}),
    additional_contact_information: t("common:additional_contact_information"),
    personal_information: t("common:personal_information"),
    upload_photo: t("common:upload_photo"),
    image_information: t("common:image_information"),
  };
}