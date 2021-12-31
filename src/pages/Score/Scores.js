import { ScoresChart } from "./ScoresChart";
import {
  Table,
  Row,
  Col,
  Form,
  Input,
  Button,
  Pagination,
  Modal,
  Checkbox,
  InputNumber,
} from "antd";
import ClassList from "../Student/ClassList";
import {
  apiDeleteStudent,
  apiGetClass,
  apiGetStudent,
  apiPatchStudent,
  apiPostClass,
  apiPostStudent,
  openNotificationWithIcon,
} from "../../utils/Api";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/UserContext";

function StudentEditModal({
  visible,
  onCreate,
  onCancel,
  onDelete,
  studentData,
}) {
  const [form] = Form.useForm();
  const [data, setData] = useState();
  useEffect(() => {
    setData(studentData);
  }, [studentData]);

  return (
    <Modal
      visible={visible}
      title="Sửa thông tin sinh viên"
      okText="Sửa"
      cancelText="Hủy"
      onCancel={onCancel}
      footer={[
        <Button key="delete" onClick={onDelete} type="danger">
          Xóa
        </Button>,
        <Button key="back" onClick={onCancel}>
          Đóng
        </Button>,
        <Button
          key="save"
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                onCreate(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          type="primary"
        >
          Lưu
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          diem_CC: data?.diem_CC,
          diem_TH: data?.diem_TH,
          diem_Final: data?.diem_TH,
        }}
      >
        <div className="p-3">
          <Form.Item label="Họ và tên" name="name">
            <Input placeholder={data?.name}></Input>
          </Form.Item>
          <Form.Item label="Mã sinh viên" name="studentId">
            <Input placeholder={data?.studentId}></Input>
          </Form.Item>

          <Form.Item label="Điểm chuyên cần" name="diem_CC">
            <InputNumber min="0" max="10" step="0.01"></InputNumber>
          </Form.Item>

          <Form.Item label="Điểm thực hành" name="diem_TH">
            <InputNumber min="0" max="10" step="0.01"></InputNumber>
          </Form.Item>

          <Form.Item label="Điểm cuối kỳ" name="diem_Final">
            <InputNumber min="0" max="10" step="0.01"></InputNumber>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

function StudentCreateModal({ visible, onCreate, onCancel, current }) {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title={`Thêm sinh viên cho lớp`}
      okText="Thêm mới"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        name="form_in_modal"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        <div className="p-3">
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Họ tên không được bỏ trống!",
              },
            ]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Mã sinh viên"
            name="studentId"
            rules={[
              {
                required: true,
                message: "Mã sinh viên không được bỏ trống!",
              },
            ]}
          >
            <Input></Input>
          </Form.Item>

          <Form.Item label="Điểm chuyên cần" name="diem_CC">
            <InputNumber
              defaultValue="0"
              min="0"
              max="10"
              step="0.01"
            ></InputNumber>
          </Form.Item>

          <Form.Item label="Điểm thực hành" name="diem_TH">
            <InputNumber
              defaultValue="0"
              min="0"
              max="10"
              step="0.01"
            ></InputNumber>
          </Form.Item>

          <Form.Item label="Điểm cuối kỳ" name="diem_Final">
            <InputNumber
              defaultValue="0"
              min="0"
              max="10"
              step="0.01"
            ></InputNumber>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
}

function AddClass(props) {
  return (
    <div className="mt-3">
      <Form onFinish={props.onFinish}>
        <Form.Item name="name">
          <Input placeholder="Tên lớp"></Input>
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
  const [pagination, setPagination] = useState();
  const [editStudentModal, setEditStudentModal] = useState(false);
  const [createStudentModal, setCreateStudentModal] = useState(false);
  const [currentClass, setCurrentClass] = useState();
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
      let data = {
        id: user.id,
      };
      apiGetClass(data).then((r) => {
        setClassList(r.data.results);
        setPagination(r.data);
      });
    }
  }, []);

  const handleEditStudent = async (e) => {
    console.log("form: ", e);
    console.log("student", student);

    setEditStudentModal(!editStudentModal);
    let data = {
      id: student.id,
      classId: currentClass,
      studentId: e?.studentId ? e?.studentId : student?.studentId,
      currentResident: e?.currentResident
        ? e?.currentResident
        : student?.currentResident,
      placeOfBirth: e?.placeOfBirth ? e?.placeOfBirth : student?.placeOfBirth,
      isMale: e?.isMale ? e?.isMale : student?.isMale,
      hasPaidTuition: e?.hasPaidTuition
        ? e?.hasPaidTuition
        : student?.hasPaidTuition,
      diem_CC: e?.diem_CC ? e?.diem_CC : student?.diem_CC,
      diem_TH: e?.diem_TH ? e?.diem_TH : student?.diem_TH,
      diem_Final: e?.diem_Final ? e?.diem_Final : student?.diem_Final,
      name: e?.name ? e?.name : student?.name,
    };
    const r = await apiPatchStudent(data);
    if (r.status === 200) {
      openNotificationWithIcon("success", "Sửa thông tin học sinh thành công");
    } else {
      openNotificationWithIcon(
        "error",
        "Đã có lỗi trong quá trình sửa thông tin"
      );
    }
    console.log(currentClass);
    apiGetStudent(currentClass)
      .then((r) => {
        setStudents(r.data.results);
      })
      .catch((r) => {
        console.log(r);
      });
  };

  const handleCreateStudent = async (e) => {
    setCreateStudentModal(!createStudentModal);
    console.log(currentClass);

    if (currentClass) {
      let data = {
        id: student.id,
        classId: currentClass,
        studentId: e?.studentId ? e?.studentId : student?.studentId,
        currentResident: e?.currentResident
          ? e?.currentResident
          : student?.currentResident,
        placeOfBirth: e?.placeOfBirth ? e?.placeOfBirth : student?.placeOfBirth,
        isMale: e?.isMale ? e?.isMale : student?.isMale,
        hasPaidTuition: e?.hasPaidTuition
          ? e?.hasPaidTuition
          : student?.hasPaidTuition,
        diem_CC: e?.diem_CC ? e?.diem_CC : student?.diem_CC,
        diem_TH: e?.diem_TH ? e?.diem_TH : student?.diem_TH,
        diem_Final: e?.diem_Final ? e?.diem_Final : student?.diem_Final,
        name: e?.name ? e?.name : student?.name,
      };
      const r = await apiPostStudent(data);
      if (r.status === 201) {
        openNotificationWithIcon("success", "Thêm học sinh thành công");
      } else {
        openNotificationWithIcon(
          "error",
          "Đã có lỗi trong quá trình thêm học sinh"
        );
      }
      console.log(currentClass);
      apiGetStudent(currentClass)
        .then((r) => {
          setStudents(r.data.results);
        })
        .catch((r) => {
          console.log(r);
        });
    } else {
      openNotificationWithIcon("error", "Bạn phải chọn lớp trước!");
    }
  };

  const handleChangePage = (e) => {
    let data = {
      id: user.id,
      page: e,
    };
    apiGetClass(data).then((r) => {
      setClassList(r.data.results);
      setCurrentClass(classList[0]);
    });
  };

  let scoreArray = [];
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
    setCurrentClass(e);
    apiGetStudent(e)
      .then((r) => {
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

  const handleRowClick = (record, rowIndex) => {
    return {
      onClick: (e) => {
        setEditStudentModal(!editStudentModal);
        setStudent(record);
      },
    };
  };

  const handleDeleteStudent = async () => {
    console.log("delete", student.id);
    setEditStudentModal(!editStudentModal);
    const r = await apiDeleteStudent(student.id);
    console.log(r);
    if (r.status === 204) {
      openNotificationWithIcon("success", "Xóa học sinh thành công");
    } else {
      openNotificationWithIcon("error", "Đã có lỗi khi xóa học sinh");
    }
    apiGetStudent(currentClass)
      .then((r) => {
        setStudents(r.data.results);
      })
      .catch((r) => {
        console.log(r);
      });
  };

  return (
    <div className="ScorePage">
      <Row>
        <Col span={4}>
          <ClassList
            current={currentClass}
            list={classList}
            onClick={handleChangeClass}
          />
          <Pagination
            onChange={handleChangePage}
            defaultCurrent={1}
            total={pagination?.count ? pagination?.count : 1}
          ></Pagination>
          <AddClass onFinish={handleAddClass}></AddClass>
          <Button
            onClick={() => {
              setCreateStudentModal(!createStudentModal);
            }}
          >
            Thêm sinh viên
          </Button>
        </Col>
        <Col span={24 - 4}>
          <Table
            onRow={handleRowClick}
            columns={columns}
            dataSource={students}
            pagination={false}
          />
        </Col>
      </Row>
      <div className="bg" style={{ width: "450px" }}>
        <ScoresChart data={scoreArray} />
      </div>
      <StudentEditModal
        onCreate={handleEditStudent}
        onCancel={() => {
          setEditStudentModal(!editStudentModal);
        }}
        visible={editStudentModal}
        studentData={student}
      />
      <StudentCreateModal
        onCreate={handleCreateStudent}
        onCancel={() => {
          setCreateStudentModal(!createStudentModal);
        }}
        onDelete={handleDeleteStudent}
        visible={createStudentModal}
      />
    </div>
  );
}
