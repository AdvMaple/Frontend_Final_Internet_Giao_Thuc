import { Col, Row, Empty } from "antd";
import { useEffect, useState } from "react";
// import { useEffect } from "react";
import TodoItem from "./TodoItem";

export default function TodoDetail(props) {
  const [renderObj, setRenderObj] = useState({
    array1: [],
    array2: [],
    array3: [],
  });

  useEffect(() => {
    setRenderObj(() => filterTodo());
  }, [props]);

  function filterTodo() {
    let array1 = [];
    let array2 = [];
    let array3 = [];

    if (Array.isArray(props.detail)) {
      array1 = props.detail.filter((el) => {
        return el.state === 0;
      });

      array2 = props.detail.filter((el) => {
        return el.state === 1;
      });

      array3 = props.detail.filter((el) => {
        return el.state === 2;
      });
    }
    return { array1, array2, array3 };
  }

  const renderTodoItems = (array) => {
    return array.map((element, key) => {
      return (
        <TodoItem
          {...{ element }}
          key={key}
          onChangeState={props.onChangeState}
        ></TodoItem>
      );
    });
  };

  return (
    <div className="ml-3" style={{ background: "white" }}>
      <Row>
        <Col span={8} className="border">
          <h5 className="text-center">Chưa làm</h5>
        </Col>
        <Col span={8} className="border">
          <h5 className="text-center">Đang làm</h5>
        </Col>
        <Col span={8} className="border">
          <h5 className="text-center">Đã hoàn thành</h5>
        </Col>
      </Row>
      <Row className="border">
        <Col span={8} className="">
          {renderObj.array1.length !== 0 ? (
            renderTodoItems(renderObj.array1)
          ) : (
            <Empty />
          )}
        </Col>
        <Col span={8}>
          {renderObj.array2.length !== 0 ? (
            renderTodoItems(renderObj.array2)
          ) : (
            <Empty />
          )}
        </Col>
        <Col span={8}>
          {renderObj.array3.length !== 0 ? (
            renderTodoItems(renderObj.array3)
          ) : (
            <Empty />
          )}
        </Col>
      </Row>
    </div>
  );
}
