import {
  Button,
  Row,
  Col,
  Form,
  Input,
  Upload,
  message,
  List,
  Pagination,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import Post from "./Post";
import {
  apiGetBlog,
  apiPostBlog,
  api_url,
  openNotificationWithIcon,
} from "../../utils/Api";
import axios from "axios";
import { UserContext } from "../../utils/UserContext";

export default function Blog() {
  const { user } = useContext(UserContext);
  const [blogData, setBlogData] = useState([]);
  const [pagination, setPagination] = useState();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    apiGetBlog().then((r) => {
      setBlogData(r.data.results);
      setPagination(r.data);
    });
  }, []);

  const handleChangePage = (e) => {
    apiGetBlog(e).then((r) => {
      setBlogData(r.data.results);
    });
  };

  const handlePost = (e) => {
    if (user && e.attached_file) {
      let formData = new FormData();
      formData.append("attached_file", fileList[0]?.originFileObj);
      axios
        .post(`${api_url}/upload/`, formData)
        .then((res) => {
          // console.log(res);
          let data = {
            attachment: res?.data?.attached_file,
            content: e.content,
            user_id: user.id,
          };
          apiPostBlog(data)
            .then((r) => {
              // console.log(r);
              openNotificationWithIcon("success", "Đăng bài thành công");
              apiGetBlog().then((r) => {
                setBlogData(r.data.results);
                setPagination(r.data);
              });
            })
            .catch((r) => console.log(r));
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else if (user) {
      let data = {
        content: e.content,
        user_id: user.id,
      };
      apiPostBlog(data)
        .then((r) => {
          console.log(r);
          openNotificationWithIcon("success", "Đăng bài thành công");
          apiGetBlog().then((r) => {
            setBlogData(r.data.results);
            setPagination(r.data);
          });
        })
        .catch((r) => console.log(r));
    } else {
      openNotificationWithIcon(
        "error",
        "Bạn phải đăng nhập để sử dụng chức năng này"
      );
    }
  };

  return (
    <Row className="BlogPage px-5">
      <Col span={24}>
        <div className="p-3" style={{ background: "white" }}>
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
        <div className="p-3" style={{ background: "white" }}>
          <List
            dataSource={blogData}
            renderItem={(item) => {
              return (
                <List.Item>
                  <Post data={{ ...item }}></Post>
                </List.Item>
              );
            }}
          ></List>
          <Pagination
            onChange={handleChangePage}
            defaultCurrent={1}
            total={pagination?.count ? pagination?.count : 1}
          ></Pagination>
        </div>
      </Col>
    </Row>
  );
}
