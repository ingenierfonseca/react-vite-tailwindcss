import type { Client } from "@/features/clients/domain/client";
import type { ClientLabels } from "@/features/clients/presentation/types";
import LocationPickerMap, { type LocationSelection } from "./LocationPickerMap";

type ClientLocationInformationProps = {
  client: Client;
  labels: ClientLabels;
} & (
  | {
      mode: "edit";
      onChange: (patch: Partial<Client>) => void;
    }
  | {
      mode: "readOnly";
      onChange?: never;
    }
);

function locationPatch(location: LocationSelection): Partial<Client> {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    locationAccuracyMeters: location.accuracyMeters,
    locationSource: location.source,
    locationDataProvided: true,
  };
}

export default function ClientLocationInformation(props: ClientLocationInformationProps) {
  const { client, labels, mode } = props;
  const hasCoordinates = client.latitude != null && client.longitude != null;
  const hasLocationDetails = Boolean(
    client.departmentName?.trim() || client.cityName?.trim() || client.address?.trim(),
  );

  return (
    <section className="mt-6 space-y-4">
      {mode === "readOnly" && hasLocationDetails && (
        <dl className="grid gap-3 sm:grid-cols-3">
          {client.departmentName && (
            <div>
              <dt className="text-xs font-medium text-slate-500">{labels.department}</dt>
              <dd className="text-sm text-slate-900 dark:text-slate-100">{client.departmentName}</dd>
            </div>
          )}
          {client.cityName && (
            <div>
              <dt className="text-xs font-medium text-slate-500">{labels.city}</dt>
              <dd className="text-sm text-slate-900 dark:text-slate-100">{client.cityName}</dd>
            </div>
          )}
          {client.address && (
            <div>
              <dt className="text-xs font-medium text-slate-500">{labels.address}</dt>
              <dd className="text-sm text-slate-900 dark:text-slate-100">{client.address}</dd>
            </div>
          )}
        </dl>
      )}

      {mode === "readOnly" && !hasCoordinates ? (
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {labels.location_title}
          </h3>
          <p className="text-sm text-slate-500">
            {hasLocationDetails ? labels.no_coordinates_available : labels.no_location_registered}
          </p>
        </div>
      ) : mode === "edit" ? (
        <LocationPickerMap
          latitude={client.latitude}
          longitude={client.longitude}
          accuracyMeters={client.locationAccuracyMeters}
          labels={labels}
          mode="edit"
          onChange={(location) => props.onChange(locationPatch(location))}
        />
      ) : (
        <LocationPickerMap
          latitude={client.latitude}
          longitude={client.longitude}
          accuracyMeters={client.locationAccuracyMeters}
          labels={labels}
          mode="readOnly"
        />
      )}
    </section>
  );
}
