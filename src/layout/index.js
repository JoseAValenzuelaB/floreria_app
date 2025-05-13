import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Sidebar, Menu, Icon, Dropdown } from "semantic-ui-react";
import PropTypes from "prop-types";
import { getUserBySession } from "../store/actions";
import formatter from "../utils/formatter";

// Custom styles
const sidebarStyle = {
  width: "250px",
  height: "100vh",
  backgroundColor: "#2c3e50",
  color: "#ecf0f1",
  paddingTop: "1rem",
  position: "fixed",
  top: 0,
  left: 0,
  boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out",
  zIndex: 1000,
};

const hiddenSidebarStyle = {
  transform: "translateX(-250px)",
};

const menuItemStyle = {
  color: "#ecf0f1",
  fontWeight: "bold",
  marginBottom: "1rem",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
};

const activeMenuItemStyle = {
  backgroundColor: "#34495e",
};

const topBarStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: "60px",
  backgroundColor: "#2c3e50",
  color: "#ecf0f1",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 1rem",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  zIndex: 999,
};

const contentStyle = {
  paddingTop: "60px", // Add padding to account for the fixed top bar
  transition: "margin-left 0.3s ease-in-out",
};

const userMenuStyle = {
  color: "#ecf0f1",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const buttonStyle = {
  position: "fixed",
  top: "15px",
  left: "15px",
  zIndex: 2000,
  backgroundColor: "transparent",
  color: "#ecf0f1",
  border: "none",
  padding: "0.5rem",
  cursor: "pointer",
  borderRadius: "4px",
};

const Layout = ({ routes, userData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check session when the component mounts
    const storageSession = window.localStorage.getItem("session");

    if (!storageSession) {
      navigate("/login");
    }

    if (storageSession) {
      getUserBySession(storageSession);
    }
  }, [navigate]);

  useEffect(() => {
    if (userData?.first_name) {
      setUsername(formatter.capitalize(userData.first_name));
    }
  }, [userData]);

  // Conditionally render the sidebar, hide it on the login page
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/opening-cash";
  const userRole = window.localStorage.getItem("role");

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Handle logout
  const handleLogout = () => {
    window.localStorage.removeItem("session");
    window.localStorage.removeItem("role");
    window.localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div>
      {!isLoginPage && (
        <button onClick={toggleSidebar} style={buttonStyle}>
          <Icon name={sidebarVisible ? "close" : "bars"} size="large" />
        </button>
      )}

      {/* Top Bar */}
      {!isLoginPage && (
        <div style={topBarStyle}>
          <div>
            <button onClick={toggleSidebar} style={buttonStyle}>
              <Icon name={sidebarVisible ? "close" : "bars"} size="large" />
            </button>
          </div>
          <div style={userMenuStyle}>
            <Dropdown
              trigger={
                <span>
                  <Icon name="user circle" size="large" />
                  {username || "Usuario"}
                </span>
              }
              pointing="top right"
              icon={null}
            >
              <Dropdown.Menu>
                <Dropdown.Item
                  icon="settings"
                  text="Cierre de caja"
                  as={Link}
                  to="/cash-report"
                />
                <Dropdown.Divider />
                <Dropdown.Item
                  icon="sign-out"
                  text="Cerrar sesión"
                  onClick={handleLogout}
                />
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      )}

      {/* Sidebar */}
      {!isLoginPage && (
        <Sidebar
          as={Menu}
          vertical
          visible={sidebarVisible}
          style={{
            ...sidebarStyle,
            ...(sidebarVisible ? {} : hiddenSidebarStyle),
          }}
        >
          <Menu.Item></Menu.Item>
          <Menu.Item></Menu.Item>
          <Menu.Item
            as={Link}
            onClick={() => setSidebarVisible(false)}
            to="/home"
            style={{
              ...menuItemStyle,
              ...(location.pathname === "/home" ? activeMenuItemStyle : {}),
            }}
          >
            <Icon name="home" /> Home
          </Menu.Item>
          <Menu.Item
            as={Link}
            onClick={() => setSidebarVisible(false)}
            to="/dashboard"
            style={{
              ...menuItemStyle,
              ...(location.pathname === "/dashboard"
                ? activeMenuItemStyle
                : {}),
            }}
          >
            <Icon name="dashboard" /> Dashboard
          </Menu.Item>
          <Menu.Item
            as={Link}
            onClick={() => setSidebarVisible(false)}
            to="/sales"
            style={{
              ...menuItemStyle,
              ...(location.pathname === "/sales" ? activeMenuItemStyle : {}),
            }}
          >
            <Icon name="dollar" /> Ventas
          </Menu.Item>
          <Menu.Item
            as={Link}
            onClick={() => setSidebarVisible(false)}
            to="/submitted-orders"
            style={{
              ...menuItemStyle,
              ...(location.pathname === "/submitted-orders"
                ? activeMenuItemStyle
                : {}),
            }}
          >
            <Icon name="money bill alternate" /> Pagar
          </Menu.Item>
          <Menu.Item
            as={Link}
            onClick={() => setSidebarVisible(false)}
            to="/events"
            style={{
              ...menuItemStyle,
              ...(location.pathname === "/events" ? activeMenuItemStyle : {}),
            }}
          >
            <Icon name="home" /> Eventos
          </Menu.Item>
          {userRole === "admin" && (
            <>
              <Menu.Item
                as={Link}
                onClick={() => setSidebarVisible(false)}
                to="/prices"
                style={{
                  ...menuItemStyle,
                  ...(location.pathname === "/prices"
                    ? activeMenuItemStyle
                    : {}),
                }}
              >
                <Icon name="barcode" /> Precios/Código Barras
              </Menu.Item>
              <Menu.Item
                as={Link}
                onClick={() => setSidebarVisible(false)}
                to="/users"
                style={{
                  ...menuItemStyle,
                  ...(location.pathname === "/users"
                    ? activeMenuItemStyle
                    : {}),
                }}
              >
                <Icon name="user" /> Usuarios
              </Menu.Item>
              <Menu.Item
                as={Link}
                onClick={() => setSidebarVisible(false)}
                to="/credit"
                style={{
                  ...menuItemStyle,
                  ...(location.pathname === "/credit"
                    ? activeMenuItemStyle
                    : {}),
                }}
              >
                <Icon name="money bill alternate outline" /> Créditos
              </Menu.Item>
              <Menu.Item
                as={Link}
                onClick={() => setSidebarVisible(false)}
                to="/clients"
                style={{
                  ...menuItemStyle,
                  ...(location.pathname === "/clients"
                    ? activeMenuItemStyle
                    : {}),
                }}
              >
                <Icon name="users" /> Clientes
              </Menu.Item>
            </>
          )}
        </Sidebar>
      )}

      {/* Main Content */}
      <div
        style={{
          ...contentStyle,
          marginLeft: !isLoginPage && sidebarVisible ? 250 : 0,
        }}
      >
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
            />
          ))}
          {/* Add a default route to handle undefined paths */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
};

Layout.propTypes = {
  routes: PropTypes.array.isRequired,
  getUserBySession: PropTypes.func,
  userData: PropTypes.object,
};

const actions = {
  getUserBySession,
};

const mapStateToProps = (state) => ({
  userData: state.app.userData,
});

export default connect(mapStateToProps, actions)(Layout);
