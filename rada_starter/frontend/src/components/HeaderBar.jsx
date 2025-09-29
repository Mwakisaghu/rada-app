// src/components/HeaderBar.jsx
import React, { useState } from "react";
import {
  Layout,
  Button,
  Typography,
  Drawer,
  Menu,
  Avatar,
  Dropdown,
  Select,
} from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import "./HeaderBar.css";

const { Title } = Typography;
const { Option } = Select;

export default function HeaderBar() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Nairobi");

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
          <Title level={4} className="header-title">
            Rada
          </Title>

          {/* Location filter dropdown */}
          <Select
            value={selectedLocation}
            onChange={setSelectedLocation}
            className="location-filter"
            size="small"
          >
            <Option value="Nairobi">Nairobi</Option>
            <Option value="Mombasa">Mombasa</Option>
            <Option value="Kisumu">Kisumu</Option>
            <Option value="Eldoret">Eldoret</Option>
          </Select>
        </div>

        {/* Right side: Desktop actions */}
        <div className="header-right">
          <Button type="primary" className="post-btn">
            Post Event
          </Button>

          {/* Profile dropdown */}
          <Dropdown overlay={profileMenu} placement="bottomRight" arrow>
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ marginLeft: "16px", cursor: "pointer" }}
            />
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
        </Menu>
      </Drawer>
    </>
  );
}