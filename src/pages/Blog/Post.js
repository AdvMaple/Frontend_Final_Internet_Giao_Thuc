import { Image } from "antd";

export default function Post(props) {
  const { data } = props;
  return (
    <div className="Post border rounded p-3 my-3">
      <div className="content">
        <p>
          {data?.author ? data.author : "null"} vào lúc{" "}
          <span>{data?.date_created ? data.date_created : "null"}</span>
        </p>

        <p>{data?.content ? data.content : "null"}</p>
        {data?.attachment ? (
          <Image src={data?.attachment} height="250px"></Image>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
