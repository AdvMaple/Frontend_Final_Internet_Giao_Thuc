import { Form, Input, Button, Checkbox, Row, Space, notification } from "antd";
import { useContext, useState } from "react";
import { apiSignIn } from "../utils/Api";
import { UserContext } from "../utils/UserContext";

const openNotificationWithIcon = (type, title, message) => {
  notification[type]({
    message: title,
    description: message,
  });
};

export default function LoginForm() {
  const { user, setUser } = useContext(UserContext);

  const [register, setRegister] = useState(false);

  const onFinish = (values) => {
    // console.log(user);
    // console.log(values);
    apiSignIn(values).then(({ data }) => {
      if (data.count === 1) {
        openNotificationWithIcon("success", "Đăng nhập thành công");
        // console.log(data.results[0]);
        setUser(data.results[0]);
        return;
      }
      openNotificationWithIcon("error", "Đăng nhập thất bại");
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <h3 className="mb-3">Trang quản lý lớp học</h3>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        {register ? (
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: register,
                message: "Please input your email!",
              },
              { type: "email" },
            ]}
          >
            <Input />
          </Form.Item>
        ) : (
          ""
        )}

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <div className="d-flex justify-content-center">
          <Form.Item wrapperCol={{ offset: 8, span: 16 }} className="mx-3">
            <Button type="primary" htmlType="submit">
              {register ? "Gửi" : "Đăng nhập"}
            </Button>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }} className="mx-3">
            <Button
              onClick={() => {
                setRegister(!register);
              }}
              type="primary"
            >
              {register ? "Đã có tài khoản" : "Đăng ký"}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}
