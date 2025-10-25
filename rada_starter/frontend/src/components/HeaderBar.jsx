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
  const [notifications, setNotifications] = useState(3); // demo: unread count
  const screens = useBreakpoint();

  useEffect(() => {
    // Dynamic greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  // Dropdown menu for profile actions
  const profileMenu = (
    <Menu>
      <Menu.Item key="profile">My Profile</Menu.Item>
      <Menu.Item key="settings">Settings</Menu.Item>
      <Menu.Item key="logout">Logout</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Layout.Header className="header-bar">
        {/* Left side: Menu button + Title + Location Filter */}
        <div className="header-left">
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="header-menu-btn"
            onClick={showDrawer}
          />
          <Title level={4} className="header-title animated-title">
            Rada
          </Title>

          {/* Location filter dropdown */}
          <Select
            value={selectedLocation}
            onChange={setSelectedLocation}
            className="location-filter"
            size="small"
          >
            <Option value="Nairobi">
              Nairobi <span className="trending-badge">🔥</span>
            </Option>
            <Option value="Mombasa">Mombasa</Option>
            <Option value="Kisumu">Kisumu</Option>
            <Option value="Eldoret">Eldoret</Option>
          </Select>
        </div>

        {/* Right side: Desktop vs Mobile actions */}
        <div className="header-right">
          {/* Notification bell */}
          <Badge count={notifications} offset={[0, 5]}>
            <BellOutlined
              style={{
                fontSize: "20px",
                marginRight: screens.md ? "16px" : "8px",
                cursor: "pointer",
                color: "#fff",
              }}
            />
          </Badge>

          {/* Show Post Event only on desktop */}
          {screens.md && (
            <Button type="primary" className="post-btn">
              Post Event
            </Button>
          )}

          {/* Profile dropdown */}
          <Dropdown overlay={profileMenu} placement="bottomRight" arrow>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <Avatar size="large" icon={<UserOutlined />} />
              {/* Hide greeting on mobile */}
              {screens.md && <span className="greeting-text">{greeting}</span>}
            </div>
          </Dropdown>
        </div>
      </Layout.Header>

      {/* Drawer for Mobile Menu */}
      <Drawer
        title="Menu"
        placement="left"
        closable={true}
        onClose={closeDrawer}
        open={drawerVisible}
      >
        <Menu mode="vertical" selectable={false}>
          <Menu.Item key="home">Home</Menu.Item>
          <Menu.Item key="highlights">Highlights</Menu.Item>
          <Menu.Item key="map">Map</Menu.Item>
          <Menu.Item key="profile">Profile</Menu.Item>
          {/* Post Event button inside drawer for mobile */}
          {!screens.md && (
            <Menu.Item key="post">
              <Button type="primary" block>
                Post Event
              </Button>
            </Menu.Item>
          )}
        </Menu>
      </Drawer>
    </>
  );
}