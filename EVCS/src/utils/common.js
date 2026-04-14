import isEmpty from "lodash/isEmpty";
import queryString from "query-string";

import { API_CONFIG } from "../constants/constant";

export const getUrl = (url, params = {}) => {
  if (!url.includes("https")) {
    let urlString = `${API_CONFIG.baseUrl}/${url}`;
    if (params && !isEmpty(params)) {
      urlString += `?${queryString.stringify(params)}`;
    }
    return urlString;
  }
  return url;
};

export const createAction = (type, payload = {}) => {
  return {
    type: type,
    payload: payload,
  };
};

export const strictValidArray = (arr) => arr && Array.isArray(arr);

export const strictValidArrayWithLength = (arr) =>
  strictValidArray(arr) && !!arr.length;