import React, { useState, useCallback, useEffect, useMemo } from "react";
import Table from "../../Components/common/table";
import PageHeader from "../../Components/common/pageHeader";
import { useSelector } from "react-redux";
import useFirebaseContext from "../../hooks/firebase";
import { Rate } from "antd";

const Reviews = () => {
  const [reviewsData, setReviewsData] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const { isAdmin, ownerData } = useSelector((state) => state);
  const { getDocuments } = useFirebaseContext();

  const handleReviewsData = useCallback((initialData, data) => {
    data.forEach((item, ind) => {
      initialData.push({
        col1: ind + 1,
        col2: item.userName || "Anonymous",
        col3: item.stationName || "Unknown",
        col4: <Rate disabled defaultValue={item.rating || 0} />,
        col5: item.comment || "-",
        col6: item.createdAt ? new Date(item.createdAt.seconds * 1000).toDateString() : "-",
      });
    });
    return initialData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(
    () => handleReviewsData([], reviewsData),
    [reviewsData, handleReviewsData]
  );

  const columns = React.useMemo(
    () => [
      { Header: "Sr.no", accessor: "col1" },
      { Header: "User Name", accessor: "col2" },
      { Header: "Station Name", accessor: "col3" },
      { Header: "Rating", accessor: "col4" },
      { Header: "Comment", accessor: "col5" },
      { Header: "Date", accessor: "col6" },
    ],
    []
  );

  const fetchReviewsData = async () => {
    setIsFetchingData(true);
    try {
      let queryArgs = [];
      if (!isAdmin) {
         queryArgs = [{ field: "ownerId", operator: "==", value: ownerData.id }];
      }

      const querySnapshot = await getDocuments("reviews", queryArgs);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Sort by creation date descending
      fetchedData.sort((a, b) => {
         if (!a.createdAt || !b.createdAt) return 0;
         return b.createdAt.seconds - a.createdAt.seconds;
      });

      setReviewsData(fetchedData);
    } catch (error) {
      console.error("Error fetching reviews data:", error);
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerData, isAdmin]);

  return (
    <div className="page-wrapper">
      <div className={"data-list-section"}>
        <PageHeader title={`User Reviews (${data.length})`} />
        <div className="flex flex--column gap--20 table-container mt--page">
          <Table
            columns={columns}
            data={data}
            loading={isFetchingData}
            tableTitle={"Reviews Summary"}
          />
        </div>
      </div>
    </div>
  );
};

export default Reviews;
