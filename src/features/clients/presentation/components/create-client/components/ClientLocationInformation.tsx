import type { Client } from "@/features/clients/domain/client";
import LocationPickerMap from "./LocationPickerMap";

interface ClientLocationInformationProps {
    client: Client,
    onChange: (patch: Partial<Client>) => void
}

export default function ClientLocationInformation({client, onChange}: ClientLocationInformationProps) {
    return (
        <div className="mt-6">
            <LocationPickerMap
                latitude={client.latitude}
                longitude={client.longitude}
                accuracyMeters={client.locationAccuracyMeters}
                onChange={(location) => onChange({
                latitude: location.latitude,
                longitude: location.longitude,
                locationAccuracyMeters: location.accuracyMeters,
                locationSource: location.source,
                locationDataProvided: true,
                })} />
        </div>
    )
}