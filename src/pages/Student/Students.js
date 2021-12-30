import { Outlet } from "react-router-dom";
import {
  Checkbox,
  Col,
  Table,
  Button,
  Radio,
  Row,
  Form,
  Input,
  Modal,
  InputNumber,
} from "antd";
import { GenderChart } from "./GenderChart";
import TienHocChart from "./TienHocChart";
import ClassList from "./ClassList";
import { apiGetClass, apiGetStudent, apiPostClass } from "../../utils/Api";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/UserContext";

function StudentEditModal(props) {
  const { studentData } = props;
  return (
    <Modal visible={props.visible} onCancel={props.onCancel}>
      <Form onFinish={props.onFinish}>
        <Form.Item label="Họ và tên" name="name">
          <Input placeholder={studentData.name}></Input>
        </Form.Item>
        <Form.Item label="Mã sinh viên" name="studentId">
          <Input placeholder={studentData.studentId}></Input>
        </Form.Item>
        <Form.Item label="Nơi ở hiện tại" name="currentResident">
          <Input placeholder={studentData.currentResident}></Input>
        </Form.Item>
        <Form.Item label="Quê quán" name="placeOfBirth">
          <Input placeholder={studentData.placeOfBirth}></Input>
        </Form.Item>
        <Form.Item label="Giới tính" name="isMale">
          <Checkbox checked={studentData.isMale}></Checkbox>
        </Form.Item>
        <Form.Item label="Đã đóng học phí" name="hasPaidTuition">
          <Checkbox checked={studentData.hasPaidTuition}></Checkbox>
        </Form.Item>
        {/* <Form.Item name="diem_CC">
          <InputNumber min="0" max="10" step="0.1"></InputNumber>
        </Form.Item>
        <Form.Item name="diem_TH">
          <InputNumber min="0" max="10" step="0.1"></InputNumber>
        </Form.Item>
        <Form.Item name="diem_Final">
          <InputNumber min="0" max="10" step="0.1"></InputNumber>
        </Form.Item> */}
      </Form>
    </Modal>
  );
}

function AddClass(props) {
  return (
    <div>
      <Form onFinish={props.onFinish}>
        <Form.Item name="name">
          <Input></Input>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm lớp
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default function Students() {
  const { user } = useContext(UserContext);
  const [classList, setClassList] = useState([]);
  const [currentClass, setCurrentClass] = useState();
  const [students, setStudents] = useState([]);
  const [editStudentModal, setEditStudentModal] = useState(false);
  const [student, setStudent] = useState({
    id: "",
    name: "",
    studentId: "",
    currentResident: "",
    placeOfBirth: "",
    isMale: "",
    hasPaidTuition: "",
    diem_CC: "",
    diem_TH: "",
    diem_Final: "",
    classId: "",
  });

  useEffect(() => {
    if (user) {
      apiGetClass(user).then((r) => {
        setClassList(r.data.results);
        setCurrentClass(classList[0]);
      });
    }
  }, []);

  const handleReloadClass = () => {};

  const handleChangeClass = (e) => {
    console.log(e);
    apiGetStudent(e)
      .then((r) => {
        // console.log(r.data.results);
        setStudents(r.data.results);
      })
      .catch((r) => {
        console.log(r);
      });
  };

  const columns = [
    { title: "Họ và tên", key: "name", dataIndex: "name" },
    {
      title: "Giới tính",
      key: "isMale",
      dataIndex: "isMale",
      render: (key) => {
        if (key === 1) return "Nam";
        return "Nữ";
      },
    },
    {
      title: "Nơi ở hiện tại",
      key: "currentResident",
      dataIndex: "currentResident",
    },
    { title: "Quê quán", key: "origin", dataIndex: "origin" },
    {
      title: "Đã đóng tiền học",
      key: "hasPaidTuition",
      dataIndex: "hasPaidTuition",
      render: (key) => {
        if (key === 0) {
          return <Radio></Radio>;
        }
        return <Radio checked></Radio>;
      },
    },
  ];

  function processGender() {
    let genderData = {
      m: 0,
      f: 0,
    };
    for (let i = 0; i < students.length; i = i + 1) {
      if (students[i]["isMale"] === 1) {
        genderData.m = genderData.m + 1;
      } else {
        genderData.f = genderData.f + 1;
      }
    }
    let data = [];
    for (let key in genderData) {
      // console.log();
      data.push(genderData[key]);
    }
    return data;
  }

  function processTienHoc() {
    let tienHocData = {
      y: 0,
      n: 0,
    };
    for (let i = 0; i < students.length; i = i + 1) {
      if (students[i]["hasPaidTuition"] === 1) {
        tienHocData.y = tienHocData.y + 1;
      } else {
        tienHocData.n = tienHocData.n + 1;
      }
    }
    let data = [];
    for (let key in tienHocData) {
      // console.log();
      data.push(tienHocData[key]);
    }
    return data;
  }

  const handleAddClass = (e) => {
    if (user) {
      let data = {
        name: e.name,
        user_id: user?.id,
      };
      apiPostClass(data)
        .then((r) => {
          handleReloadClass();
        })
        .catch((r) => console.log(r));
    }
  };

  const handleGetStudent = () => {};

  const handleRowClick = (record, rowIndex) => {
    return {
      onClick: (e) => {
        console.log(record);

        setEditStudentModal(!editStudentModal);
        setStudent(record);
      },
    };
  };
  return (
    <div className="StudentPage">
      <h1>Thông tin sinh viên: ID lớp {}</h1>{" "}
      <Button
        size="small"
        onClick={() => {
          handleReloadClass();
        }}
      >
        reload
      </Button>
      <Row>
        <Col span={4}>
          <ClassList list={classList} onClick={handleChangeClass} />
          <AddClass onFinish={handleAddClass}></AddClass>
        </Col>

        <Col span={24 - 4}>
          <Table
            columns={columns}
            dataSource={students}
            onRow={handleRowClick}
          />
        </Col>
      </Row>
      {/* <Outlet></Outlet> */}
      <div className="d-flex">
        <div style={{ width: "450px" }}>
          <GenderChart data={processGender()} />
        </div>

        <div style={{ width: "450px" }}>
          <TienHocChart data={processTienHoc()} />
        </div>
      </div>
      <StudentEditModal
        onCancel={() => {
          setEditStudentModal(!editStudentModal);
        }}
        visible={editStudentModal}
        studentData={student}
      />
    </div>
  );
}
