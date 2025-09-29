import React, { useEffect, useState } from "react";
import { Row, Col, Card, List, Button } from "antd";
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

// Helper to fly map when an event is selected
function FlyToLocation({ event }) {
  const map = useMap();

  useEffect(() => {
    if (event && event.lat && event.lng) {
      map.flyTo([event.lat, event.lng], 16, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [event, map]);

  return null;
}

export default function MapView() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // placeholder: fetch events from API
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
        <Card title="Events nearby">
          <List
            dataSource={events}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button key="view" onClick={() => setSelectedEvent(item)}>
                    View
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={`${item.distance} • ${item.timeLeft}`}
                />
              </List.Item>
            )}
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

              {/* Fly map when event selected */}
              <FlyToLocation event={selectedEvent} />

              {events.map((event) => (
                <Marker
                  key={event.id}
                  position={[event.lat, event.lng]}
                  eventHandlers={{
                    click: () => setSelectedEvent(event),
                  }}
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
