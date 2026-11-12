interface Props {
    step: number;
    onChange: (step: number) => void;
}

export const ClientCreateStepper = ({
    step,
    onChange
}: Props) => {

    const steps = [
        { id: 1, label: "Información personal" },
        { id: 2, label: "Ubicación" },
        //{ id: 3, label: "Información adicional" }
    ];

    return (
        <div className="flex mr-6">
            {steps.map(item => (
                <button
                    key={item.id}
                    type="button"
                    onClick={() => onChange(item.id)}
                    className={`
                        flex-1 px-6 py-3 text-sm font-medium cursor-pointer
                        ${step === item.id
                            ? "bg-primary text-white"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                        }
                        [clip-path:polygon(0_0,calc(100%-20px)_0,100%_50%,calc(100%-20px)_100%,0_100%,20px_50%)]
                        -mr-5 z-20
                    `}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};