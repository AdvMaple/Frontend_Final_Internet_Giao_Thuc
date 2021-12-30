import { Menu, Row, Col, Button } from "antd";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utils/UserContext";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import LoginForm from "./LoginForm";

export default function Navbar(props) {
  let navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const renderRoute = () => {
    return props.route.map((route, key) => {
      return (
        <Menu.Item
          key={key}
          onClick={() => {
            navigate(route.url);
          }}
        >
          {route.name}
        </Menu.Item>
      );
    });
  };

  return (
    <nav>
      <Menu theme="" mode="horizontal">
        {renderRoute()}
        <Menu.Item key={"login"}>
          <div>
            <Avatar
              shape="circle"
              size="small"
              icon={user?.id ? "" : <UserOutlined />}
            >
              {user?.name}
            </Avatar>
            {user?.id ? (
              <Button
                onClick={() => {
                  setUser(null);
                  window.location.reload();
                }}
                className="mx-3"
                type="primary"
                size="small"
              >
                Đăng xuất
              </Button>
            ) : (
              ""
            )}
          </div>
        </Menu.Item>
      </Menu>
    </nav>
  );
}
