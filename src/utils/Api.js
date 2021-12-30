import axios from "axios";
import qs from "qs";
var fs = require("fs");

const api_url = "http://127.0.0.1:8000";

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
  const { user_id } = data;
  let config = {
    method: "get",
    url: `${api_url}/todolist?user_id=${user_id}`,
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
    url: `${api_url}/mail/?author=${data?.user_id}`,
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
    url: `${api_url}/blog/`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  return axios(config);
}

function apiGetBlog() {
  var config = {
    method: "get",
    url: `${api_url}/blog/`,
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
  const { id } = d;
  var config = {
    method: "get",
    url: `${api_url}/class/?teacherId=${id}`,
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
export {
  api_url,
  apiSignIn,
  apiGetUserTodoList,
  apiPostUserTodoList,
  getUserMail,
  getBeautifyDate,
  apiUpload,
  apiPostBlog,
  apiGetBlog,
  apiPostClass,
  apiGetClass,
  apiGetStudent,
  apiPostStudent,
};
