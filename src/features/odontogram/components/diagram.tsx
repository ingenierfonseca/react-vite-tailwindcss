import { useState } from "react"

interface DiagramPros {
    id: number
    selectedCondition: string
}
type SurfaceKey = 'center' | 'top' | 'bottom' | 'right' | 'left';

type ToothData = {
  id: string;
  surfaces: Record<SurfaceKey, string | null>;
};

type SurfaceConfig = {
  key: SurfaceKey;
  type: "circle" | "path";
  props: any;
};

const surfacesConfig: SurfaceConfig[] = [
  {
    key: "center",
    type: "circle",
    props: { cx: 50, cy: 50, r: 18 }
  },
  {
    key: "top",
    type: "path",
    props: { d: "M50 10 A40 40 0 0 1 90 50 L70 50 A20 20 0 0 0 50 30 Z" }
  },
  {
    key: "right",
    type: "path",
    props: { d: "M90 50 A40 40 0 0 1 50 90 L50 70 A20 20 0 0 0 70 50 Z" }
  },
  {
    key: "bottom",
    type: "path",
    props: { d: "M50 90 A40 40 0 0 1 10 50 L30 50 A20 20 0 0 0 50 70 Z" }
  },
  {
    key: "left",
    type: "path",
    props: { d: "M10 50 A40 40 0 0 1 50 10 L50 30 A20 20 0 0 0 30 50 Z" }
  }
];

export default function Diagram({id, selectedCondition}: DiagramPros) {
    const [toothData, setToothData] = useState<ToothData>(() => ({
    id: `tooth-${id}`,
        surfaces: {
            center: null,
            top: null,
            bottom: null,
            right: null,
            left: null
        }
    }));
    
    const updateSurface = (surface: SurfaceKey, condition: string) => {
        setToothData((prev) => {
            const isSame = prev.surfaces[surface] === condition;
            return {
                ...prev,
                surfaces: {
                    ...prev.surfaces,
                    [surface]: isSame ? null : condition
                }
            };
        });
    };

    return (
        <svg className="cursor-pointer" viewBox="0 0 100 100">
            {surfacesConfig.map(({ key, type, props }) => {
                const commonProps = {
                key,
                "data-surface": key,
                className: "surface",
                stroke: "#555",
                strokeWidth: 3,
                fill: getColorForCondition(toothData.surfaces[key]),
                onClick: () => updateSurface(key, selectedCondition)
                };

                return type === "circle" ? (
                    <circle {...props} {...commonProps} />
                ) : (
                    <path {...props} {...commonProps} />
                );
            })}
        </svg>
    )
}

function getColorForCondition(condition: string | null) {
    switch (condition) {
        case "caries":
            return "#ff2f92"
        case "restoration":
            return "#4caf50"
        case "fracture":
            return "#f44336"
        case "healthy":
            return "#2196f3"
        case "up-braces":
            return "#9c27b0"
        case "down-braces":
            return "#ff9800"
        default:
            return "#f3e8c8"
    }
}