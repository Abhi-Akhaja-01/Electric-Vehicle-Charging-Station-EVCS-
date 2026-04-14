import axios from "axios";

import { getUrl } from "../utils/common";

export const axiosInstance = axios.create();
const CancelToken = axios.CancelToken;
const cancel_req = {};

export const cancelRequest = (url) => {
  const f = cancel_req[url];
  if (f) {
    f();
  }
};

const get = (url, params = {}, otherData = {}, isExpired = false) => {
  return commonAxios({
    method: "GET",
    url: getUrl(url, params),
    isExpired: isExpired,
    ...otherData,
  });
};

const post = (url, params = {}, otherData = {}) => {
  return commonAxios({
    method: "POST",
    url: getUrl(url),
    data: params,
    ...otherData,
  });
};

const put = (url, params = {}, otherData = {}) => {
  return commonAxios({
    method: "PUT",
    url: getUrl(url),
    data: params,
    ...otherData,
  });
};

const deleteRequest = (url, params, otherData = {}) => {
  return commonAxios({
    method: "DELETE",
    url: getUrl(url),
    data: params,
    ...otherData,
  });
};

const patch = (url, params = {}, otherData = {}) => {
  return commonAxios({
    method: "PATCH",
    url: getUrl(url),
    data: params,
    ...otherData,
  });
};

const commonAxios = ({
  method,
  url,
  data,
  contentType = "application/json",
  noCache = false,
}) => {
  const headers = {
    "Content-Type": contentType,
  };
  const token = localStorage.getItem("admin-token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (noCache) {
    headers["Cache-Control"] = "no-cache, no-store, must-revalidate, max-age=0";
  }

  let body = null;

  if (contentType === "application/json") {
    body = JSON.stringify(data);
  } else {
    body = data;
  }

  return new Promise((resolve, reject) => {
    axiosInstance({
      method: method,
      url: url,
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel_req[url.split("?")[0].split(".com/")[1]] = c;
      }),
      headers: headers,
      data: body,
    })
      .then((response) => {
        if (response && response.data) {
          resolve(response.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const HttpService = {
  get: get,
  post: post,
  put: put,
  deleteRequest: deleteRequest,
  patch: patch,
};

export default HttpService;
