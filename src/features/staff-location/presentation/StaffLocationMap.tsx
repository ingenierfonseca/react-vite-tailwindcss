import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { ASSETS_URLS } from "@/config/constants";
import type { StaffCurrentLocation } from "../domain/staff-location.types";
import "leaflet/dist/leaflet.css";
import "./staff-location-map.css";

const NICARAGUA_CENTER: L.LatLngExpression = [12.8654, -85.2072];

function effectiveAvailability(location: StaffCurrentLocation) {
  if (location.reportedState === "Alert") return "Alert";
  if (location.reportedState === "PhoneOff") return "PhoneOff";
  return location.availability;
}

function initials(location: StaffCurrentLocation) {
  return `${location.firstName.trim().charAt(0)}${location.lastName.trim().charAt(0)}`.toUpperCase();
}

function appendAvatar(target: HTMLElement, location: StaffCurrentLocation, className: string) {
  const fallback = () => {
    const badge = document.createElement("span");
    badge.className = `${className} staff-avatar-fallback`;
    badge.textContent = initials(location);
    target.replaceChildren(badge);
  };

  if (!location.avatar) {
    fallback();
    return;
  }

  const image = document.createElement("img");
  image.className = className;
  image.alt = "";
  image.src = `${ASSETS_URLS.staffAvatars}${encodeURIComponent(location.avatar)}`;
  image.onerror = fallback;
  target.append(image);
}

function markerIcon(location: StaffCurrentLocation, selected: boolean) {
  const glyphs = {
    Online: "•",
    Alert: "!",
    Offline: "⌁",
    PhoneOff: "▯",
    NeverReported: "?",
  };
  const availability = effectiveAvailability(location);

  const marker = document.createElement("span");
  marker.className = `staff-location-marker staff-location-marker--${availability.toLowerCase()}${selected ? " staff-location-marker--selected" : ""}`;
  const avatar = document.createElement("span");
  avatar.className = "staff-location-marker__avatar-wrap";
  appendAvatar(avatar, location, "staff-location-marker__avatar");
  const statusBadge = document.createElement("span");
  statusBadge.className = "staff-location-marker__status";
  statusBadge.textContent = glyphs[availability];
  marker.append(avatar, statusBadge);

  return L.divIcon({
    className: "staff-location-marker-host",
    html: marker,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
}

function elapsedTime(lastReceivedAtUtc: string | null | undefined, now: number) {
  if (!lastReceivedAtUtc) return "Nunca reportó";
  const seconds = Math.max(Math.floor((now - new Date(lastReceivedAtUtc).getTime()) / 1000), 0);
  if (seconds < 60) return `hace ${seconds} s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `hace ${hours} h ${remainder} min` : `hace ${hours} h`;
}

function addPopupText(container: HTMLElement, text: string, className?: string) {
  const element = document.createElement("p");
  element.textContent = text;
  if (className) element.className = className;
  container.append(element);
}

export function StaffLocationMap({
  locations,
  selectedUserId,
  onSelect,
}: {
  locations: StaffCurrentLocation[];
  selectedUserId: number | null;
  onSelect: (location: StaffCurrentLocation) => void;
}) {
  const tileUrl = import.meta.env.VITE_MAP_TILE_URL ?? "/tiles/{z}/{x}/{y}.png";
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const lastViewKeyRef = useRef<string | null>(null);
  const [tileError, setTileError] = useState(false);
  const [clock, setClock] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setClock(Date.now()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const locationsWithCoordinates = useMemo(() => locations.filter(
    (location): location is StaffCurrentLocation & { latitude: number; longitude: number } =>
      typeof location.latitude === "number" && typeof location.longitude === "number",
  ), [locations]);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current, { zoomControl: true }).setView(NICARAGUA_CENTER, 7);
    const tileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    });
    const markerLayer = L.layerGroup().addTo(map);

    tileLayer.on("tileerror", () => setTileError(true));
    tileLayer.on("load", () => setTileError(false));
    tileLayer.addTo(map);
    mapRef.current = map;
    markerLayerRef.current = markerLayer;
    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, [tileUrl]);

  useEffect(() => {
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;
    if (!map || !markerLayer) return;

    markerLayer.clearLayers();
    const markers: L.Marker[] = [];
    const markersByUserId = new Map<number, L.Marker>();
    const popupClock = clock || Date.now();

    for (const location of locationsWithCoordinates) {
      const marker = L.marker([location.latitude, location.longitude], {
        icon: markerIcon(location, selectedUserId === location.userId),
        title: `${location.staffName} · ${location.availability}`,
      });

      const popup = document.createElement("div");
      popup.className = "staff-location-popup";
      const popupHeader = document.createElement("div");
      popupHeader.className = "staff-location-popup__header";
      appendAvatar(popupHeader, location, "staff-location-popup__avatar");
      const popupIdentity = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = `${location.firstName} ${location.lastName}`.trim();
      const subtitle = document.createElement("span");
      subtitle.textContent = `${location.branchName} · ${location.staffType}`;
      popupIdentity.append(title, subtitle);
      popupHeader.append(popupIdentity);
      popup.append(popupHeader);
      addPopupText(popup, `Última ubicación: ${elapsedTime(location.lastReceivedAtUtc, popupClock)}`);
      addPopupText(popup, `Precisión ±${Math.round(location.accuracyMeters ?? 0)} m`);
      if (location.alertMessage) addPopupText(popup, location.alertMessage, "staff-location-popup__alert");

      marker.bindPopup(popup);
      marker.on("click", () => onSelect(location));
      marker.addTo(markerLayer);
      markers.push(marker);
      markersByUserId.set(location.userId, marker);
    }

    const selected = locationsWithCoordinates.find((location) => location.userId === selectedUserId);
    const viewKey = selected
      ? `selected:${selected.userId}`
      : `locations:${locationsWithCoordinates.map((location) => location.userId).join(",")}`;
    if (lastViewKeyRef.current !== viewKey) {
      if (selected) {
        map.setView([selected.latitude, selected.longitude], Math.max(map.getZoom(), 15), { animate: true });
        markersByUserId.get(selected.userId)?.openPopup();
      } else if (markers.length === 1) {
        map.setView(markers[0].getLatLng(), 15, { animate: true });
      } else if (markers.length > 1) {
        map.fitBounds(L.featureGroup(markers).getBounds(), { padding: [48, 48], maxZoom: 15, animate: true });
      }
      lastViewKeyRef.current = viewKey;
    }
  }, [clock, locationsWithCoordinates, onSelect, selectedUserId]);

  return (
    <div className="relative h-[56vh] min-h-97.5 overflow-hidden rounded-xl border border-slate-200 bg-[#e8edf0] dark:border-slate-700 dark:bg-slate-800 lg:h-[calc(100vh-235px)] lg:min-h-140">
      <div ref={containerRef} className="h-full w-full" aria-label="Mapa de ubicación del personal" />
      <div className="staff-location-legend absolute bottom-4 left-4 z-500 rounded-lg border border-white/70 bg-white/95 p-3 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95" aria-label="Leyenda de estados">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Estado del personal</p>
        <div className="space-y-1.5">
          <LegendItem color="online" label="En línea" />
          <LegendItem color="alert" label="Alerta" />
          <LegendItem color="offline" label="Sin señal" />
          <LegendItem color="phoneoff" label="Teléfono apagado (reportado)" />
          <LegendItem color="neverreported" label="Sin ubicación" />
        </div>
      </div>
      {tileError && (
        <div className="absolute left-1/2 top-4 z-1000 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-lg border border-amber-300 bg-white/95 px-4 py-2 text-center text-xs text-amber-900 shadow-lg">
          No se pudieron cargar los mosaicos. Verifica el servidor local en /tiles o VITE_MAP_TILE_URL.
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200"><span className={`staff-location-legend__dot staff-location-legend__dot--${color}`} /><span>{label}</span></div>;
}
