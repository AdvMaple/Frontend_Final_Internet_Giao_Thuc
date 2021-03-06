import { Button, Row, Col, Form, Input, Empty, Pagination } from "antd";
import { useContext, useEffect, useState } from "react";
import TodoDetail from "./TodoDetail";
import TodoList from "./TodoList";
import {
  apiDeleteTodoList,
  apiGetUserTodoList,
  apiGetUserTodoListDetail,
  apiPatchUserTodoListDetail,
  apiPostTodoDetail,
  apiPostUserTodoList,
  openNotificationWithIcon,
} from "../../utils/Api";
import { UserContext } from "../../utils/UserContext";

export default function Todo() {
  const { user, setUser } = useContext(UserContext);
  const [list, setList] = useState([]);
  const [currentList, setCurrentList] = useState(0);
  const [pagination, setPagination] = useState();
  const [detail, setDetail] = useState([{ id: "", name: "", state: "" }]);
  let nextListurl = "";
  let prevListurl = "";

  useEffect(() => {
    if (user) {
      const { id } = user;
      apiGetUserTodoList({ user_id: id }).then((r) => {
        setList(r.data.results);
        setPagination(r.data);
      });
    }
  }, []);

  useEffect(async () => {
    const r = await apiGetUserTodoListDetail(currentList);
    setDetail(r.data.results);
  }, [currentList]);

  const handleReload = async () => {
    const { id } = user;
    const r = await apiGetUserTodoList({ user_id: id });
    console.log(r);
    if (r.data.next !== null) {
      nextListurl = r.data.next;
    }
    if (r.data.previous !== null) {
      prevListurl = r.data.previous;
    }
    setList(r.data.results);
  };

  const handleChangeList = async (list_id) => {
    setCurrentList(list_id);
  };

  const handleChangeState = async (e) => {
    console.log(e);

    let d = {
      id: e.id,
      state:
        e.changeType === "inc" ? parseInt(e.state) + 1 : parseInt(e.state) - 1,
    };
    console.log(d);
    const r = await apiPatchUserTodoListDetail(d);
    const r2 = await apiGetUserTodoListDetail(currentList);
    setDetail(r2.data.results);
  };

  const handleTodoCreate = async (e) => {
    if (user) {
      let data = {
        user_id: user?.id,
        name: e.name,
      };
      const r = await apiPostUserTodoList(data);
      if (r.status === 201) {
        openNotificationWithIcon("success", "T???o danh s??ch m???i th??nh c??ng");
      } else {
        openNotificationWithIcon("error", "Th???t b???i t???o danh s??ch m???i");
      }
      handleReload();
    }
  };

  const handleTodoDetailCreate = async (e) => {
    if (user) {
      if (e.name === undefined) return;
      let data = {
        name: e.name,
        list_id: currentList,
      };
      const r = await apiPostTodoDetail(data);
      console.log(r);
      if (r.status === 201) {
        openNotificationWithIcon("success", "Th??m m???i vi???c c???n l??m th??nh c??ng");
      } else {
        openNotificationWithIcon("error", "???? c?? l???i trong qu?? tr??nh th??m m???i");
      }
      const r2 = await apiGetUserTodoListDetail(currentList);
      setDetail(r2.data.results);
    }
  };

  const handleDeleteList = async () => {
    console.log("Delete");
    const r = await apiDeleteTodoList(currentList);
    console.log(r);
    if (r.status === 204) {
      openNotificationWithIcon("success", "X??a danh s??ch th??nh c??ng");
    }
    handleReload();
  };

  const handleChangePage = (e) => {
    if (user) {
      let data = {
        user_id: user.id,
        page: e,
      };
      apiGetUserTodoList(data).then((r) => {
        setList(r.data.results);
        setPagination(r.data);
      });
    }
  };

  return (
    <div className="TodoPage">
      <div>
        <h4>Danh s??ch vi???c c???n l??m</h4>
      </div>

      <Row className="mt-3">
        <Col span={6}>
          {list ? (
            <>
              <TodoList
                current={currentList}
                list={list}
                onClick={handleChangeList}
              />
              <Pagination
                onChange={handleChangePage}
                defaultCurrent={1}
                total={pagination?.count ? pagination?.count : 1}
              ></Pagination>
            </>
          ) : (
            <Empty />
          )}
          <div className="mt-3">
            <Form onFinish={handleTodoCreate}>
              <Form.Item name="name" noStyle>
                <Input placeholder="Th??m danh s??ch m???i"></Input>
              </Form.Item>
              <div className="mt-2">
                <Form.Item name="name" noStyle>
                  <Button type="primary" htmlType="submit">
                    T???o m???i
                  </Button>
                </Form.Item>
                <Button
                  className="mx-2"
                  type="danger"
                  onClick={handleDeleteList}
                >
                  X??a hi???n t???i
                </Button>
              </div>
            </Form>
          </div>

          <div className="mt-3">
            <Form onFinish={handleTodoDetailCreate}>
              <Form.Item name="name" noStyle>
                <Input placeholder="Th??m vi???c c???n l??m m???i"></Input>
              </Form.Item>
              <div className="mt-2">
                <Form.Item name="name" noStyle>
                  <Button type="primary" htmlType="submit">
                    T???o m???i
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </Col>

        <Col span={24 - 6}>
          {detail ? (
            <TodoDetail
              current={currentList}
              detail={detail}
              onChangeState={handleChangeState}
            />
          ) : (
            <Empty />
          )}
        </Col>
      </Row>
    </div>
  );
}
