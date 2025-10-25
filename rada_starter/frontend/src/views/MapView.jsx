import React, { useEffect, useState } from "react";
import { Row, Col, Card, List, Button, Tag, Drawer, message } from "antd";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// optional: if you want icons, install `@ant-design/icons` and import them
// import { MapOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
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
  const [showMap, setShowMap] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [mapInstance, setMapInstance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapStyle, setMapStyle] = useState("osm"); // 'osm' or 'carto'
  const [savedEvents, setSavedEvents] = useState(() => {
    try {
      const raw = localStorage.getItem("savedEvents");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    setEvents([
      {
        id: 1,
        title: "Street Food Pop-up",
        // sample cover — place your file at frontend/public/music-festivals.webp
        // and it will be available at '/music-festivals.webp'
        cover: "/music-festivals.webp",
        // ISO datetime for event start
        datetime: "2025-11-05T18:30:00",
        // human fallback distance/time (used if user location is unknown)
        distance: "0.4 km",
        timeLeft: "2 hr",
        description: "A curated street food experience with local vendors, live DJs and family-friendly vibes.",
        lat: -1.286389,
        lng: 36.817223,
      },
      {
        id: 2,
        title: "Open Mic Night",
        datetime: "2025-11-06T20:00:00",
        distance: "0.9 km",
        timeLeft: "5 hr",
        description: "Showcase local talent — poetry, music and stand-up. All ages welcome.",
        lat: -1.28333,
        lng: 36.81667,
      },
      {
        id: 3,
        title: "Tech Meetup",
        datetime: "2025-11-07T18:00:00",
        distance: "1.2 km",
        timeLeft: "1 hr",
        description: "Casual discussion on the latest in web development and cloud-native patterns.",
        lat: -1.29,
        lng: 36.82,
      },
      {
        id: 4,
        title: "Live Jazz Concert",
        datetime: "2025-11-08T19:30:00",
        distance: "2.0 km",
        timeLeft: "3 hr",
        description: "An intimate evening with a local jazz quartet performing original compositions.",
        lat: -1.295,
        lng: 36.815,
      },
      {
        id: 5,
        title: "Pop-up Art Gallery",
        datetime: "2025-11-09T10:00:00",
        distance: "1.8 km",
        timeLeft: "6 hr",
        description: "A weekend pop-up showcasing emerging visual artists from the city.",
        lat: -1.292,
        lng: 36.819,
      },
    ]);
  }, []);

  const closeDetail = () => setSelectedEvent(null);

  // tile providers
  const tileProviders = {
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "&copy; OpenStreetMap contributors",
    },
    carto: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: "&copy; CartoDB & OpenStreetMap",
    },
  };

  const locateMe = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLocation({ lat, lng });
        if (mapInstance) {
          mapInstance.flyTo([lat, lng], 14, { animate: true });
        }
      },
      (err) => alert("Unable to get location: " + err.message),
      { enableHighAccuracy: true }
    );
  };

  // persist saved events
  useEffect(() => {
    try {
      localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
    } catch (e) {
      // ignore
    }
  }, [savedEvents]);

  const isSaved = (id) => savedEvents.includes(id);
  const toggleSaveEvent = (id) => {
    setSavedEvents((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];
      message.success(exists ? "Removed from saved events" : "Event saved");
      return next;
    });
  };

  const getDirections = (event) => {
    if (!event) return;
    const destination = `${event.lat},${event.lng}`;
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : undefined;
    const params = new URLSearchParams();
    params.set("destination", destination);
    if (origin) params.set("origin", origin);
    params.set("travelmode", "walking");
    const url = `https://www.google.com/maps/dir/?api=1&${params.toString()}`;
    window.open(url, "_blank");
  };

  const shareEvent = async (event) => {
    if (!event) return;
    const url = window.location.href + `#event-${event.id}`;
    const shareData = {
      title: event.title,
      text: `${event.title} — ${event.description || ''}`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        message.success("Shared");
      } else {
        await navigator.clipboard.writeText(url);
        message.info("Link copied to clipboard");
      }
    } catch (e) {
      message.error("Unable to share");
    }
  };

  const fitToBounds = () => {
    if (!mapInstance || !events || events.length === 0) return;
    const bounds = events.map((e) => [e.lat, e.lng]);
    mapInstance.fitBounds(bounds, { padding: [40, 40] });
  };

  // Haversine distance (km)
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDistanceFor = (event) => {
    if (userLocation && event && event.lat && event.lng) {
      const km = getDistanceKm(userLocation.lat, userLocation.lng, event.lat, event.lng);
      if (km < 1) return `${Math.round(km * 1000)} m`;
      return `${km.toFixed(1)} km`;
    }
    return event.distance || "n/a";
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch (e) {
      return iso;
    }
  };


  return (
    <Row gutter={16}>
      {/* Mobile toggle: show either list or map */}
      {isMobile && (
        <Col xs={24} style={{ marginBottom: 12 }}>
          <Card>
            <Button.Group style={{ width: "100%" }}>
              <Button
                type={!showMap ? "primary" : "default"}
                onClick={() => setShowMap(false)}
                style={{ width: "50%" }}
              >
                List
              </Button>
              <Button
                type={showMap ? "primary" : "default"}
                onClick={() => setShowMap(true)}
                style={{ width: "50%" }}
              >
                Map
              </Button>
            </Button.Group>
          </Card>
        </Col>
      )}

      {/* Events List - visible on desktop or when list selected on mobile */}
      {(!isMobile || !showMap) && (
        <Col xs={24} md={8}>
          <Card
            title="Events nearby"
            bodyStyle={{
              padding: 0,
              maxHeight: "70vh",
              overflowY: "auto",
            }}
            headStyle={{ position: "sticky", top: 0, zIndex: 1, background: "#fff" }}
          >
            <List
              dataSource={events}
              renderItem={(item) => {
                const isSelected = selectedEvent?.id === item.id;
                return (
                  <List.Item
                    style={{
                      background: isSelected ? "#e6f7ff" : "#fff",
                      borderLeft: isSelected ? "4px solid #1890ff" : "4px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onClick={() => setSelectedEvent(item)}
                    actions={[
                      <Tag color="blue" key="time">
                        {item.timeLeft}
                      </Tag>,
                      <Button key="view" size="small" onClick={() => setSelectedEvent(item)}>
                        View
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={<b>{item.title}</b>}
                      description={
                        <div style={{ fontSize: 13 }}>
                          <div>{formatDistanceFor(item)}</div>
                          {item.datetime && <div style={{ color: '#666' }}>{new Date(item.datetime).toLocaleString()}</div>}
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      )}

      {/* Map View - visible on desktop or when map selected on mobile */}
      {(!isMobile || showMap) && (
        <Col xs={24} md={16}>
          <Card bodyStyle={{ padding: 0 }}>
            <div style={{ position: "relative", height: isMobile ? "calc(100vh - 220px)" : "70vh", width: "100%" }}>
              {/* small map controls */}
              <div style={{ position: "absolute", top: 12, right: 12, zIndex: 999 }}>
                <Button size="small" style={{ marginRight: 8 }} onClick={locateMe}>
                  Locate me
                </Button>
                <Button size="small" style={{ marginRight: 8 }} onClick={fitToBounds}>
                  Fit all
                </Button>
                <Button size="small" onClick={() => setMapStyle((s) => (s === "osm" ? "carto" : "osm"))}>
                  {mapStyle === "osm" ? "Carto" : "OSM"}
                </Button>
              </div>

              <MapContainer
                center={[-1.286389, 36.817223]}
                zoom={14}
                whenCreated={setMapInstance}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url={tileProviders[mapStyle].url} attribution={tileProviders[mapStyle].attribution} />
                <FlyToLocation event={selectedEvent} />

                {/* user location marker */}
                {userLocation && (
                  <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup>You are here</Popup>
                  </Marker>
                )}

                {events.map((event) => {
                  // simple highlighted marker for selected event
                  const iconHtml =
                    selectedEvent?.id === event.id
                      ? '<div style="width:28px;height:28px;border-radius:50%;background:#f5222d;border:3px solid white;box-shadow:0 0 6px rgba(0,0,0,0.3)"></div>'
                      : '<div style="width:20px;height:20px;border-radius:50%;background:#1890ff;border:2px solid white"></div>';
                  const icon = L.divIcon({ html: iconHtml, className: "", iconSize: [30, 30] });
                  return (
                    <Marker key={event.id} position={[event.lat, event.lng]} icon={icon} eventHandlers={{ click: () => setSelectedEvent(event) }}>
                      <Popup>
                        <b>{event.title}</b>
                        <br />
                        {event.distance} • {event.timeLeft}
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </Card>
        </Col>
      )}

      {/* Drawer with event details + media when an event is selected */}
      <Drawer
        open={!!selectedEvent}
        onClose={closeDetail}
        width={isMobile ? "100%" : 480}
        title={selectedEvent?.title}
      >
        {selectedEvent && (
          <div>
            {selectedEvent.cover ? (
              <img src={selectedEvent.cover} alt={selectedEvent.title} style={{ width: "100%", borderRadius: 8, marginBottom: 12 }} />
            ) : (
              <div style={{ width: "100%", height: 200, background: "#f0f0f0", borderRadius: 8, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No image</div>
            )}
            <p><strong>Distance:</strong> {formatDistanceFor(selectedEvent)}</p>
            <p><strong>Time:</strong> {selectedEvent.timeLeft}</p>
            {selectedEvent.datetime && (
              <p><strong>Date:</strong> {formatDate(selectedEvent.datetime)}</p>
            )}
            {selectedEvent.description && (
              <p><strong>Description:</strong> {selectedEvent.description}</p>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <Button type="primary" onClick={() => { if (mapInstance) mapInstance.flyTo([selectedEvent.lat, selectedEvent.lng], 16); }}>Focus on Map</Button>
              <Button onClick={() => getDirections(selectedEvent)}>Get directions</Button>
              <Button type={isSaved(selectedEvent.id) ? 'default' : 'dashed'} onClick={() => toggleSaveEvent(selectedEvent.id)}>
                {isSaved(selectedEvent.id) ? 'Saved' : 'Save event'}
              </Button>
              <Button onClick={() => shareEvent(selectedEvent)}>Share</Button>
            </div>
          </div>
        )}
      </Drawer>
    </Row>
  );
}