import React, { useState, useCallback, useEffect, useMemo } from "react";
import Table from "../../Components/common/table";
import PageHeader from "../../Components/common/pageHeader";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Owners = () => {
  const [ownerData, setOwnerData] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const handleSettingData = useCallback((initialData, data) => {
    data.forEach((item, ind) => {
      initialData.push({
        col1: ind + 1,
        col2: item.name || "-",
        col3: item.email || "-",
        col4: item.contactNo || "-",
      });
    });
    return initialData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(
    () => handleSettingData([], ownerData),
    [ownerData, handleSettingData]
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

  const getOwnerData = useCallback(async () => {
    setIsFetchingData(true);
    try {
      await getDocs(collection(db, "owners")).then((querySnapshot) => {
        const OWNER_DATA = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setOwnerData(OWNER_DATA);
        setIsFetchingData(false);
      });
    } catch (error) {
      console.log(error.message);
      setIsFetchingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getOwnerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page-wrapper">
      <div className={"data-list-section"}>
        <PageHeader title={`Owners (${data.length})`} />
        <div className="flex flex--column gap--20 table-container mt--page">
          <Table
            columns={columns}
            data={data}
            loading={isFetchingData}
            tableTitle={"Owners Summery"}
          />
        </div>
      </div>
    </div>
  );
}

export default Owners;
