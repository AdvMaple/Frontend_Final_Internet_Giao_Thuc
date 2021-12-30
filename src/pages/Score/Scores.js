import { ScoresChart } from "./ScoresChart";
import { Table, Row, Col, Form, Input, Button } from "antd";
import ClassList from "../Student/ClassList";
import { apiGetClass, apiGetStudent, apiPostClass } from "../../utils/Api";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/UserContext";

const SCORES_DATA = [
  {
    names: "Vũ Quang Huy",
    studentId: "B18DCVT062",
    ccScore: "9",
    thScore: "10",
    finalScore: "10",
  },
  {
    names: "Kiều Mạnh Dũng",
    studentId: "B18DCVT062",
    ccScore: "7",
    thScore: "10",
    finalScore: "10",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "9",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "5",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "6",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "7",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "5",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "4",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "9.5",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "9",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "9",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "9",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "9",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "9",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "9",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "9",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "9",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "9",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "9",
  },
  {
    names: "Nguyễn Văn A",
    studentId: "B18DCVT062",
    ccScore: "1",
    thScore: "8",
    finalScore: "9",
  },
];

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

export default function Scores() {
  const { user } = useContext(UserContext);
  const [classList, setClassList] = useState([]);
  const [students, setStudents] = useState([]);
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
  let scoreArray = [];
  useEffect(() => {
    if (user) {
      apiGetClass(user).then((r) => {
        setClassList(r.data.results);
      });
    }
  }, []);

  const columns = [
    { title: "Họ và tên", key: "name", dataIndex: "name" },
    { title: "Mã sinh viên", key: "studentId", dataIndex: "studentId" },
    { title: "Điểm chuyên cần (10%)", key: "diem_CC", dataIndex: "diem_CC" },
    { title: "Điểm thực hành (20%)", key: "diem_TH", dataIndex: "diem_TH" },
    { title: "Điểm cuối kỳ (70%)", key: "diem_Final", dataIndex: "diem_Final" },
    {
      title: "Điểm tổng kết",
      key: "totalScore",
      render: (item) => {
        // console.log(item);
        let final = parseFloat(item.diem_Final);
        let cc = parseFloat(item.diem_CC);
        let th = parseFloat(item.diem_TH);
        let total = (final * 70) / 100 + (cc * 10) / 100 + (th * 20) / 100;
        scoreArray.push(total);
        return `${total}`;
      },
    },
  ];

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

  const handleAddClass = (e) => {
    if (user) {
      let data = {
        name: e.name,
        user_id: user?.id,
      };
      apiPostClass(data)
        .then((r) => {})
        .catch((r) => console.log(r));
    }
  };

  return (
    <div className="ScorePage">
      <Row>
        <Col span={4}>
          <ClassList list={classList} onClick={handleChangeClass} />
          <AddClass onFinish={handleAddClass}></AddClass>
        </Col>
        <Col span={24 - 4}>
          <Table columns={columns} dataSource={students} />
        </Col>
      </Row>
      <div style={{ width: "450px" }}>
        <ScoresChart data={scoreArray} />
      </div>
    </div>
  );
}
