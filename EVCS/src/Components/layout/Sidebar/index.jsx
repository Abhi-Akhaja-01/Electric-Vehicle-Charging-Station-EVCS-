import React, { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { PiChargingStationLight, PiGitPullRequest } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { CiUser } from "react-icons/ci";
import { MdOutlineReviews } from "react-icons/md";

import "./sidebar.scss";
import { useSelector } from "react-redux";

function SideBar() {
  let location = useLocation();
  const { isAdmin } = useSelector((state) => state);
  const CURRENT_WB_NAME = location.pathname.split("/")[1];

  return (
    <aside className="sidebar-wrapper">
      <div className="logo-container">
      <PiChargingStationLight className="logo" />
      {/* <p>EVChargeHub</p> */}
      </div>
      <ul>
        <li className={CURRENT_WB_NAME === "" && "active"}>
          <RxDashboard size={25} />
          <Link to={"./dashboard"}>Dashboard</Link>
        </li>
        <li className={CURRENT_WB_NAME === "stations" && "active"}>
          <PiChargingStationLight />

          <Link to={"./stations"}>{isAdmin ? "Stations" : "My Stations"}</Link>
        </li>
        <li className={CURRENT_WB_NAME === "station-request" && "active"}>
          <PiGitPullRequest />
          <Link to={"./station-request"}>
            {isAdmin ? "Station Request" : "My Station Request"}
          </Link>
        </li>
        {isAdmin && (
          <Fragment>
            <li className={CURRENT_WB_NAME === "users" && "active"}>
              <CiUser />
              <Link to={"./users"}>Users</Link>
            </li>
            <li className={CURRENT_WB_NAME === "owners" && "active"}>
              <CiUser />
              <Link to={"./owners"}>Owners</Link>
            </li>
          </Fragment>
        )}
        <li className={CURRENT_WB_NAME === "booked-slots" && "active"}>
          <PiGitPullRequest />
          <Link to={"./booked-slots"}>Booked Slots</Link>
        </li>
        <li className={CURRENT_WB_NAME === "payments" && "active"}>
          <PiGitPullRequest />
          <Link to={"./payments"}>Payments</Link>
        </li>
        <li className={CURRENT_WB_NAME === "reviews" && "active"}>
          <MdOutlineReviews />
          <Link to={"./reviews"}>Reviews</Link>
        </li>
      </ul>
    </aside>
  );
}

export default SideBar;
