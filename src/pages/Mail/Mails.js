import { Outlet } from "react-router-dom";
import {
  Modal,
  Table,
  Image,
  Button,
  Form,
  Input,
  Upload,
  Pagination,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/UserContext";
import { PaperClipOutlined, UploadOutlined } from "@ant-design/icons";
import {
  apiDeleteMail,
  apiPostMail,
  getBeautifyDate,
  getUserMail,
} from "../../utils/Api";
import axios from "axios";
import { api_url, openNotificationWithIcon } from "../../utils/Api";

export default function Mails() {
  let navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [mails, setMails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pagination, setPagination] = useState({});
  const [fileList, setFileList] = useState([]);
  const [mail, setMail] = useState({
    id: "",
    author: "",
    subject: "",
    content: "",
    date_created: "",
    attachment: "",
    otherInfo: "",
  });

  useEffect(() => {
    if (user) {
      handleGetMail({ page: 1 });
    }
  }, []);

  const handleGetMail = (input) => {
    let data = {
      user_id: user.id,
      page: input?.page,
    };
    getUserMail(data)
      .then((r) => {
        console.log(r.data);
        setPagination({
          count: r.data.count,
          next: r.data.next,
          previous: r.data.previous,
        });
        setMails(r.data.results);
      })
      .catch((r) => console.log(r));
  };

  const columns = [
    { title: "Người nhận", key: "to", dataIndex: "to" },
    { title: "Chủ đề", key: "subject", dataIndex: "subject" },
    {
      title: "Đính kèm",
      key: "attachment",
      dataIndex: "attachment",
      render: (key) => {
        if (key) {
          return <PaperClipOutlined />;
        }
        return "";
      },
    },
    {
      title: "Thời gian nhận",
      key: "date_created",
      dataIndex: "date_created",
      render: (key) => {
        let time = new Date(key);
        let now = new Date();
        return `${time.getDay()}/${
          time.getMonth() + 1
        }/${time.getFullYear()} - ${time.getHours()}:${time.getMinutes()}`;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => {
        return <a onClick={() => handleDelete({ record })}>Xóa</a>;
      },
    },
  ];

  const handleRowClick = (record, rowIndex) => {
    return {
      onClick: (e) => {
        if (e.target.innerText !== "Xóa") {
          setMail(record);
          setModalVisible(!modalVisible);
          navigate(`${record.id}`);
        }
      },
    };
  };

  const handleDelete = async (e) => {
    const r = await apiDeleteMail({ id: e.record.id });
    console.log(r);
    if (r.status === 204) {
      openNotificationWithIcon("success", "Đã xóa tin nhắn");
      handleGetMail();
    }
  };

  const handleChangePage = (e) => {
    handleGetMail({ page: e });
  };

  const handlePost = async (e) => {
    console.log(e);
    if (user && e?.attachment) {
      let formData = new FormData();
      formData.append("attached_file", fileList[0]?.originFileObj);
      axios
        .post(`${api_url}/upload/`, formData)
        .then(async (res) => {
          // console.log(res);
          let data = {
            attachment: res?.data?.attached_file,
            content: e.content,
            to: e.to,
            subject: e.subject,
            author: user.id,
          };
          const r = await apiPostMail(data);
          console.log(r);
          if (r.status === 201) {
            openNotificationWithIcon("success", "Gửi tin nhắn thành công");
            let data = {
              user_id: user.id,
            };
            getUserMail(data)
              .then((r) => {
                setMails(r.data.results);
              })
              .catch((r) => console.log(r));
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else if (user) {
      let data = {
        content: e.content,
        to: e.to,
        subject: e.subject,
        author: user.id,
      };
      const r = await apiPostMail(data);
      console.log(r);
      if (r.status === 201) {
        openNotificationWithIcon("success", "Gửi tin nhắn thành công");
        let data = {
          user_id: user.id,
        };
        getUserMail(data)
          .then((r) => {
            setMails(r.data.results);
          })
          .catch((r) => console.log(r));
      }
    } else {
      openNotificationWithIcon(
        "error",
        "Bạn phải đăng nhập để sử dụng chức năng này"
      );
    }
  };

  const [createMailModal, setCreateMailModal] = useState(false);
  return (
    <div className="MailPage">
      {user ? (
        <Button onClick={() => setCreateMailModal(!createMailModal)}>
          {createMailModal ? "Đọc thư" : "Tạo thư mới"}
        </Button>
      ) : (
        ""
      )}

      {createMailModal ? (
        <div className="p-3 mt-3" style={{ background: "white" }}>
          <Form
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 16 }}
            onFinish={handlePost}
          >
            <Form.Item
              name="to"
              label="Địa chỉ người nhận"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Địa chỉ người nhận không được để trống!",
                },
              ]}
            >
              <Input></Input>
            </Form.Item>

            <Form.Item
              name="subject"
              label="Chủ đề"
              rules={[
                {
                  required: true,
                  message: "Chủ đề không được để trống!",
                },
              ]}
            >
              <Input></Input>
            </Form.Item>

            <Form.Item
              name="content"
              label="Nội dung"
              rules={[
                {
                  required: true,
                  message: "Nội dung không được để trống!",
                },
              ]}
            >
              <Input.TextArea></Input.TextArea>
            </Form.Item>

            <Form.Item name="attachment" label="Đính kèm">
              <Upload
                maxCount={1}
                name="attached_file"
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

            <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Gửi
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={mails}
            onRow={handleRowClick}
            pagination={false}
          />
          <Pagination
            defaultCurrent={1}
            total={pagination.count}
            onChange={handleChangePage}
            pageSize={10}
          />
        </>
      )}
      <Modal
        title={`${mail.subject} - ${getBeautifyDate(mail.date_created)}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(!modalVisible)}
        onOk={() => setModalVisible(!modalVisible)}
      >
        <p>{mail.sender}</p>
        <p>{mail.sent_time}</p>
        <p>{mail.content}</p>
        {mail?.attachment ? <Image src={mail?.attachment} /> : ""}
      </Modal>
    </div>
  );
}
