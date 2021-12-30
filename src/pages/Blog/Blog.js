import { Button, Row, Col, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import Post from "./Post";
import { apiGetBlog, apiPostBlog, apiUpload, api_url } from "../../utils/Api";
import axios from "axios";
import { UserContext } from "../../utils/UserContext";

const BLOG_DATA = [
  {
    author: "Nguyễn Văn A",
    date_posted: "2021-11-12",
    content: "Có ai làm được bài này không?",
    attachment:
      "https://scontent.fhan2-4.fna.fbcdn.net/v/t1.18169-9/25659234_563289877341634_8836860418612025611_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=cdbe9c&_nc_ohc=PV4TUD0CFVgAX8wOka8&_nc_ht=scontent.fhan2-4.fna&oh=00_AT87o5gJf2aVY7CnSlRglTI--EpgMd3ECowY1YYbILv0Jw&oe=61F24CF4",
  },
  {
    author: "Nguyễn Văn B",
    date_posted: "2021-11-13",
    content: "Có đề này khó, ai làm được không?",
    attachment:
      "https://scontent.fhan2-4.fna.fbcdn.net/v/t1.18169-9/25659234_563289877341634_8836860418612025611_n.jpg?_nc_cat=100&ccb=1-5&_nc_sid=cdbe9c&_nc_ohc=PV4TUD0CFVgAX8wOka8&_nc_ht=scontent.fhan2-4.fna&oh=00_AT87o5gJf2aVY7CnSlRglTI--EpgMd3ECowY1YYbILv0Jw&oe=61F24CF4",
  },
];

export default function Blog() {
  const { user } = useContext(UserContext);
  const [blogData, setBlogData] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    apiGetBlog().then((r) => {
      // console.log(r.data.results);
      setBlogData(r.data.results);
    });
  }, []);

  const renderBlogs = () => {
    return blogData.map((blog, key) => {
      return <Post key={key} data={blog}></Post>;
    });
  };

  const handlePost = (e) => {
    if (user) {
      let formData = new FormData();
      formData.append("attached_file", fileList[0]?.originFileObj);

      axios
        .post(`${api_url}/upload/`, formData)
        .finally((res) => {
          let data = {
            attachment: res?.data?.attached_file,
            content: e.content,
            user_id: user.id,
          };
          apiPostBlog(data)
            .then((r) => {
              console.log(r);
            })
            .catch((r) => console.log(r));
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  return (
    <Row className="BlogPage px-5">
      <Col span={24}>
        <div>
          <h6>Đăng bài viết mới</h6>
          <Form onFinish={handlePost}>
            <Form.Item
              // label="content"
              placeholder="Nội dung"
              name="content"
              rules={[
                {
                  required: true,
                  message: "Nội dung bài viết không được để trống!",
                },
              ]}
            >
              <Input.TextArea autoSize={false} />
            </Form.Item>

            <Form.Item name="attached_file">
              <Upload
                maxCount={1}
                name="attached_file"
                action={`${api_url}/upload`}
                listType="picture"
                onChange={({ fileList }) => {
                  console.log("fileList", fileList);
                  setFileList(fileList);
                }}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Đăng
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div> {blogData ? renderBlogs() : ""}</div>
      </Col>
    </Row>
  );
}
