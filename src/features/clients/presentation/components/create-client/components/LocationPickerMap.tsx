import { useCallback, useEffect, useRef, useState } from "react";
import { LocateFixed, MapPin, RotateCcw } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./css/customer-location-picker-map.css";
import type { ClientLabels } from "@/features/clients/presentation/types";

const NICARAGUA_CENTER: L.LatLngExpression = [12.8654, -85.2072];

export interface LocationSelection {
  latitude: number | null;
  longitude: number | null;
  accuracyMeters: number | null;
  source: "ManualMap" | "BrowserGps" | null;
}

interface LocationPickerMapBaseProps {
  latitude?: number | null;
  longitude?: number | null;
  accuracyMeters?: number | null;
  labels: ClientLabels;
}

type LocationPickerMapProps = LocationPickerMapBaseProps & (
  | { mode: "edit"; onChange: (location: LocationSelection) => void }
  | { mode: "readOnly"; onChange?: never }
);

export default function LocationPickerMap(props: LocationPickerMapProps) {
  const { latitude, longitude, accuracyMeters, labels, mode } = props;
  const onChange = props.mode === "edit" ? props.onChange : undefined;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  const selectPointRef = useRef<(point: L.LatLng, accuracy: number | null, source: LocationSelection["source"]) => void>(() => undefined);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tileError, setTileError] = useState(false);
  const tileUrl = import.meta.env.VITE_MAP_TILE_URL ?? "/tiles/{z}/{x}/{y}.png";

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const selectPoint = useCallback((point: L.LatLng, accuracy: number | null, source: LocationSelection["source"]) => {
    const map = mapRef.current;
    if (!map || !onChangeRef.current) return;

    if (markerRef.current) markerRef.current.setLatLng(point);
    else {
      markerRef.current = L.marker(point, {
        draggable: mode === "edit",
        interactive: mode === "edit",
        icon: L.divIcon({
          className: "customer-location-marker-host",
          html: "<span class='customer-location-marker'><span></span></span>",
          iconSize: [34, 42],
          iconAnchor: [17, 40],
        }),
      }).addTo(map);
      if (mode === "edit") {
        markerRef.current.on("dragend", () => {
          const moved = markerRef.current?.getLatLng();
          if (moved) selectPointRef.current(moved, null, "ManualMap");
        });
      }
    }

    map.setView(point, Math.max(map.getZoom(), 15), { animate: true });
    onChangeRef.current({
      latitude: Number(point.lat.toFixed(6)),
      longitude: Number(point.lng.toFixed(6)),
      accuracyMeters: accuracy == null ? null : Number(accuracy.toFixed(2)),
      source,
    });
    setError(null);
  }, [mode]);

  useEffect(() => { selectPointRef.current = selectPoint; }, [selectPoint]);

  useEffect(() => {
    if (!containerRef.current) return;
    const initialPosition: L.LatLngExpression = latitude != null && longitude != null
      ? [latitude, longitude]
      : NICARAGUA_CENTER;
    const isEditable = mode === "edit";
    const map = L.map(containerRef.current, {
      zoomControl: isEditable,
      dragging: isEditable,
      scrollWheelZoom: isEditable,
      doubleClickZoom: isEditable,
      boxZoom: isEditable,
      keyboard: isEditable,
      touchZoom: isEditable,
    })
      .setView(initialPosition, latitude != null && longitude != null ? 15 : 6);
    const tiles = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    });
    tiles.on("tileerror", () => setTileError(true));
    tiles.on("load", () => setTileError(false));
    tiles.addTo(map);
    if (isEditable) {
      map.on("click", (event: L.LeafletMouseEvent) => selectPointRef.current(event.latlng, null, "ManualMap"));
    }
    mapRef.current = map;
    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  // Initial map center is set once; later coordinate updates are handled below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, tileUrl]);

  useEffect(() => {
    if (latitude == null || longitude == null || !mapRef.current) {
      if (latitude == null && longitude == null && markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      return;
    }

    const point = L.latLng(latitude, longitude);
    mapRef.current.setView(point, Math.max(mapRef.current.getZoom(), 15), { animate: false });
    if (markerRef.current) markerRef.current.setLatLng(point);
    else {
      markerRef.current = L.marker(point, {
        draggable: mode === "edit",
        interactive: mode === "edit",
        icon: L.divIcon({
          className: "customer-location-marker-host",
          html: "<span class='customer-location-marker'><span></span></span>",
          iconSize: [34, 42],
          iconAnchor: [17, 40],
        }),
      }).addTo(mapRef.current);
      if (mode === "edit") {
        markerRef.current.on("dragend", () => {
          const moved = markerRef.current?.getLatLng();
          if (moved) selectPointRef.current(moved, null, "ManualMap");
        });
      }
    }
  }, [latitude, longitude, mode]);

  const useDeviceLocation = () => {
    if (!navigator.geolocation) {
      setError(labels.geolocation_unsupported);
      return;
    }

    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        selectPoint(
          L.latLng(position.coords.latitude, position.coords.longitude),
          position.coords.accuracy,
          "BrowserGps",
        );
        setLocating(false);
      },
      (geoError) => {
        setError(geoError.code === geoError.PERMISSION_DENIED
          ? labels.geolocation_permission_denied
          : labels.geolocation_failed);
        setLocating(false);
      },
      { enableHighAccuracy: true, maximumAge: 30_000, timeout: 15_000 },
    );
  };

  const clearLocation = () => {
    if (!onChange) return;
    onChange({ latitude: null, longitude: null, accuracyMeters: null, source: null });
    setError(null);
  };

  return (
    <section className="space-y-2 sm:col-span-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {labels.location_title}
            {mode === "edit" && <span className="font-normal text-slate-500"> {labels.optional}</span>}
          </h3>
          {mode === "edit" && <p className="mt-0.5 text-xs text-slate-500">{labels.location_instructions}</p>}
        </div>
        {mode === "edit" && (
          <div className="flex gap-2">
            <button type="button" onClick={useDeviceLocation} disabled={locating} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><LocateFixed className="size-3.5" />{locating ? labels.locating : labels.use_current_location}</button>
            {(latitude != null || longitude != null) && <button type="button" onClick={clearLocation} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><RotateCcw className="size-3.5" />{labels.remove_point}</button>}
          </div>
        )}
      </div>

      <div className="relative h-90 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
        <div
          ref={containerRef}
          className="h-full w-full"
          aria-label={mode === "edit" ? labels.select_location_aria : labels.location_title}
        />
        <span className="pointer-events-none absolute left-12 top-3 z-500 inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-[10px] text-slate-600 shadow dark:bg-slate-900/95 dark:text-slate-300"><MapPin className="size-3" />{latitude != null && longitude != null ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` : labels.no_point_selected}</span>
        {tileError && <span className="absolute bottom-2 left-2 right-2 z-500 rounded-md bg-amber-50/95 px-2 py-1 text-center text-[10px] text-amber-900 shadow">{labels.tiles_unavailable}</span>}
      </div>
      <p className="text-xs text-slate-500">
        {accuracyMeters != null
          ? labels.approximate_accuracy(Math.round(accuracyMeters))
          : mode === "edit" ? labels.manual_accuracy : labels.accuracy_not_recorded}
      </p>
      {error && <p role="alert" className="text-xs text-rose-700 dark:text-rose-300">{error}</p>}
    </section>
  );
}
