import { Button, Row, Col, Form, Input } from "antd";
import { useContext, useEffect, useState } from "react";
import TodoDetail from "./TodoDetail";
import TodoList from "./TodoList";
import { apiGetUserTodoList, apiPostUserTodoList } from "../../utils/Api";
import { UserContext } from "../../utils/UserContext";

const ListAPI = [];
const ListDetail = [];

export default function Todo() {
  const { user, setUser } = useContext(UserContext);

  const [list, setList] = useState([]);
  const [currentList, setCurrentList] = useState(0);
  const [detail, setDetail] = useState();

  useEffect(() => {
    if (user) {
      const { id } = user;

      apiGetUserTodoList({ user_id: id }).then((r) => setList(r.data.results));
    }
    // setList(ListAPI);
    // setDetail(ListDetail[0]);
  }, []);

  const handleReload = () => {
    const { id } = user;
    apiGetUserTodoList({ user_id: id }).then((r) => {
      setList(r.data.results);
      console.log(r.data.results);
    });
  };

  const handleChangeList = (list_id) => {
    // console.log(list_id);
    setCurrentList(list_id);
    // setDetail(ListDetail[list_id]);
    // console.log(key);
  };

  const handleChangeStatus = (e) => {
    setDetail((pre) => {
      let item = pre.detail.find(
        (item) =>
          item.taskName === e.taskName && item.status === parseInt(e.status)
      );
      switch (e.changeType) {
        case "dec":
          item.status = item.status - 1;
          break;
        case "inc":
          item.status = item.status + 1;
          break;
        default:
          break;
      }
      return { ...pre, item };
    });
  };

  const handleTodoCreate = (e) => {
    if (user) {
      let data = {
        user_id: user?.id,
        name: e.name,
      };
      apiPostUserTodoList(data)
        .then((r) => {
          console.log(e);
        })
        .catch((r) => {
          console.log(r);
        });
      handleReload();
    }
  };

  return (
    <div className="TodoPage">
      <div>
        <Row>
          <h4>Todo Page: List {currentList}</h4>
        </Row>

        <Row>
          <Button type="primary">Thêm mới</Button>
          <Button type="danger">Xóa</Button>
          <Button onClick={handleReload} type="">
            Làm mới
          </Button>
        </Row>

        <Row>
          <Form onFinish={handleTodoCreate}>
            <Form.Item name="name">
              <Input placeholder="Tên danh sách"></Input>
            </Form.Item>

            <Form.Item name="name">
              <Button type="primary" htmlType="submit">
                Tạo mới
              </Button>
            </Form.Item>
          </Form>
        </Row>
      </div>

      <Row>
        <Col span={6}>
          {list ? (
            <TodoList
              current={currentList}
              list={list}
              onClick={handleChangeList}
            />
          ) : (
            "Không có dữ liệu"
          )}
        </Col>
        <Col span={24 - 6}>
          {detail ? (
            <TodoDetail detail={detail} onChangeStatus={handleChangeStatus} />
          ) : (
            "Không có dữ liệu"
          )}
        </Col>
      </Row>
    </div>
  );
}
