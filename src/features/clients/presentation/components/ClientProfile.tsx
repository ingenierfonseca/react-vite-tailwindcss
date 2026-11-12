import { Calendar, IdCard, Mail, Phone } from "lucide-react";
import { ASSETS_URLS } from "../../../../config/constants";
import PageRightComponent from "@/components/commons/PageRightComponent";
import { formatPhoneNumber } from "@/utils/number.util";
import { type ReactNode } from "react";
import { calculateAgeFromString } from "@/utils/date.util";
import CustomerItemInfo from "./ItemInfo";
import ClientLocationInformation from "./create-client/components/ClientLocationInformation";

import type { Client } from "../../domain/client";
import type { ClientLabels } from "../types";

interface ClientProfileProps {
    client: Client;
    labels: ClientLabels;
    onCancel: () => void;
    renderAdittionalInfo?: ReactNode;
    onEdit?: (value: boolean) => void;
}

export default function ClientProfile({ client, labels, renderAdittionalInfo, onCancel }: ClientProfileProps) {
    const age = calculateAgeFromString(client.birthDate);

    return (
        <PageRightComponent
            title={labels.entity_profile}
            onClose={onCancel}>
            <div className="client-profile-container">
                <div className="client-profile-header">
                    {client.avatar && !client.avatar.includes('null') ? (
                        <img
                            src={`${ASSETS_URLS.avatars}${client.avatar}`}
                            alt={`${client.firstName} ${client.lastName}`}
                            className="client-profile-avatar rounded-md object-cover"
                        />
                    ) : (
                        <div className="client-profile-avatar flex aspect-square items-center justify-center rounded-md bg-gray-300">
                            <span className="text-9xl font-bold text-gray-600">
                                {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                            </span>
                        </div>
                    )}
                    <div className="client-profile-details">
                        <div>
                            <p className="mb-8 text-2xl font-medium text-black dark:text-white">
                                {client.firstName} {client.lastName}
                            </p>
                            <CustomerItemInfo
                                value={client.dni}
                                title={labels.entity_id}
                                icon={<IdCard size={30} />}
                            />
                            <CustomerItemInfo
                                value={`${age} ${Number(age) > 1 ? labels.age_other : labels.age_one}`}
                                title={labels.age}
                                icon={<Calendar size={30} />}
                            />
                            <CustomerItemInfo
                                value={formatPhoneNumber(client.phone!)}
                                title={labels.phone}
                                icon={<Phone size={30} />}
                            />
                            <CustomerItemInfo
                                value={client.email!}
                                title={labels.email}
                                icon={<Mail size={30} />}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {renderAdittionalInfo ?? (
                <ClientLocationInformation
                    client={client}
                    labels={labels}
                    mode="readOnly"
                />
            )}

        </PageRightComponent>
    )
}
