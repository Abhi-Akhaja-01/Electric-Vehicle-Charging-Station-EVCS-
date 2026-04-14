import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Form, Input } from "antd";
import "react-activity/dist/library.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";

import style from "./login.module.scss";
import AuthService from "../../services/auth.service";
import { createAction } from "../../utils/common";
import * as actionTypes from "../../redux/actionTypes";
import Button from "../../Components/common/Button";
import { auth } from "../../firebase";
import useFirebaseContext from "../../hooks/firebase";
import { PiChargingStationLight } from "react-icons/pi";

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { getDocuments } = useFirebaseContext();

  const handleSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true);
        const { email, password } = values;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const querySnapshot = await getDocuments("admins");
        const isAdmin = querySnapshot.docs.map((doc) => doc.data())?.find((data)=>data?.email===email);
        dispatch(createAction(actionTypes.LOGIN_SUCCESS,!!isAdmin));
        localStorage.setItem("admin-email", email);
        AuthService.setAuthData(user.accessToken,!!isAdmin);
        toast.success("🎉 Login Successful.");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, getDocuments]
  );

  return (
    <div className={style.login}>
      {/* <div className={style["left-bg-container"]}></div> */}
      <div style={{height:'100%', width:'50%', backgroundColor:'#1a434e', alignItems:'center', display:'flex', justifyContent:'center'}}>
      <PiChargingStationLight style={{fontSize:400, color:'#fff'}} />
      </div>
      <div className={style["container"]}>
        <h1>Sign In</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt--10"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input type="text" placeholder="Enter Name" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input type="text" placeholder="Enter Password" />
          </Form.Item>
          <Button type="submit" className="full-width" loading={loading}>
            Sign in
          </Button>
          <Link
            to={"/register"}
            className="text--center mt--20 text--primary text-decoration--underline pointer"
          >
            Don't have account ?
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default Login;
