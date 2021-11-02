import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import MapGL, { Marker, Popup } from "react-map-gl";
import { Editor, DrawRectangleMode } from "react-map-gl-draw";
import { Button, Form } from "react-bootstrap";
const MAPBOX_TOKEN =
  "pk.eyJ1IjoidmVyeWJpZ2ZhaWx1cmUiLCJhIjoiY2t2Z3JjNnJxNDF2aDJubHV4cHJ3ZXVvYyJ9.LDGrKlJ8IxGMxrbsagRSUg"; // Set your mapbox token here
const DEFAULT_POPUP = {
  latitude: 0.0,
  longitude: 0.0,
  categoryName: "",
  rangeSearchTime: 0,
  categorySearchTime: 0,
};

const API_ENDPOINTS = [
  "/api/kd-tree/hashmap",
  "/api/kd-tree/list",
  "/api/range-tree/hashmap",
  "/api/range-tree/list",
];

function App() {
  const editorRef = useRef(null);
  const [viewport, setViewport] = useState({
    latitude: 29.9891,
    longitude: -97.8772,
    zoom: 14,
    bearing: 0,
    pitch: 0,
  });

  const [businessList, setBusinessList] = useState([]);
  const [features, setFeatures] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContents, setPopupContents] = useState(DEFAULT_POPUP);
  const [mode, setMode] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState(API_ENDPOINTS[0]);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  function fetchBusinesses() {
    let params = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "get",
    };

    fetch("/api/kyle", params)
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setBusinessList(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const markers = React.useMemo(
    () =>
      businessList.map((business) => (
        <Marker
          key={business.businessId}
          longitude={business.longitude}
          latitude={business.latitude}
        >
          <span className="dot"></span>
        </Marker>
      )),
    [businessList]
  );

  const handleChangeMode = (e) => {
    e.preventDefault();
    console.log(popupContents);
    setMode(new DrawRectangleMode());
  };

  const renderDeleteButton = () => {
    return (
      <div style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
        <Button onClick={handleChangeMode}>Draw</Button>
      </div>
    );
  };

  const handleUpdate = (val) => {
    setFeatures(val.data);

    if (val.editType === "addFeature") {
      const polygon = val.data[0].geometry.coordinates[0];
      console.log(polygon);
      const xMin = polygon[0][0];
      const yMin = polygon[2][1];
      const xMax = polygon[2][0];
      const yMax = polygon[0][1];
      getMostPopularCategory(xMin, yMin, xMax, yMax);
    }

    setShowPopup(true);
    setFeatures([]);
    setMode(null);
  };

  function getMostPopularCategory(xMin, yMin, xMax, yMax) {
    let params = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "get",
    };

    fetch(
      `${apiEndpoint}?xMin=${xMin}&xMax=${xMax}&yMin=${yMin}&yMax=${yMax}`,
      params
    )
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        const newLat = (yMin + yMax) / 2;
        const newLon = (xMin + xMax) / 2;
        const newPopupContents = {
          latitude: newLat,
          longitude: newLon,
          categoryName: resData.categoryName,
          rangeSearchTime: resData.rangeSearchTime,
          categorySearchTime: resData.categorySearchTime,
        };
        setPopupContents(newPopupContents);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function renderAlgoOptions() {
    return (
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}>
        <Form.Select
          size="sm"
          onChange={(e) => setApiEndpoint(API_ENDPOINTS[e.target.value])}
        >
          <option value={Number(0)} selected>
            KD-Tree + Hashmap
          </option>
          <option value={Number(1)}>KD-Tree + List</option>
          <option value={Number(2)}>Range-Tree + Hashmap</option>
          <option value={Number(3)}>Range-Tree + List</option>
        </Form.Select>
      </div>
    );
  }

  return (
    <MapGL
      {...viewport}
      width="100vw"
      height="100vh"
      mapStyle="mapbox://styles/mapbox/dark-v9"
      onViewportChange={setViewport}
      mapboxApiAccessToken={MAPBOX_TOKEN}
    >
      {markers}
      <Editor
        ref={editorRef}
        // to make the lines/vertices easier to interact with
        clickRadius={12}
        mode={mode}
        features={features}
        onUpdate={handleUpdate}
      />
      {showPopup && (
        <Popup
          latitude={popupContents.latitude}
          longitude={popupContents.longitude}
          closeButton={true}
          closeOnClick={false}
          onClose={() => {
            setPopupContents(DEFAULT_POPUP);
            setShowPopup(false);
          }}
          anchor="bottom"
        >
          <div className="p-3">
            <span>
              <b>Most Popular Category:</b> {popupContents.categoryName}
            </span>
            <br />
            <span>
              <b>Tree construction + range search:</b>{" "}
              {popupContents.rangeSearchTime} ms
            </span>
            <br />
            <span>
              <b>Category Search:</b> {popupContents.categorySearchTime} ms
            </span>
          </div>
        </Popup>
      )}
      {renderDeleteButton()}
      {renderAlgoOptions()}
    </MapGL>
  );
}

export default App;
