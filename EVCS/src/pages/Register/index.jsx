import React, { useState, useCallback } from "react";
import "react-activity/dist/library.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Input } from "antd";
import { createUserWithEmailAndPassword } from "firebase/auth";

import style from "./register.module.scss";
import AuthService from "../../services/auth.service";
import { createAction } from "../../utils/common";
import * as actionTypes from "../../redux/actionTypes";
import Button from "../../Components/common/Button";
import { auth } from "../../firebase";

import useFirebaseContext from "../../hooks/firebase";
import { PiChargingStationLight } from "react-icons/pi";

const Register = () => {
  const { addDocument } = useFirebaseContext();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    async (values) => {
      try {
        setLoading(true);
        const { email, password } = values;
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        dispatch(createAction(actionTypes.LOGIN_SUCCESS,false));
        AuthService.setAuthData(user.accessToken);
        delete values["password"];
        await addDocument("owners", { ...values });
        toast.success("🎉 Account Created Successful.");
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);  
      }
    },
    [addDocument, dispatch]
  );

  return (
    <div className={style.login}>
       <div style={{height:'100%', width:'50%', backgroundColor:'#1a434e', alignItems:'center', display:'flex', justifyContent:'center'}}>
      <PiChargingStationLight style={{fontSize:400, color:'#fff'}} />
      </div>
      <div className={style["container"]}>
        <h1>Register Account</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt--10"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input type="text" placeholder="Enter Name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email is required" }]}
          >
            <Input type="text" placeholder="Enter Name" />
          </Form.Item>
          <Form.Item
            label="Contact No"
            name="contactNo"
            rules={[{ required: true, message: "Contact No is required" }]}
          >
            <Input type="text" placeholder="Enter Contact No" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input type="text" placeholder="Enter Password" />
          </Form.Item>
          <Button type="submit" className="full-width" loading={loading}>
            Register
          </Button>
          <Link to={"/login"} className="text--center mt--20 text--primary text-decoration--underline pointer">
            Already have account ?
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default Register;
