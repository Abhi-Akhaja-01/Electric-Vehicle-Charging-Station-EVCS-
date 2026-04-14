import React from "react";
import GoogleMapReact from "google-map-react";
import { MAPS_JAVASCRIPT_API } from "../../environment";
import { Tooltip } from "antd";
import { MdChargingStation } from "react-icons/md";

const Marker = ({ text }) => (
  <Tooltip title={text}>
    <div style={{ transform: 'translate(-50%, -100%)', cursor: 'pointer' }}>
      <MdChargingStation size={40} color="#28b67e" />
    </div>
  </Tooltip>
);

const StationMap = ({ stations }) => {
  const defaultProps = {
    center: {
      lat: 23.0225, // Fallback center (Ahmedabad)
      lng: 72.5714
    },
    zoom: 6
  };

  // Find first valid coordinates to center the map
  const centerStation = stations.find(s => s.lat && s.lng);
  if (centerStation) {
    defaultProps.center = {
      lat: Number(centerStation.lat),
      lng: Number(centerStation.lng)
    };
  }

  return (
    <div style={{ height: '70vh', width: '100%', borderRadius: 20, overflow: 'hidden', border: '1px solid #e2e8f0', marginTop: 20 }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: MAPS_JAVASCRIPT_API }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        {stations.map((station, index) => {
          if (station.lat && station.lng) {
            return (
              <Marker
                key={index}
                lat={Number(station.lat)}
                lng={Number(station.lng)}
                text={`${station.stationName} - ${station.price} INR/hr`}
              />
            );
          }
          return null;
        })}
      </GoogleMapReact>
    </div>
  );
};

export default StationMap;
