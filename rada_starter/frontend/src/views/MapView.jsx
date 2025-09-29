import React, { useEffect, useState } from "react";
import { Row, Col, Card, List, Button, Tag } from "antd";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons for Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Helper: fly map when an event is selected
function FlyToLocation({ event }) {
  const map = useMap();
  useEffect(() => {
    if (event && event.lat && event.lng) {
      map.flyTo([event.lat, event.lng], 16, { animate: true, duration: 1.5 });
    }
  }, [event, map]);
  return null;
}

export default function MapView() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    setEvents([
      {
        id: 1,
        title: "Street Food Pop-up",
        distance: "0.4 km",
        timeLeft: "2 hr",
        lat: -1.286389,
        lng: 36.817223,
      },
      {
        id: 2,
        title: "Open Mic Night",
        distance: "0.9 km",
        timeLeft: "5 hr",
        lat: -1.28333,
        lng: 36.81667,
      },
      {
        id: 3,
        title: "Tech Meetup",
        distance: "1.2 km",
        timeLeft: "1 hr",
        lat: -1.29,
        lng: 36.82,
      },
      {
        id: 4,
        title: "Live Jazz Concert",
        distance: "2.0 km",
        timeLeft: "3 hr",
        lat: -1.295,
        lng: 36.815,
      },
      {
        id: 5,
        title: "Pop-up Art Gallery",
        distance: "1.8 km",
        timeLeft: "6 hr",
        lat: -1.292,
        lng: 36.819,
      },
    ]);
  }, []);

  return (
    <Row gutter={16}>
      {/* Events List */}
      <Col xs={24} md={8}>
        <Card
          title="Events nearby"
          bodyStyle={{
            padding: 0,
            maxHeight: "70vh", // same as map height
            overflowY: "auto", // scrollable
          }}
          headStyle={{
            position: "sticky", // sticky header
            top: 0,
            zIndex: 1,
            background: "#fff",
          }}
        >
          <List
            dataSource={events}
            renderItem={(item) => {
              const isSelected = selectedEvent?.id === item.id;
              return (
                <List.Item
                  style={{
                    background: isSelected ? "#e6f7ff" : "#fff",
                    borderLeft: isSelected
                      ? "4px solid #1890ff"
                      : "4px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onClick={() => setSelectedEvent(item)}
                  actions={[
                    <Tag color="blue" key="time">
                      {item.timeLeft}
                    </Tag>,
                    <Button
                      key="view"
                      size="small"
                      onClick={() => setSelectedEvent(item)}
                    >
                      View
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={<b>{item.title}</b>}
                    description={item.distance}
                  />
                </List.Item>
              );
            }}
          />
        </Card>
      </Col>

      {/* Map View */}
      <Col xs={24} md={16}>
        <Card bodyStyle={{ padding: 0 }}>
          <div style={{ height: "70vh", width: "100%" }}>
            <MapContainer
              center={[-1.286389, 36.817223]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <FlyToLocation event={selectedEvent} />
              {events.map((event) => (
                <Marker
                  key={event.id}
                  position={[event.lat, event.lng]}
                  eventHandlers={{ click: () => setSelectedEvent(event) }}
                >
                  <Popup>
                    <b>{event.title}</b>
                    <br />
                    {event.distance} • {event.timeLeft}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Card>
      </Col>
    </Row>
  );
}