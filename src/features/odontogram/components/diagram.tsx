export default function Diagram() {
    return (
        <svg className="cursor-pointer" viewBox="0 0 100 100">
            <circle data-surface="center" className="surface" cx="50" cy="50" r="18" fill="#f3e8c8" stroke="#555" stroke-width="3"/>
            <path data-surface="top" className="surface"
                    d="M50 10 A40 40 0 0 1 90 50 L70 50 A20 20 0 0 0 50 30 Z"
                    fill="#f3e8c8" stroke="#555" stroke-width="3"/>
            <path data-surface="right" className="surface"
                    d="M90 50 A40 40 0 0 1 50 90 L50 70 A20 20 0 0 0 70 50 Z"
                    fill="#f3e8c8" stroke="#555" stroke-width="3"/>
            <path data-surface="bottom" className="surface"
                    d="M50 90 A40 40 0 0 1 10 50 L30 50 A20 20 0 0 0 50 70 Z"
                    fill="#f3e8c8" stroke="#555" stroke-width="3"/>
            <path data-surface="left" className="surface"
                    d="M10 50 A40 40 0 0 1 50 10 L50 30 A20 20 0 0 0 30 50 Z"
                    fill="#f3e8c8" stroke="#555" stroke-width="3"/>
        </svg>
    )
}