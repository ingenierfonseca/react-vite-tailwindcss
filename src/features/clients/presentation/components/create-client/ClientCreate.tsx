import { useState } from "react";
import type { ClientFormRenderProps } from "../../types";
import type { Client } from "@/features/clients/domain/client";
import { ClientCreateActions } from "./components/ClientCreateActions";
import { ClientPersonalInformation } from "./components/ClientPersonalInformation";
import { ClientCreateStepper } from "./components/ClientCreateStepper";
import ClientLocationInformation from "./components/ClientLocationInformation";
import { Info } from "lucide-react";
import PageRightComponent from "@/components/commons/PageRightComponent";

export default function ClientCreate(
  props: ClientFormRenderProps<Client>
) {
  const {
    client,
    saving,
    canSave,
    error,
    onChange,
    onSubmit,
    onCancel,
    labels,
    geography,
  } = props;

  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSubmit = () => {
    void onSubmit(selectedImage);
  };

  return (
    <PageRightComponent
      title={
        client.id
          ? labels.edit_entity
          : labels.new_entity
      }
      onClose={onCancel}
    >

      <fieldset disabled={saving}>
        <ClientCreateStepper
          step={step}
          onChange={setStep}
          labels={labels}
        />

        <div hidden={step !== 1}>
          <ClientPersonalInformation
            client={client}
            saving={saving}
            labels={labels}
            selectedImage={selectedImage}
            onChange={onChange}
            onImageChange={setSelectedImage}
            geography={geography}
          />
        </div>

        {step === 2 && (
          <ClientLocationInformation
            client={client}
            mode="edit"
            onChange={onChange}
            labels={labels}
          />
        )}
      </fieldset>

      {error && (
        <div className="flex gap-2 mt-4 bg-red-100 py-2 px-6 rounded-lg text-red-600">
          <Info />
          <p role="alert" className="text-black">
            {error}
          </p>
        </div>
      )}

      <ClientCreateActions
        saving={saving}
        canSave={canSave || selectedImage !== null}
        labels={labels}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />

    </PageRightComponent>
  );
}
