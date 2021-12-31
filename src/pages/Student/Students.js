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
  Pagination,
} from "antd";
import { GenderChart } from "./GenderChart";
import TienHocChart from "./TienHocChart";
import ClassList from "./ClassList";
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
          hasPaidTuition: data?.hasPaidTuition,
          isMale: data?.isMale,
        }}
      >
        <div className="p-3">
          <Form.Item label="Họ và tên" name="name">
            <Input placeholder={data?.name}></Input>
          </Form.Item>
          <Form.Item label="Mã sinh viên" name="studentId">
            <Input placeholder={data?.studentId}></Input>
          </Form.Item>
          <Form.Item label="Nơi ở hiện tại" name="currentResident">
            <Input placeholder={data?.currentResident}></Input>
          </Form.Item>
          <Form.Item label="Quê quán" name="placeOfBirth">
            <Input placeholder={data?.placeOfBirth}></Input>
          </Form.Item>
          <Form.Item
            label="Giới tính nam"
            name="isMale"
            valuePropName="checked"
          >
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item
            label="Đã đóng học phí"
            name="hasPaidTuition"
            valuePropName="checked"
          >
            <Checkbox></Checkbox>
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
          <Form.Item label="Nơi ở hiện tại" name="currentResident">
            <Input></Input>
          </Form.Item>
          <Form.Item label="Quê quán" name="placeOfBirth">
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Giới tính nam"
            name="isMale"
            valuePropName="checked"
            rules={[
              {
                required: true,
                message: "Giới tính không được bỏ trống!",
              },
            ]}
          >
            <Checkbox></Checkbox>
          </Form.Item>

          <Form.Item
            label="Đã đóng học phí"
            name="hasPaidTuition"
            valuePropName="checked"
          >
            <Checkbox></Checkbox>
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

export default function Students() {
  const { user } = useContext(UserContext);
  const [classList, setClassList] = useState([]);
  const [currentClass, setCurrentClass] = useState();
  const [students, setStudents] = useState([]);
  const [editStudentModal, setEditStudentModal] = useState(false);
  const [createStudentModal, setCreateStudentModal] = useState(false);
  const [pagination, setPagination] = useState();
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

  const handleReloadClass = (page) => {
    if (user) {
      let data = {
        id: user.id,
      };
      apiGetClass(data).then((r) => {
        setClassList(r.data.results);
        setPagination(r.data);
      });
    }
  };

  const handleChangeClass = (e) => {
    console.log("Change Class", e);
    setCurrentClass(e);
    apiGetStudent(e)
      .then((r) => {
        setStudents(r.data.results);
      })
      .catch((r) => {
        console.log(r);
      });
  };

  let tienHoc = {
    y: 0,
    n: 0,
  };

  let gender = {
    m: 0,
    f: 0,
  };

  const columns = [
    { title: "Họ và tên", key: "name", dataIndex: "name" },
    {
      title: "Giới tính",
      key: "isMale",
      dataIndex: "isMale",
      render: (key) => {
        if (key == 1) {
          gender.m = gender.m + 1;
          return "Nam";
        }
        gender.f = gender.f + 1;
        return "Nữ";
      },
    },
    {
      title: "Nơi ở hiện tại",
      key: "currentResident",
      dataIndex: "currentResident",
    },
    { title: "Quê quán", key: "placeOfBirth", dataIndex: "placeOfBirth" },
    {
      title: "Đã đóng tiền học",
      key: "hasPaidTuition",
      dataIndex: "hasPaidTuition",
      render: (key) => {
        if (key === false) {
          tienHoc.n = tienHoc.n + 1;
          return <p>Chưa đóng</p>;
        }
        if (key === true) {
          tienHoc.y = tienHoc.y + 1;
          return <p>Đã đóng</p>;
        }
      },
    },
  ];

  const handleAddClass = (e) => {
    if (user) {
      let data = {
        name: e.name,
        user_id: user?.id,
      };
      apiPostClass(data)
        .then((r) => {
          console.log(r);
          handleReloadClass();
        })
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
    apiGetStudent(currentClass)
      .then((r) => {
        setStudents(r.data.results);
      })
      .catch((r) => {
        console.log(r);
      });
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

  const handleCreateStudent = async (e) => {
    setCreateStudentModal(!createStudentModal);
    console.log(currentClass);

    if (currentClass) {
      let data = {
        name: e.name,
        studentId: e.studentId,
        isMale: e.isMale,
        hasPaidTuition: e.hasPaidTuition,
        currentResident: e.currentResident,
        placeOfBirth: e.placeOfBirth,
        classId: currentClass,
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

  return (
    <div className="StudentPage">
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
          <div className="p-2 my-2" style={{ background: "white" }}>
            <AddClass onFinish={handleAddClass}></AddClass>
            <Button
              onClick={() => {
                setCreateStudentModal(!createStudentModal);
              }}
            >
              Thêm sinh viên
            </Button>
          </div>
        </Col>

        <Col span={24 - 4}>
          <Table
            columns={columns}
            dataSource={students}
            onRow={handleRowClick}
            pagination={false}
          />
        </Col>
      </Row>
      {/* <Outlet></Outlet> */}
      <div className="d-flex">
        <div style={{ width: "450px" }}>
          <GenderChart data={gender} />
        </div>

        <div style={{ width: "450px" }}>
          <TienHocChart data={tienHoc} />
        </div>
      </div>
      <StudentEditModal
        onCreate={handleEditStudent}
        onCancel={() => {
          setEditStudentModal(!editStudentModal);
        }}
        onDelete={handleDeleteStudent}
        visible={editStudentModal}
        studentData={student}
      />
      <StudentCreateModal
        onCreate={handleCreateStudent}
        onCancel={() => {
          setCreateStudentModal(!createStudentModal);
        }}
        visible={createStudentModal}
      />
    </div>
  );
}
