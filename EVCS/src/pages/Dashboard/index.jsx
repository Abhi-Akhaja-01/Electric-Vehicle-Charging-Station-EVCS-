import React, { Fragment, useCallback, useEffect, useState } from "react";
import { CiUser } from "react-icons/ci";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "antd";
import { logEvent } from "firebase/analytics";
import { PiChargingStationLight, PiGitPullRequest } from "react-icons/pi";
import { MdChargingStation } from "react-icons/md";
import { LuIndianRupee } from "react-icons/lu";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, PieChart, Pie, Cell, Tooltip as PieTooltip, Legend } from "recharts";

import style from "./dashboard.module.scss";
import DashboardHeader from "../../Components/partial/dashboardHeader";
import Modal from "../../Components/common/Modal";
import useFirebaseContext from "../../hooks/firebase";
import { analytics } from "../../firebase";

function Dashboard() {
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalDetails, setModalDetails] = React.useState({});
  const { ownerData, isAdmin } = useSelector((state) => state);
  const { getDocuments } = useFirebaseContext();
  const [states, setStates] = useState({
    users: 0,
    owners: 0,
    stations: 0,
    stationsRequest: 0,
    bookedSlots: 0,
    totalEarnings: 0,
    totalRevenue: 0,
  });
  const getStates = useCallback(async () => {
    setIsLoading(true);
    try {
      const query = [{ field: "owner", operator: "==", value: ownerData.id }];
      const paymentQuery = [{ field: "stationOwnerId", operator: "==", value: ownerData.id }];
      
      const [users, owners, stations, stationsRequest, bookedSlots, paymentsSnapshot] =
        await Promise.all([
          getDocuments("users"),
          getDocuments("owners"),
          getDocuments("stations", !isAdmin ? query : []),
          getDocuments("station-requests", !isAdmin ? query : []),
          getDocuments("slots-book", !isAdmin ? query : []),
          getDocuments("payments", !isAdmin ? paymentQuery : []),
        ]);

      let totalEarned = 0;
      paymentsSnapshot.docs.forEach((doc) => {
        const p = doc.data();
        if (p.status === "succeeded" || p.paymentType === "COD") {
          totalEarned += Number(p.amount) || 0;
        }
      });
      
      setIsLoading(false);
      setStates({
        users: users.size,
        owners: owners.size,
        stations: stations.size,
        stationsRequest: stationsRequest.size,
        bookedSlots: bookedSlots.size,
        totalEarnings: !isAdmin ? totalEarned : 0,
        totalRevenue: isAdmin ? totalEarned : 0,
      });
    } catch (error) {
      setIsLoading(false);
    }
  }, [getDocuments, isAdmin, ownerData.id]);

  useEffect(() => {
    getStates();
  }, [getStates]);
  const handleModal = (data) => {
    logEvent(analytics, "notification_check", {
      ...data,
    });
    setModalDetails(data);
    setIsDetailModal(true);
  };
  return (
    <div className={style.dashboard}>
      <DashboardHeader handleModal={handleModal} />
      <Modal
        isVisible={isDetailModal}
        title={modalDetails.title}
        onClose={() => {
          setIsDetailModal(false);
        }}
      >
        <div className={style["modal"]}>
          <p className={style["modal-desc"]}>{modalDetails.desc}</p>
          <div className={style["modal-footer"]}>
            <span>{modalDetails.date}</span>
            <span>{modalDetails.time}</span>
          </div>
        </div>
      </Modal>
      <div className={style["dashboard-inner-wrapper"]}>
        <aside>
          <div className={style["card-wrapper"]}>
            {isAdmin && (
              <Fragment>
                <Link to={"/users"} className={style["card-container"]}>
                  <CiUser />
                  <div>
                    <p>Users</p>
                    {isLoading ? (
                      <Skeleton.Button style={{ height: 28 }} active />
                    ) : (
                      <h1>{states.users}</h1>
                    )}
                  </div>
                </Link>
                <Link to={"/owners"} className={style["card-container"]}>
                  <CiUser />
                  <div>
                    <p>Owners</p>
                    {isLoading ? (
                      <Skeleton.Button style={{ height: 28 }} active />
                    ) : (
                      <h1>{states.owners}</h1>
                    )}
                  </div>
                </Link>
              </Fragment>
            )}
            {!isAdmin && (
              <Link to={"/owners"} className={style["card-container"]}>
                <MdChargingStation />
                <div>
                  <p>Total Slot Booked</p>
                  {isLoading ? (
                    <Skeleton.Button style={{ height: 28 }} active />
                  ) : (
                    <h1>{states.bookedSlots}</h1>
                  )}
                </div>
              </Link>
            )}
            <Link to={"/stations"} className={style["card-container"]}>
              <PiChargingStationLight />
              <div>
                <p>{!isAdmin ? "My Stations" : "Stations"}</p>
                {isLoading ? (
                  <Skeleton.Button style={{ height: 28 }} active />
                ) : (
                  <h1>{states.stations}</h1>
                )}
              </div>
            </Link>
            <Link to={"/station-request"} className={style["card-container"]}>
              <PiGitPullRequest />
              <div>
                <p>{!isAdmin ? "My Station Requests" : "Station Requests"}</p>
                {isLoading ? (
                  <Skeleton.Button style={{ height: 28 }} active />
                ) : (
                  <h1>{states.stationsRequest}</h1>
                )}
              </div>
            </Link>
            {!isAdmin && (
              <Link to={"/payments"} className={style["card-container"]}>
                <LuIndianRupee />
                <div>
                  <p>Total Earning</p>
                  {isLoading ? (
                    <Skeleton.Button style={{ height: 28 }} active />
                  ) : (
                    <h1>₹{states.totalEarnings}</h1>
                  )}
                </div>
              </Link>
            )}
            {isAdmin && (
              <Link to={"/payments"} className={style["card-container"]}>
                <LuIndianRupee />
                <div>
                  <p>Platform Revenue</p>
                  {isLoading ? (
                    <Skeleton.Button style={{ height: 28 }} active />
                  ) : (
                    <h1>₹{states.totalRevenue}</h1>
                  )}
                </div>
              </Link>
            )}
          </div>

          {isAdmin && (
            <div className={style["charts-wrapper"]}>
              <div className={style["chart-container"]}>
                <h3>Users vs Owners</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Users", value: states.users },
                        { name: "Owners", value: states.owners },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#00C49F" />
                    </Pie>
                    <PieTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className={style["chart-container"]}>
                <h3>Platform Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: "Stations", count: states.stations },
                      { name: "Requests", count: states.stationsRequest },
                      { name: "Bookings", count: states.bookedSlots },
                    ]}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <BarTooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* <div className={style["top-list-wrapper"]}>
            <InProgressLottery />
            <TopWinners />
          </div> */}
        </aside>
        {/* <RecentActivity /> */}
      </div>
    </div>
  );
}

export default Dashboard;
