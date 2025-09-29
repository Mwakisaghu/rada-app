import React from "react";
import { Layout } from "antd";
import HeaderBar from "./components/HeaderBar";
import MapView from "./views/MapView";
import Highlights from "./views/Highlights";
import "./styles.css";   // ✅ relative import

const { Content } = Layout;

export default function App() {
  const handleMenuClick = () => {
    // toggle side drawer or menu (for mobile)
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderBar onMenuClick={handleMenuClick} />
      <Content style={{ padding: "16px", marginTop: 64 }}>
        <Highlights />
        <MapView />
      </Content>
    </Layout>
  );
}