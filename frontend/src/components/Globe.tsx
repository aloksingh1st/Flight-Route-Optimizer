import React, { useState, useRef } from "react";
import { Viewer, CameraFlyTo, Entity } from "resium";
import { Cartesian3, Ion, Math as CesiumMath, Terrain, Color } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import AirportMarkers from "./AirportMarkers";
import airports from "../data/data.json";
import Form from "./Form";

Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MGVmYWM1MS1mMjFmLTQ5ZDAtODJjYi03MjNhMzA1YmY1N2IiLCJpZCI6MzM4OTk0LCJpYXQiOjE3NTcxODE2ODF9.N-69NVGXiOEx49oATTSChXVFJ_G_B-nj3CSr2HD_eo0";

const Globe: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [fromAirport, setFromAirport] = useState<string | null>(null);
  const [toAirport, setToAirport] = useState<string | null>(null);

  const creditRef = useRef<HTMLDivElement | null>(null);

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromAirport(e.target.value);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToAirport(e.target.value);
  };

  return (
    <>
      <div style={{ width: "100vw", height: "90vh" }}>
        {/* Cesium Viewer */}
        <Viewer
          full
          terrain={Terrain.fromWorldTerrain()}
          baseLayerPicker={false}
          geocoder={false}
          timeline={false}
          //   animation={false}
          //   fullscreenButton={false}
          creditContainer={document.createElement("div")}
        >
          {/* Airport markers */}
          <AirportMarkers fromAirport={fromAirport} toAirport={toAirport} />

          {/* Fly to selected airport if only one chosen */}
          {fromAirport && !toAirport && (
            <CameraFlyTo
              destination={Cartesian3.fromDegrees(
                airports.find((a) => a.iata === fromAirport)!.lon,
                airports.find((a) => a.iata === fromAirport)!.lat,
                200_000
              )}
              orientation={{
                heading: CesiumMath.toRadians(0.0),
                pitch: CesiumMath.toRadians(-30.0),
              }}
            />
          )}

          {/* Draw flight path if both airports selected */}
          {fromAirport && toAirport && (
            <Entity
              name="Flight Path"
              polyline={{
                positions: Cartesian3.fromDegreesArray([
                  airports.find((a) => a.iata === fromAirport)!.lon,
                  airports.find((a) => a.iata === fromAirport)!.lat,
                  airports.find((a) => a.iata === toAirport)!.lon,
                  airports.find((a) => a.iata === toAirport)!.lat,
                ]),
                width: 4,
                material: Color.YELLOW,
              }}
            />
          )}
        </Viewer>
        <div ref={creditRef} style={{ display: "none" }} />
      </div>

      {/* Floating button to open booking form */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 
             bg-gradient-to-r from-blue-600 to-indigo-600 
             hover:from-blue-700 hover:to-indigo-700 
             text-white font-bold py-4 px-8 rounded-full 
             transition-all duration-300 
             hover:scale-105 hover:shadow-2xl 
             shadow-lg shadow-indigo-400/50 z-50"
      >
        Start Simulating
      </button>

      {/* Booking modal form */}
      <Form
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default Globe;
