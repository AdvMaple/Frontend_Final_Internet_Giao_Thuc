import {
  Upload,
  Row,
  Col,
  Image,
  List,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Pagination,
} from "antd";
import { useState, useEffect } from "react";
import {
  apiGetAllCategory,
  apiGetBlog,
  apiGetBook,
  apiGetCategory,
  apiPostBook,
  apiPostCategory,
  api_url,
  openNotificationWithIcon,
} from "../../utils/Api";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

function CategoryList(props) {
  const [list, setList] = useState([{}]);
  const [pagination, setPagination] = useState();
  useEffect(() => {
    apiGetCategory()
      .then((r) => {
        setList(r.data.results);
        setPagination(r.data);
      })
      .catch((r) => console.log(r));
  }, []);

  const handleChangePage = (e) => {
    apiGetCategory({ page: e })
      .then((r) => {
        setList(r.data.results);
        setPagination(r.data);
      })
      .catch((r) => console.log(r));
  };

  return (
    <div className="" style={{ background: "white" }}>
      <List
        dataSource={list}
        renderItem={(item) => {
          return (
            <List.Item>
              <Button
                onClick={() => props.onChooseCategory(item)}
                className="mx-2"
              >
                {item.name}
              </Button>
            </List.Item>
          );
        }}
      />
      <Pagination
        defaultCurrent={1}
        onChange={handleChangePage}
        total={pagination?.count ? pagination?.count : 1}
      />
    </div>
  );
}

function BookList(props) {
  const [pagination, setPagination] = useState();

  return (
    <div className="mx-2 p-3" style={{ background: "white" }}>
      <List
        grid={{ gutter: 1, column: 5 }}
        dataSource={props.data}
        renderItem={(item) => {
          return (
            <div className="d-flex flex-column justify-content-center ">
              <div className="d-flex justify-content-center">
                <Image width={"13em"} src={item.url} />
              </div>
              <h6 className="text-center">{item.name}</h6>
            </div>
          );
        }}
      ></List>
      <Pagination
        defaultCurrent={1}
        onChange={props.onChangePage}
        total={
          props.pagination.pagination?.count
            ? props.pagination.pagination?.count
            : 1
        }
      />
    </div>
  );
}

const CategoryCreateForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Tạo mục mới"
      okText="Tạo"
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
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          name="name"
          label="Tên sách"
          rules={[
            {
              required: true,
              message: "Tên mục không được để trống!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const BookCreateForm = ({ visible, onCreate, onCancel }) => {
  const [category, setCategory] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    apiGetAllCategory().then((r) => {
      setCategory(r.data.results);
    });
  }, []);

  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Tạo sách mới"
      okText="Tạo"
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
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          name="name"
          label="Tên sách"
          rules={[
            {
              required: true,
              message: "Tên sách không được để trống!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="category"
          label="Tên mục"
          rules={[
            {
              required: true,
              message: "Tên mục không được để trống!",
            },
          ]}
        >
          <Select style={{ width: 120 }}>
            {category.map((cat) => {
              return <Select.Option value={cat.id}>{cat.name}</Select.Option>;
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="url"
          label="Đính kèm"
          rules={[
            {
              required: true,
              message: "Không được để trống đính kèm!",
            },
          ]}
        >
          <Upload
            maxCount={1}
            name="url"
            action={`${api_url}/upload`}
            listType="picture"
            onChange={({ fileList }) => {
              setFileList(fileList);
            }}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default function Library() {
  const [categoryModal, setCategoryModal] = useState(false);
  const [bookModal, setBookModal] = useState(false);
  const [books, setBooks] = useState();
  const [currentCat, setCurrentCat] = useState();
  const [pagination, setPagination] = useState();

  const handleCreateCategory = async (e) => {
    setCategoryModal(!categoryModal);
    const r = await apiPostCategory({ name: e.name });
    console.log(r);
    if (r.status === 201) {
      openNotificationWithIcon("success", "Tạo mục mới thành công");
    } else {
      openNotificationWithIcon("error", "Tạo mục mới thất bại");
    }
  };

  const handleCreateBook = (e) => {
    let formData = new FormData();
    formData.append("attached_file", e.url.fileList[0]?.originFileObj);
    axios
      .post(`${api_url}/upload/`, formData)
      .then(async (res) => {
        console.log(res);
        let data = {
          url: res?.data?.attached_file,
          category: e.category,
          name: e.name,
        };
        const r = await apiPostBook(data);
        console.log(r);
        if (r.status === 201) {
          openNotificationWithIcon("success", "Gửi tin nhắn thành công");
          const r = await apiGetBook({ category: currentCat });
          setBooks(r.data.results);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleChooseCategory = async (e) => {
    console.log("Change Cat: ", e);
    setCurrentCat(e.id);
    const r = await apiGetBook({ category: e.id });
    console.log(r.data);
    setPagination(r.data);
    setBooks(r.data.results);
  };

  const handleChangePage = async (page) => {
    const r = await apiGetBook({ category: currentCat, page: page });
    setPagination(r.data);
    setBooks(r.data.results);
  };

  return (
    <div className="LibraryPage">
      <Row>
        <Col span={6}>
          <Button
            className="mb-3"
            onClick={() => setCategoryModal(!categoryModal)}
          >
            Tạo mục mới
          </Button>
          <Button
            className="mb-3 mx-2"
            onClick={() => setBookModal(!bookModal)}
          >
            Tạo sách mới
          </Button>
          <CategoryList onChooseCategory={handleChooseCategory} />
        </Col>
        <Col span={24 - 6}>
          <BookList
            data={books}
            pagination={{ pagination, setPagination }}
            onChangePage={handleChangePage}
          />
        </Col>
      </Row>

      <CategoryCreateForm
        visible={categoryModal}
        onCreate={handleCreateCategory}
        onCancel={() => {
          setCategoryModal(!categoryModal);
        }}
      />
      <BookCreateForm
        visible={bookModal}
        onCreate={handleCreateBook}
        onCancel={() => {
          setBookModal(!bookModal);
        }}
      />
    </div>
  );
}
