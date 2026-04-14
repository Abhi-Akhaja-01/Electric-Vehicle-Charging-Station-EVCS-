import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { axiosInstance } from "../services/http.service";

import { createAction } from "../utils/common";

import * as actionTypes from "../redux/actionTypes";

let resInterceptor;

const WithErrorHandler = () => {
  const dispatch = useDispatch();
  /**
   * add response interceptor before component gets mounted
   * check if response data contains status="FAILURE", if yes, show an error message
   * if response gives a non-200 error code, show error from error data
   * if response contains a message to show, show success notification
   */

  useEffect(() => {
    resInterceptor = axiosInstance.interceptors.response.use(
      (res) => {
        if (res.data && res.data.status && res.data.status === "FAILURE") {
          toast.error(res.data.message, "error");
          throw new Error(res.data.message);
        } else if (
          res.data &&
          res.data.status &&
          res.data.status === "SUCCESS"
        ) {
          if (res.data.message) {
            //Currently commenting success message. Because we do not want success message from every api
            // toast.success(res.data.message, "success");
          }
        }
        return res;
      },
      (error) => {
        // check if error is having data
        if (error.response && error.response.data && error.response.status) {
          const status = error.response.status;
          const responseData = error.response.data;
          // is http error code is 401, log out of the application
          if (status === 401) {
            dispatch(createAction(actionTypes.LOG_OUT_SUCCESS));
            toast.error(responseData.message, "error");
          } else if (
            responseData.errorMessages &&
            Object.keys(responseData.errorMessages).length
          ) {
            // if error response contains any validation message, fetch it from response, and add error notification
            const validationError =
              responseData.errorMessages[
                Object.keys(responseData.errorMessages)[0]
              ];
            toast(validationError[0], "error");
          } else if (error.response && responseData && responseData.message) {
            if (responseData.message.error) {
              toast.error(responseData.message.error, "error");
            } else {
              // if error data contains message field, add error notification
              toast.error(responseData.message, "error");
            }
          }
          throw error;
        }
        throw error;
      }
    );

    return () => axiosInstance.interceptors.response.eject(resInterceptor);
  }, [dispatch]);

  return <></>;
};

export default WithErrorHandler;
