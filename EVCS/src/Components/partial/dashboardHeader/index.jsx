import React, { useEffect } from "react";
import style from "./dashobardHeader.module.scss";
import { useDispatch, useSelector } from "react-redux";
import * as actionTypes from "../../../redux/actionTypes";
import { createAction } from "../../../utils/common";
import { IoNotifications } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { notifications } from "../../../constants/constant";
import UserImage from "../../../assets/images/user.png";

function DashboardHeader({ handleModal }) {
  const notificationRef = React.useRef();
  const userRef = React.useRef();
  const [isNotiMenu, setIsNotiMenu] = React.useState(false);
  const [isUserMenu, setIsUserMenu] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const dispatch = useDispatch();
  const { ownerData, isAdmin } = useSelector((state) => state);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    dispatch(createAction(actionTypes.LOG_OUT_SUCCESS));
  };

  const toggleNotiMenu = () => {
    setIsNotiMenu(!isNotiMenu);
  };
  const toggleUserMenu = () => {
    setIsUserMenu(!isUserMenu);
  };

  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef?.current.contains(event.target)
    ) {
      setIsNotiMenu(false);
    }
    if (userRef.current && !userRef?.current.contains(event.target)) {
      setIsUserMenu(false);
    }
  };
  useEffect(() => document.addEventListener("click", handleClickOutside), []);
  return (
    <div className={style.header}>
      <h1>Dashboard</h1>
      <div className={style.profile}>
        <div 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginRight: "20px", background: "var(--primary-color-10)", padding: "8px", borderRadius: "50%" }}
        >
          {isDarkMode ? <MdOutlineLightMode size={24} color="#facc15" /> : <MdDarkMode size={24} color="var(--primary-color)" />}
        </div>
        <div ref={notificationRef}>
          <IoNotifications
            className={style.notification}
            onClick={toggleNotiMenu}
          />
          <span className={style.notiCount}>{7}</span>
          <div
            className={`${style["dropdown-menu"]} ${
              isNotiMenu && style["active"]
            }`}
          >
            <p>NOTIFICATION</p>
            <ul>
              {notifications.map((data,i) => (
                <li
                  className={!data.seen && style.unseen}
                  onClick={() => {
                    handleModal(data);
                  }}
                  key={i}
                >
                  <h4>{data.title}</h4>
                  <span>{data.desc}</span>
                  <div>
                    <span>{data.date}</span>
                    <span>{data.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div ref={userRef}>
          <button className={style.avatar} onClick={toggleUserMenu}>
            <img src={UserImage} alt="" />
          </button>
          <div
            className={`${style["dropdown-menu"]} ${style["user"]} ${
              isUserMenu && style["active"]
            }`}
          >
            <p>👋 Hey, {isAdmin ? "Admin" : ownerData.name}</p>
            <li onClick={handleLogout}>
              <IoIosLogOut />
              Logout
            </li>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
