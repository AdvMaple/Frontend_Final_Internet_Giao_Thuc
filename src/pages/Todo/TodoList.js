import { List, Button } from "antd";
import { useEffect } from "react";

export default function TodoList(props) {
  const { onClick, list } = props;

  const renderList = () => {
    return list.map((l, key) => {
      return (
        <li key={key}>
          <Button value={key} onClick={onClick}>
            {l.name}
          </Button>
        </li>
      );
    });
  };

  return (
    <div className="border">
      {/* <ul>{renderList()}</ul> */}
      <List
        style={{ background: "white" }}
        size="small"
        itemLayout="horizontal"
        dataSource={list}
        split={false}
        renderItem={(item, key) => {
          return (
            <List.Item key={key}>
              <Button value={key} onClick={() => onClick(item.id)}>
                {item.name}
              </Button>
            </List.Item>
          );
        }}
      ></List>
    </div>
  );
}
