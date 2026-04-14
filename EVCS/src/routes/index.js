import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import "./routes.scss";
import Loader from "../Components/Loader";
import {
  Login,
  Dashboard,
  Users,
  Station,
  Register,
  StationRequest,
  BookedSlots,
  Payments,
  Owners,
  Reviews,
} from "../pages";
import SideBar from "../Components/layout/Sidebar";
import { createAction } from "../utils/common";
import * as actionTypes from "../redux/actionTypes";
import useFirebaseContext from "../hooks/firebase";

const allowSideBarPaths = [
  "",
  "users",
  "owners",
  "stations",
  "station-request",
  "booked-slots",
  "payments",
  "reviews",
];

function RoutesScreen() {
  let location = useLocation();
  const CURRENT_WB_NAME = location.pathname.split("/")[1];
  const visibleSidebar = allowSideBarPaths.includes(CURRENT_WB_NAME);
  const { isLoading, isLogin, isAdmin } = useSelector((state) => state);
  const { getDocuments } = useFirebaseContext();
  const dispatch = useDispatch();

  const getOwnerInfo = useCallback(async () => {
    try {
      const email = localStorage.getItem("admin-email");
      const querySnapshot = await getDocuments("owners", [
        { field: "email", operator: "==", value: email },
      ]);
      const OWNER_DATA = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      if (!OWNER_DATA[0]) {
        // dispatch(createAction(actionTypes.LOG_OUT_SUCCESS));
        return;
      }
      dispatch(createAction(actionTypes.SET_OWNER_DATA, OWNER_DATA[0]));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, getDocuments]);

  useEffect(() => {
    isLogin && !isAdmin && getOwnerInfo();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, isLogin]);

  return (
    <div className="routes-wrapper">
      <Loader active={isLoading} />
      <div className="routes-container">
        <>
          {visibleSidebar && (
            <div className="sidebar">
              <SideBar />
            </div>
          )}
          <div
            className={
              visibleSidebar ? "main-content" : "main-content none-sidebar"
            }
          >
            <div className="main-screens">
              {isLogin && isAdmin ? (
                <Routes>
                  <Route expect path="/" element={<Dashboard />} />
                  <Route expect path="users" element={<Users />} />
                  <Route expect path="owners" element={<Owners />} />
                  <Route expect path="stations" element={<Station />} />
                  <Route
                    expect
                    path="station-request"
                    element={<StationRequest />}
                  />
                  <Route expect path="booked-slots" element={<BookedSlots />} />
                  <Route expect path="payments" element={<Payments />} />
                  <Route expect path="reviews" element={<Reviews />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              ) : (
                isLogin && (
                  <Routes>
                    <Route expect path="/" element={<Dashboard />} />
                    <Route expect path="stations" element={<Station />} />
                    <Route
                      expect
                      path="station-request"
                      element={<StationRequest />}
                    />
                    <Route
                      expect
                      path="booked-slots"
                      element={<BookedSlots />}
                    />
                    <Route
                      expect
                      path="payments"
                      element={<Payments />}
                    />
                    <Route
                      expect
                      path="reviews"
                      element={<Reviews />}
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                )
              )}
              {!isLogin && (
                <Routes>
                  <Route expect path="/login" element={<Login />} />
                  <Route expect path="register" element={<Register />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              )}
            </div>
          </div>
        </>
      </div>
    </div>
  );
}

export default RoutesScreen;
