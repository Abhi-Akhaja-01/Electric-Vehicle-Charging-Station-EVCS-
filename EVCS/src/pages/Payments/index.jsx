import React, { useState, useCallback, useEffect, useMemo } from "react";
import Table from "../../Components/common/table";
import PageHeader from "../../Components/common/pageHeader";
import Button from "../../Components/common/Button";
import { useSelector } from "react-redux";
import useFirebaseContext from "../../hooks/firebase";
import { toast } from "react-toastify";

const Payments = () => {
  const [paymentsData, setPaymentsData] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const { isAdmin, ownerData } = useSelector((state) => state);
  const { getDocuments, updateDocument } = useFirebaseContext();

  const handleMarkAsCompleted = async (item) => {
    setIsFetchingData(true);
    try {
      // Create a copy of item without id if needed, but updateDocument usually merges.
      // Firebase updateDoc needs the clean object.
      const updatedItem = { ...item, status: "succeeded" };
      delete updatedItem.col1;
      delete updatedItem.col2;
      delete updatedItem.col3;
      delete updatedItem.col4;
      delete updatedItem.col5;
      delete updatedItem.col6;
      delete updatedItem.col7;
      delete updatedItem.col8;
      delete updatedItem.col9;
      delete updatedItem.col10;
      delete updatedItem.col11;
      delete updatedItem.col12;

      await updateDocument("payments", item.id, {
        ...updatedItem
      });
      toast.success("Payment marked as Succeeded");
      await fetchPaymentsData();
    } catch (error) {
      console.log(error);
      setIsFetchingData(false);
    }
  };

  const handlePaymentsData = useCallback((initialData, data) => {
    data.forEach((item, ind) => {
      initialData.push({
        col1: ind + 1,
        // col2: item.userId || "-", // ID might be too long to look nice, but requested
        col2: item.userName || "-",
        col3: item.email || "-",
        col4: `₹${item.amount}` || "-", // assuming currency
        col5: item.paymentType === "COD" ? "Cash On Delivery" : "Card",
        col6: item.stationName || "-",
        col7: item.stationOwnerName || "-",
        col8: item.bookingDate ? new Date(item.bookingDate.seconds * 1000).toDateString() : "-",
        col9: item.bookingTiming || "-",
        col10: item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleString() : "-",
        col11: (
          <Button
            className={`${item.status === 'succeeded' ? 'outline' : 'danger'} text--capitalize`}
          >
            {item.status}
          </Button>
        ),
        col12: item.paymentType === "COD" && item.status === "pending" ? (
          <Button onClick={() => handleMarkAsCompleted(item)}>
            Completed
          </Button>
        ) : "N/A",
      });
    });
    return initialData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(
    () => handlePaymentsData([], paymentsData),
    [paymentsData, handlePaymentsData]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Sr.no",
        accessor: "col1",
      },
      {
        Header: "User Name",
        accessor: "col2",
      },
      {
        Header: "Email",
        accessor: "col3",
      },
      {
        Header: "Amount",
        accessor: "col4",
      },
      {
        Header: "Payment Type",
        accessor: "col5",
      },
      {
        Header: "Station Name",
        accessor: "col6",
      },
      {
        Header: "Owner Name",
        accessor: "col7",
      },
      {
        Header: "Date",
        accessor: "col8",
      },
      {
        Header: "Time",
        accessor: "col9",
      },
      {
        Header: "Created At",
        accessor: "col10",
      },
      {
        Header: "Status",
        accessor: "col11",
      },
      {
        Header: "Action",
        accessor: "col12",
      },
    ],
    []
  );

  const fetchPaymentsData = async () => {
    setIsFetchingData(true);
    try {
      let queryArgs = [];
      if (!isAdmin) {
         // Filter to only show payments for this owner's stations
         queryArgs = [{ field: "stationOwnerId", operator: "==", value: ownerData.id }];
      }

      const querySnapshot = await getDocuments("payments", queryArgs);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Sort by creation date descending
      fetchedData.sort((a,b) => {
         if (!a.createdAt || !b.createdAt) return 0;
         return b.createdAt.seconds - a.createdAt.seconds;
      });

      setPaymentsData(fetchedData);
    } catch (error) {
      console.error("Error fetching payments data:", error);
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    fetchPaymentsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerData, isAdmin]);

  return (
    <div className="page-wrapper">
      <div className={"data-list-section"}>
        <PageHeader title={`Payments Detailed (${data.length})`} />
        <div className="flex flex--column gap--20 table-container mt--page">
          <Table
            columns={columns}
            data={data}
            loading={isFetchingData}
            tableTitle={"Payments Summary"}
          />
        </div>
      </div>
    </div>
  );
};

export default Payments;
