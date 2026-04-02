interface CardInfoProps {
    title: string;
    description: string;
    info: string;
    icon: React.ReactNode;
    riskLevel?: 'low' | 'medium' | 'high';
}

export default function CardInfo({ title, description, info, icon, riskLevel }: CardInfoProps) {
    const { textColor, bgColor, borderColor, bgIconColor } = getColorByRiskLevel(riskLevel || 'low');

    return(
        <div className={`flex-1 flex items-center ${bgColor || 'bg-gray-100'} ${borderColor || 'border-gray-300'} border rounded-md p-4 mt-4`}>
            <div className={`flex justify-content mr-3 p-1 h-fit rounded-md ${bgIconColor || 'bg-green-300/50'}`}>{icon}</div>
            <div>
                <p className={`font-semibold ${textColor || 'text-black dark:text-white'}`}>{title}</p>
                <p className={`text-sm ${textColor || 'text-black dark:text-white'}`}>{description}</p>
                <p className={`text-xs ${textColor || 'text-black dark:text-white'}`}>{info}</p>
            </div>
        </div>
    )
}

interface RiskLevelColors {
    textColor?: string;
    bgColor?: string;
    borderColor?: string;
    bgIconColor?: string;
}

function getColorByRiskLevel(riskLevel: string): RiskLevelColors {
    switch (riskLevel) {
        case 'low':
            return {
                textColor: 'text-green-900',
                bgColor: 'bg-green-200/50',
                borderColor: 'border-green-600',
                bgIconColor: 'bg-green-300/50',
            };
        case 'medium':
            return {
                textColor: 'text-yellow-900',
                bgColor: 'bg-yellow-200/50',
                borderColor: 'border-yellow-600',
                bgIconColor: 'bg-yellow-300/50',
            };
        case 'high':
            return {
                textColor: 'text-red-900',
                bgColor: 'bg-red-200/50',
                borderColor: 'border-red-600',
                bgIconColor: 'bg-red-300/50',
            };
        default:
            return {
                textColor: 'text-gray-900',
                bgColor: 'bg-gray-200/50',
                borderColor: 'border-gray-600',
                bgIconColor: 'bg-gray-300/50',
            };

    }
}
