import axios from "axios";
import qs from "qs";
import { notification } from "antd";

const api_url = "http://127.0.0.1:8000";

const openNotificationWithIcon = (type, title, message) => {
  notification[type]({
    message: title,
    description: message,
  });
};

function getCurrentDate() {
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  return date;
}

function getBeautifyDate(d) {
  let date = new Date(d);
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
}

function apiSignIn(data) {
  const { username, password } = data;
  let config = {
    method: "get",
    url: `${api_url}/users/?name=${username}&password=${password}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  return axios(config);
}

function apiGetUserTodoList(data) {
  let config = {
    method: "get",
    url: `${api_url}/todolist?user_id=${data?.user_id}&page=${
      data?.page ? data.page : 1
    }`,
    headers: {},
  };

  return axios(config);
}

function apiPostUserTodoList(data) {
  let d = qs.stringify({
    name: data.name,
    user_id: data.user_id,
    date_created: getCurrentDate(),
  });

  let config = {
    method: "post",
    url: `${api_url}/todolist/`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: d,
  };

  return axios(config);
}

function getUserMail(data) {
  var config = {
    method: "get",
    url: `${api_url}/mail/?author=${data.user_id}&page=${
      data?.page ? data?.page : 1
    }`,
    headers: {},
  };

  return axios(config);
}

function apiUpload(data) {
  data.append("attached_file", data.originFileObj);

  var config = {
    method: "post",
    url: "http://localhost:8000/upload/",
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };

  // axios(config);
}

function apiPostBlog(d) {
  var data = qs.stringify({
    attachment: d.attachment,
    content: d.content,
    date_created: getCurrentDate(),
    author: d.user_id,
  });

  var config = {
    method: "post",
    url: `${api_url}/blog_create/`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  return axios(config);
}

function apiPostMail(d) {
  let data = qs.stringify({
    subject: d.subject,
    content: d.content,
    to: d.to,
    attachment: d.attachment,
    otherInfo: d.otherInfo,
    author: d.author,
  });
  let config = {
    method: "post",
    url: `${api_url}/mail_create/`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  return axios(config);
}

function apiGetBlog(page) {
  var config = {
    method: "get",
    url: `${api_url}/blog/?page=${page ? page : 1}`,
    headers: {},
  };

  return axios(config);
}

function apiPostClass(d) {
  var data = qs.stringify({
    name: d.name,
    teacherId: d.user_id,
  });
  var config = {
    method: "post",
    url: `${api_url}/class/`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  return axios(config);
}

function apiGetClass(d) {
  var config = {
    method: "get",
    url: `${api_url}/class/?teacherId=${d?.id}&page=${d?.page ? d.page : 1}`,
    headers: {},
  };

  return axios(config);
}

function apiGetStudent(classId) {
  var config = {
    method: "get",
    url: `${api_url}/student/?classId=${classId}`,
    headers: {},
  };

  return axios(config);
}

function apiPostStudent(d) {
  var data = qs.stringify({
    name: d?.name,
    studentId: d?.studentId,
    currentResident: d?.currentResident,
    placeOfBirth: d?.placeOfBirth,
    isMale: d?.isMale,
    hasPaidTuition: d?.hasPaidTuition,
    diem_CC: d?.diem_CC,
    diem_TH: d?.diem_TH,
    diem_Final: d?.diem_Final,
    classId: d?.classId,
  });

  var config = {
    method: "post",
    url: `${api_url}/student/`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  return axios(config);
}

function apiGetUserTodoListDetail(list_id) {
  let config = {
    method: "get",
    url: `${api_url}/todo_detail/?list_id=${list_id}`,
    headers: {},
  };

  return axios(config);
}

function apiPatchUserTodoListDetail(d) {
  let data = qs.stringify({
    name: d?.name,
    state: d?.state,
  });
  let config = {
    method: "patch",
    url: `${api_url}/todo_detail/${d?.id}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  return axios(config);
}

function apiDeleteMail(d) {
  let config = {
    method: "delete",
    url: `${api_url}/mail/${d.id}`,
    headers: {},
  };

  return axios(config);
}

function apiPostCategory(d) {
  let data = qs.stringify({
    name: d.name,
  });
  let config = {
    method: "post",
    url: `${api_url}/library/`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  return axios(config);
}

function apiGetCategory(d) {
  let config = {
    method: "get",
    url: `${api_url}/library/?page=${d?.page ? d?.page : 1}`,
    headers: {},
  };

  return axios(config);
}

function apiGetBook(d) {
  console.log(d);
  let config = {
    method: "get",
    url: `${api_url}/book/?category=${d?.category}&page=${
      d?.page ? d?.page : 1
    }`,
    headers: {},
  };

  return axios(config);
}

function apiGetAllCategory() {
  let config = {
    method: "get",
    url: `${api_url}/library_all/`,
    headers: {},
  };

  return axios(config);
}

function apiPostBook(d) {
  let data = qs.stringify({
    name: d.name,
    url: d.url,
    category: d.category,
  });

  let config = {
    method: "post",
    url: `${api_url}/book/`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  return axios(config);
}

function apiDeleteTodoList(id) {
  let config = {
    method: "delete",
    url: `${api_url}/todolist/${id}`,
    headers: {},
  };

  return axios(config);
}

function apiPostTodoDetail(d) {
  let data = qs.stringify({
    name: d?.name,
    list_id: d?.list_id,
    date_created: getCurrentDate(),
    date_finished: "",
    state: 0,
  });
  let config = {
    method: "post",
    url: `${api_url}/todo_detail/`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  return axios(config);
}

function apiPatchStudent(d) {
  let data = qs.stringify({
    name: d.name,
    studentId: d.studentId,
    currentResident: d?.currentResident,
    placeOfBirth: d?.placeOfBirth,
    isMale: d?.isMale,
    hasPaidTuition: d?.hasPaidTuition,
    diem_CC: d?.diem_CC,
    diem_TH: d?.diem_TH,
    diem_Final: d?.diem_Final,
    classId: d.classId,
  });
  let config = {
    method: "patch",
    url: `${api_url}/student/${d?.id}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  return axios(config);
}

function apiDeleteStudent(id) {
  let config = {
    method: "delete",
    url: `${api_url}/student/${id}`,
    headers: {},
  };

  return axios(config);
}

export {
  api_url,
  apiSignIn,
  apiGetUserTodoList,
  apiPostUserTodoList,
  apiDeleteTodoList,
  apiPostTodoDetail,
  getUserMail,
  getBeautifyDate,
  apiUpload,
  apiPostBlog,
  apiGetBlog,
  apiPostClass,
  apiGetClass,
  apiGetStudent,
  apiPostStudent,
  apiPatchStudent,
  apiDeleteStudent,
  apiGetUserTodoListDetail,
  apiPatchUserTodoListDetail,
  apiPostMail,
  openNotificationWithIcon,
  apiDeleteMail,
  apiPostCategory,
  apiGetCategory,
  apiGetBook,
  apiGetAllCategory,
  apiPostBook,
};
