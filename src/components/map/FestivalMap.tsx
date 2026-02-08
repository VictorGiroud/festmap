"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import Map, { Source, Layer, Popup, NavigationControl } from "react-map-gl/mapbox";
import type { MapMouseEvent, MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAP_DEFAULTS, GENRE_COLORS } from "@/lib/constants";
import { FestivalPopup } from "./FestivalPopup";
import type { Festival } from "@/lib/types";

interface Props {
  festivals: Festival[];
}

export function FestivalMap({ festivals }: Props) {
  const mapRef = useRef<MapRef>(null);
  const [popupFestival, setPopupFestival] = useState<Festival | null>(null);

  // Convert festivals to GeoJSON
  const geojson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: festivals
        .filter(
          (f) =>
            f.venue.coordinates.lat !== 0 && f.venue.coordinates.lng !== 0
        )
        .map((f) => ({
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [f.venue.coordinates.lng, f.venue.coordinates.lat],
          },
          properties: {
            id: f.id,
            name: f.name,
            slug: f.slug,
            genre: f.genres[0] ?? "other",
            startDate: f.startDate,
            city: f.venue.city,
          },
        })),
    }),
    [festivals]
  );

  const handleClick = useCallback(
    (e: MapMouseEvent) => {
      const feature = e.features?.[0];
      if (!feature) return;

      if (feature.properties?.cluster) {
        // Zoom into cluster
        const clusterId = feature.properties.cluster_id;
        const source = mapRef.current?.getSource("festivals");
        if (source && "getClusterExpansionZoom" in source) {
          (source as { getClusterExpansionZoom: (id: number, cb: (err: unknown, zoom: number) => void) => void })
            .getClusterExpansionZoom(
              clusterId,
              (err: unknown, zoom: number) => {
                if (!err && feature.geometry.type === "Point") {
                  mapRef.current?.flyTo({
                    center: feature.geometry.coordinates as [number, number],
                    zoom: Math.min(zoom, 15),
                    duration: 500,
                  });
                }
              }
            );
        }
        return;
      }

      // Show popup for individual festival
      const festivalId = feature.properties?.id;
      const festival = festivals.find((f) => f.id === festivalId);
      if (festival) setPopupFestival(festival);
    },
    [festivals]
  );

  const handleMouseEnter = useCallback(() => {
    const canvas = mapRef.current?.getCanvas();
    if (canvas) canvas.style.cursor = "pointer";
  }, []);

  const handleMouseLeave = useCallback(() => {
    const canvas = mapRef.current?.getCanvas();
    if (canvas) canvas.style.cursor = "";
  }, []);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        latitude: MAP_DEFAULTS.center.lat,
        longitude: MAP_DEFAULTS.center.lng,
        zoom: MAP_DEFAULTS.zoom,
      }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      interactiveLayerIds={["clusters", "unclustered-point"]}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width: "100%", height: "100%" }}
    >
      <NavigationControl position="bottom-right" />

      <Source
        id="festivals"
        type="geojson"
        data={geojson}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        {/* Cluster circles */}
        <Layer
          id="clusters"
          type="circle"
          filter={["has", "point_count"]}
          paint={{
            "circle-color": [
              "step",
              ["get", "point_count"],
              GENRE_COLORS.indie, // < 10: cyan-ish
              10,
              GENRE_COLORS.rock, // 10-50: pink
              50,
              GENRE_COLORS.electronic, // 50+: cyan
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              18,
              10,
              25,
              50,
              35,
            ],
            "circle-opacity": 0.85,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#06060c",
            "circle-blur": 0.15,
          }}
        />

        {/* Cluster count */}
        <Layer
          id="cluster-count"
          type="symbol"
          filter={["has", "point_count"]}
          layout={{
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
            "text-size": 13,
          }}
          paint={{ "text-color": "#ffffff" }}
        />

        {/* Individual points */}
        <Layer
          id="unclustered-point"
          type="circle"
          filter={["!", ["has", "point_count"]]}
          paint={{
            "circle-color": "#ff2d6a",
            "circle-radius": 7,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#00f0ff",
            "circle-blur": 0.1,
          }}
        />
      </Source>

      {popupFestival && (
        <Popup
          latitude={popupFestival.venue.coordinates.lat}
          longitude={popupFestival.venue.coordinates.lng}
          onClose={() => setPopupFestival(null)}
          closeButton={true}
          closeOnClick={false}
          anchor="bottom"
          offset={15}
        >
          <FestivalPopup festival={popupFestival} />
        </Popup>
      )}
    </Map>
  );
}
