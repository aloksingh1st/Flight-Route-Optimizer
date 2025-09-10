import React from "react";
import { Entity } from "resium";
import { Cartesian3 } from "cesium";
import airports from "../data/data.json";

interface AirportMarkersProps {
  fromAirport?: string | null;
  toAirport?: string | null;
}
const sizeToIcon: Record<string, string> = {
  large: "/red.png", // served from public/icons
  medium: "/blue.png",
  small: "/grey.png",
};
const AirportMarkers: React.FC<AirportMarkersProps> = ({
  fromAirport,
  toAirport,
}) => {
  return (
    <>
      {airports.map((a) => {
        // Choose default icon based on airport size

        // let icon;

        // Highlight from/to airports
        // if (a.iata === fromAirport) icon = "/icons/airport-from.png";
        // if (a.iata === toAirport) icon = "/icons/airport-to.png";

        return (
          <Entity
            key={a.id}
            name={`${a.name} (${a.iata})`}
            position={Cartesian3.fromDegrees(a.lon, a.lat, 0)}
            description={a.name}
            billboard={{
              image: sizeToIcon[a.size] || sizeToIcon["small"],
              width: 30,
              height: 48,
              pixelOffset: new Cartesian3(0, -12, 0), // shift above ground
            }}
          />
        );
      })}
    </>
  );
};

export default AirportMarkers;
