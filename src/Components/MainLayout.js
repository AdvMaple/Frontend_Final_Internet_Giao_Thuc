import {
  CalendarOutlined,
  RightCircleOutlined,
  CommentOutlined,
  UserOutlined,
  FileOutlined,
  PieChartOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import { useNavigate } from "react-router-dom";

function RouteCard(props) {
  let navigate = useNavigate();

  return (
    <>
      <div
        className="RouteCard rounded p-1"
        onClick={() => {
          navigate(props.url);
        }}
      >
        <div
          className="d-flex p-2 rounded-top "
          style={{ background: props.background }}
        >
          <div className="d-flex flex-column left">
            <span style={{ fontSize: "1.5rem" }}>{props.title}</span>
            <span style={{ fontSize: "1rem" }}>{props.des}</span>
          </div>
          <div className="mx-2 right">{props.icon}</div>
        </div>

        <div
          className="d-flex justify-content-center align-items-center rounded-bottom"
          style={{ background: props.background2 }}
        >
          <span className="mx-1">Xem thêm</span> <RightCircleOutlined />
        </div>
      </div>
    </>
  );
}

export default function MainLayout() {
  return (
    <div className="cw">
      <Row>
        <Col span={8}>
          <RouteCard
            title="Công việc"
            des="Việc cần làm, deadline..."
            background={"hsl(0, 80%, 50%)"}
            background2={"hsl(0, 50%, 50%)"}
            icon={<CalendarOutlined style={{ fontSize: "5em" }} />}
            url="todo"
          />
        </Col>
        <Col span={8}>
          <RouteCard
            title="Trao đổi"
            des="Đọc gửi thư điện tử"
            background={"hsl(60, 100%, 50%)"}
            background2={"hsl(60, 50%, 50%)"}
            url="mail"
            icon={<CommentOutlined style={{ fontSize: "5em" }} />}
          />
        </Col>
        <Col span={8}>
          <RouteCard
            title="Bảng tin"
            des="Các hoạt động của lớp học"
            background={"hsl(40, 100%, 50%)"}
            background2={"hsl(40, 50%, 50%)"}
            url="blog"
            icon={<BellOutlined style={{ fontSize: "5em" }} />}
          />
        </Col>
      </Row>

      <Row>
        <Col span={8}>
          <RouteCard
            title="Bảng điểm"
            des="Điểm số của từng sinh viên"
            background={"hsl(20, 100%, 50%)"}
            background2={"hsl(20, 50%, 50%)"}
            url="score"
            icon={<PieChartOutlined style={{ fontSize: "5em" }} />}
          />
        </Col>
        <Col span={8}>
          <RouteCard
            title="Sinh viên"
            des="Thông tin cá nhân của từng sinh viên..."
            background={"hsl(180, 100%, 50%)"}
            background2={"hsl(180, 50%, 50%)"}
            url="student"
            icon={<UserOutlined style={{ fontSize: "5em" }} />}
          />
        </Col>
        <Col span={8}>
          <RouteCard
            title="Thư viện"
            des="Bài giảng, tạp chí..."
            background={"hsl(120, 100%, 50%)"}
            background2={"hsl(120, 50%, 50%)"}
            url="library"
            icon={<FileOutlined style={{ fontSize: "5em" }} />}
          />
        </Col>
      </Row>
    </div>
  );
}
