
interface LabelBadgeProps {
    label: string,
    className: string
}

export default function LabelBadge({... prop}: LabelBadgeProps) {
    return (
        <div className={`w-fit h-fit ${prop.className} font-semibold rounded-2xl px-3`}>{prop.label}</div>
    )
}

interface LabelIconBadgeProps extends LabelBadgeProps {
    icon: React.ReactNode,
    label: string,
    className: string
}
export function LabelIconBadge({... prop}: LabelIconBadgeProps) {
    return (
        <div className={`w-fit h-fit flex gap-1 items-center ${prop.className} font-semibold rounded-2xl px-3`}>
            {prop.icon}
            {prop.label}
        </div>
    )
}