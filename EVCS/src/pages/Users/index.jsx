import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "antd";
import Table from "../../Components/common/table";
import PageHeader from "../../Components/common/pageHeader";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

function Users() {
  const [usersData, setUsersData] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const handleSettingData = useCallback((initialData, data) => {
    data.forEach((item, ind) => {
      initialData.push({
        col1: ind + 1,
        col2: item.displayName || "-",
        col3: item.email || "-",
        col4: item.contactNo || "-",
      });
    });
    return initialData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(
    () => handleSettingData([], usersData),
    [usersData, handleSettingData]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Sr.no",
        accessor: "col1",
      },
      {
        Header: "name",
        accessor: "col2",
      },
      {
        Header: "email",
        accessor: "col3",
      },
      {
        Header: "contact no",
        accessor: "col4",
      },
    ],
    []
  );

  const downloadCSV = () => {
    const headers = ["Sr.no", "Name", "Email", "Contact No"];
    const csvRows = [];
    csvRows.push(headers.join(","));
    data.forEach(row => {
      csvRows.push([row.col1, `"${row.col2}"`, `"${row.col3}"`, `"${row.col4}"`].join(","));
    });
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAllUsersData = useCallback(async () => {
    setIsFetchingData(true);
    try {
      await getDocs(collection(db, "users")).then((querySnapshot) => {
        const USERS_DATA = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUsersData(USERS_DATA);
        setIsFetchingData(false);
      });
    } catch (error) {
      console.log(error.message);
      setIsFetchingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllUsersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-wrapper">
      <div className={"data-list-section"}>
        <PageHeader title={`Users (${data.length})`} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10, marginTop: 10 }}>
          <Button type="primary" onClick={downloadCSV}>Export to CSV</Button>
        </div>
        <div className="flex flex--column gap--20 table-container mt--page">
          <Table
            columns={columns}
            data={data}
            loading={isFetchingData}
            tableTitle={"Users Summery"}
          />
        </div>
      </div>
    </div>
  );
}

export default Users;
