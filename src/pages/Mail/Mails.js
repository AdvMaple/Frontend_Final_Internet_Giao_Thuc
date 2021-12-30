import { Outlet } from "react-router-dom";
import { Modal, Table, Image } from "antd";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../utils/UserContext";
import { PaperClipOutlined } from "@ant-design/icons";
import { getBeautifyDate, getUserMail } from "../../utils/Api";

const MAILS_LIST = [
  {
    id: 0,
    sender: "Học sinh A",
    subject: "Về việc xin tăng thời gian làm bài",
    sent_time: "3 giờ trước",
    content: "rtyuiol,ads",
  },
  {
    id: 1,
    sender: "Học sinh B",
    subject: "Về việc xin phép gia hạn bài tập",
    sent_time: "4 giờ trước",
    content: "rtyuiol,ads",
  },
  {
    id: 2,
    sender: "Học sinh C",
    subject: "Về việc gia hạn bài tập",
    sent_time: "4 giờ trước",
    content: "rtyuiol,ads",
  },
  {
    id: 3,
    sender: "Học sinh D",
    subject: "Về việc đổi điểm tiếng anh",
    content: "rtyuiol,ads",
    attachment: "asd",
    sent_time: "4 giờ trước",
  },
  {
    id: 4,
    sender: "Học sinh E",
    subject: "Về việc miễn giảm học phí",
    content: "rtyuiol,ads",
    sent_time: "4 giờ trước",
  },
];

export default function Mails() {
  let navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [mails, setMails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
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
      let data = {
        user_id: user.id,
      };
      getUserMail(data)
        .then((r) => {
          console.log(r.data.results);
          setMails(r.data.results);
        })
        .catch((r) => console.log(r));
    }
  }, []);

  const columns = [
    { title: "Người gửi", key: "author", dataIndex: "author" },
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
  ];

  const handleRowClick = (record, rowIndex) => {
    return {
      onClick: (e) => {
        setMail(record);
        setModalVisible(!modalVisible);
        navigate(`${record.id}`);
      },
    };
  };

  return (
    <div className="MailPage">
      <Table columns={columns} dataSource={mails} onRow={handleRowClick} />
      <Outlet></Outlet>
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
