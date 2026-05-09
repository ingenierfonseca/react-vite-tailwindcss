
interface LabelBadgeProps {
    label: string,
    className: string
}

export default function LabelBadge({... prop}: LabelBadgeProps) {
    return (
        <div className={`w-fit h-fit ${prop.className} font-semibold rounded-2xl px-3`}>{prop.label}</div>
    )
}