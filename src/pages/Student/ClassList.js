import { List, Button } from "antd";
import { useEffect } from "react";

export default function ClassList(props) {
  const { onClick, list } = props;
  console.log(list);

  return (
    <div className="border">
      {list ? (
        <List
          style={{ background: "white" }}
          size="small"
          itemLayout="horizontal"
          dataSource={list}
          split={false}
          renderItem={(item, key) => {
            return (
              <List.Item key={key}>
                <Button
                  value={key}
                  onClick={() => onClick(item.id)}
                  type={item.id === props.current ? "primary" : ""}
                >
                  {item.name}
                </Button>
              </List.Item>
            );
          }}
        ></List>
      ) : (
        "khong cos"
      )}
    </div>
  );
}
