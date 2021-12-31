import { Button, Row } from "antd";
import { useState } from "react";

export default function TodoItem(props) {
  const [changeButton, setChangeButton] = useState(false);
  let type = "";
  const handleClick = (e) => {
    e.preventDefault();
    let item = {
      id: props.element.id,
      name: e.target.name.value,
      state: e.target.state.value,
      changeType: type,
    };
    props.onChangeState(item);
  };

  return (
    <div className="border d-flex justify-content-center m-2">
      <form onSubmit={handleClick}>
        <Row
          className="p-2"
          onMouseEnter={() => {
            setChangeButton(!changeButton);
          }}
          onMouseLeave={() => {
            setChangeButton(!changeButton);
          }}
        >
          {props.element.state === 0 || !changeButton ? (
            ""
          ) : (
            <Button
              size="sm"
              type="primary"
              name="changeType"
              value="dec"
              onClick={() => {
                type = "dec";
              }}
              htmlType="submit"
            >
              {"<"}
            </Button>
          )}
          <span className="mx-2 my-1">{props.element.name}</span>
          {props.element.state === 2 || !changeButton ? (
            ""
          ) : (
            <Button
              name="changeType"
              type="primary"
              value="inc"
              onClick={() => {
                type = "inc";
              }}
              htmlType="submit"
            >
              {">"}
            </Button>
          )}
        </Row>
        <input
          onChange={() => {}}
          hidden
          name="name"
          value={props.element.name}
        ></input>
        <input
          onChange={() => {}}
          hidden
          name="state"
          value={props.element.state}
        ></input>
      </form>
    </div>
  );
}
