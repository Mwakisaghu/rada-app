// src/components/HeaderBar.jsx
import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Typography,
  Drawer,
  Menu,
  Avatar,
  Dropdown,
  Select,
  Badge,
  Grid,
  Divider,
  Modal,
} from "antd";
import { MenuOutlined, UserOutlined, BellOutlined } from "@ant-design/icons";
import "./HeaderBar.css";

const { Title } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

export default function HeaderBar() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Nairobi");
  const [greeting, setGreeting] = useState("");
  const [notifications, setNotifications] = useState(3);
  const screens = useBreakpoint();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile">My Profile</Menu.Item>
      <Menu.Item key="settings">Settings</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const openLocationModal = () => setLocationModalVisible(true);
  const closeLocationModal = () => setLocationModalVisible(false);

  return (
    <>
      <Layout.Header className="header-bar">
        <div className="header-left">
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="header-menu-btn"
            onClick={showDrawer}
          />
          <div className="title-wrapper">
            <Title level={5} className="header-title animated-title">
              Rada
            </Title>
          </div>

          {/* Location filter moved next to title for both mobile and desktop */}
          <Select
            value={selectedLocation}
            onChange={setSelectedLocation}
            className="location-filter"
            size="small"
          >
            <Option value="Nairobi">
              Nairobi <span className="trending-badge">
                {/* subtle inline SVG flame icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden>
                  <path d="M12.001 2.08c-.02 0-.04.01-.06.01C9.32 3.03 7.5 5.5 7.5 8.5c0 3.99 4.5 6.5 4.5 6.5s4.5-2.51 4.5-6.5c0-3-1.82-5.47-4.439-6.42-.02 0-.03-.01-.06-.01zM12 21c-1.66 0-3-1.34-3-3 0-.55.45-1 1-1h4c.55 0 1 .45 1 1 0 1.66-1.34 3-3 3z" />
                </svg>
              </span>
            </Option>
            <Option value="Mombasa">Mombasa</Option>
            <Option value="Kisumu">Kisumu</Option>
            <Option value="Eldoret">Eldoret</Option>
          </Select>
        </div>

        {/* Mobile compact actions: bell + avatar inline */}
        {!screens.md && (
          <div className="mobile-actions">
            <Badge count={notifications} offset={[0, 5]}>
              <div className="icon-wrapper notification-icon">
                <BellOutlined
                  style={{ fontSize: 20, cursor: "pointer", color: "#fff" }}
                />
              </div>
            </Badge>

            <Dropdown overlay={profileMenu} placement="bottomRight" arrow>
              <Avatar size="small" icon={<UserOutlined />} />
            </Dropdown>
          </div>
        )}

        {/* Desktop/full actions */}
        {screens.md && (
          <div className="header-right">
            <Badge count={notifications} offset={[0, 5]}>
              <div className="icon-wrapper notification-icon">
                <BellOutlined
                  style={{
                    fontSize: "24px",
                    marginRight: "8px",
                    cursor: "pointer",
                    color: "#fff",
                  }}
                />
              </div>
            </Badge>

            <Button type="primary" className="post-btn glow-effect">
              Post Event
            </Button>

            <Dropdown overlay={profileMenu} placement="bottomRight" arrow>
              <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <Avatar size="large" icon={<UserOutlined />} />
                <span className="greeting-text">{greeting}</span>
              </div>
            </Dropdown>
          </div>
        )}
      </Layout.Header>

      {/* Mobile Drawer */}
      <Drawer
        title="Quick Menu"
        placement="left"
        closable
        onClose={closeDrawer}
        open={drawerVisible}
        className="mobile-drawer"
      >
        <div className="drawer-section">
          <p className="drawer-label">Your Location</p>
          {/* compact label that opens a modal picker for accessibility and compact UI */}
          <div
            className="location-label"
            role="button"
            tabIndex={0}
            onClick={openLocationModal}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openLocationModal();
            }}
          >
            <span className="location-text">{selectedLocation}</span>
            <span className="trending-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden>
                <path d="M12.001 2.08c-.02 0-.04.01-.06.01C9.32 3.03 7.5 5.5 7.5 8.5c0 3.99 4.5 6.5 4.5 6.5s4.5-2.51 4.5-6.5c0-3-1.82-5.47-4.439-6.42-.02 0-.03-.01-.06-.01zM12 21c-1.66 0-3-1.34-3-3 0-.55.45-1 1-1h4c.55 0 1 .45 1 1 0 1.66-1.34 3-3 3z" />
              </svg>
            </span>
          </div>
        </div>

        {/* location picker modal */}
        <Modal
          title="Choose location"
          open={locationModalVisible}
          onCancel={closeLocationModal}
          footer={null}
        >
          <Select
            value={selectedLocation}
            onChange={(val) => {
              setSelectedLocation(val);
            }}
            style={{ width: "100%" }}
            size="middle"
          >
            <Option value="Nairobi">Nairobi</Option>
            <Option value="Mombasa">Mombasa</Option>
            <Option value="Kisumu">Kisumu</Option>
            <Option value="Eldoret">Eldoret</Option>
          </Select>
          <div style={{ marginTop: 12, textAlign: "right" }}>
            <Button type="primary" onClick={closeLocationModal}>
              Done
            </Button>
          </div>
        </Modal>

        <Divider style={{ borderColor: "rgba(255,255,255,0.1)" }} />

        <div className="drawer-section notification-area">
          <Badge count={notifications}>
            <BellOutlined style={{ fontSize: "22px", color: "#fff" }} />
          </Badge>
          <span style={{ color: "#fff", marginLeft: "10px" }}>Notifications</span>
        </div>

        <Divider style={{ borderColor: "rgba(255,255,255,0.1)" }} />

        <Button type="primary" block className="drawer-post-btn">
          Add Event
        </Button>

        <Divider style={{ borderColor: "rgba(255,255,255,0.1)" }} />
          
      </Drawer>
    </>
  );
}
