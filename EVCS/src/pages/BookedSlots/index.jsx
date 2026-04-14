import React, { useState, useCallback, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Button as AntButton } from "antd";

import Table from "../../Components/common/table";
import PageHeader from "../../Components/common/pageHeader";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import Button from "../../Components/common/Button";
import { useSelector } from "react-redux";
import useFirebaseContext from "../../hooks/firebase";
import { toast } from "react-toastify";
import { REFUND_API } from "../../environment";

const BookedSlots = () => {
  const [slotsBookingData, setSlotsBookingData] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const { isAdmin, ownerData } = useSelector((state) => state);
  const { getDocuments, updateDocument } = useFirebaseContext();

  const handleApproveRejection = async (data) => {
    setIsFetchingData(true);
    try {
      const userId = data.userDetails.id;
      const stationId = data.stationDetails.id;
      // console.log("PaymentIntentId : ",)
      delete data["userDetails"];
      await updateDocument(`users/${userId}/booking`, data.id, {
        ...data,
        status: "cancelled",
        payment: "refunded",
      });
      console.log(data.paymentIntentId);

      const querySnapshot = await getDocuments("stations");
      const result = querySnapshot.docs.find((doc) => doc.id === stationId);
      const STATION_DATA = result.data();
      // eslint-disable-next-line array-callback-return
      const updatedSlotsData = STATION_DATA.slotsBooked.map((slots) => {
        if (
          slots.plug === data.plug &&
          slots.seconds === data.seconds &&
          slots.timing === data.timing &&
          data.status === "reject-request"
        ) {
          return { ...slots, status: "cancelled" };
        } else {
          return slots;
        }
      });
      await updateDocument(`stations`, stationId, {
        ...STATION_DATA,
        slotsBooked: updatedSlotsData,
      });
      toast.success(`Slot Booking Cancelled Successful`);
      console.log("ownerData",ownerData)
      await fetchSlotsBookingDataByUsers();
      // console.log('paymentIntentId..................',data.paymentIntentId);
      // console.log('price..................',data.price);


      if (data.paymentIntentId) {
        const response = await fetch(`${REFUND_API}/create-refund`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_intent: data.paymentIntentId,
          }),
        });
  
        console.log('response',response);
        
        const responseData = await response.json();
  
        if (response.ok && responseData.refund) {
          toast.success('Refund Successful', 'The refund was processed successfully.');
        } else {
          toast.error('Refund Failed', 'The refund process failed.');
        }
      } 
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookingData = useCallback((initialData, data) => {
    data.forEach((item, ind) => {
      initialData.push({
        col1: ind + 1,
        col2: item.userDetails?.name || "Unknown",
        col3: item.userDetails?.email || "-",
        col4: item.stationDetails?.stationName || "-",
        col13: item.ownerName || "-",
        col5: item.date?.seconds ? new Date(item.date.seconds * 1000).toDateString() : "-",
        col6: item.timing || "-",
        col7: item.plug || "-",
        col8: typeof item.price !== 'undefined' ? `₹${item.price}` : "-",
        col9: item.paymentType === "COD" ? "Cash On Delivery" : (item.paymentType ? "Card" : "-"),
        col10: item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleString() : "-",
        col11: (
          <Button
            className={`${
              item.status === "booked" ? "outline" : "danger"
            } text--capitalize`}
          >
            {item.status}
          </Button>
        ),
        col12:
          item.status === "reject-request" ? (
            <Button onClick={() => handleApproveRejection(item)}>
              {"Approve Rejection"}
            </Button>
          ) : (
            "N/A"
          ),
      });
    });
    return initialData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(
    () => handleBookingData([], slotsBookingData),
    [slotsBookingData, handleBookingData]
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
        Header: "Station Name",
        accessor: "col4",
      },
      {
        Header: "Station Owner Name",
        accessor: "col13",
      },
      {
        Header: "Schedule date",
        accessor: "col5",
      },
      {
        Header: "Schedule time",
        accessor: "col6",
      },
      {
        Header: "Plug",
        accessor: "col7",
      },
      {
        Header: "Amount",
        accessor: "col8",
      },
      {
        Header: "Payment Type",
        accessor: "col9",
      },
      {
        Header: "Booked at",
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
console.log("ownerData",ownerData)
  const getOwnerStationData = async () => {
    try {
      console.log("ownerData",ownerData)
      const query = [{ field: "owner", operator: "==", value: ownerData.id }];
      const querySnapshot = await getDocuments(
        "stations",
        !isAdmin ? query : []
      );
      const STATION_DATA = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return STATION_DATA;
    } catch (error) {
      console.log(error.message);
    }
  };

  const downloadCSV = () => {
    const headers = ["Sr.no", "User Name", "User Email", "Station Name", "Station Owner Name", "Schedule Date", "Schedule Time", "Plug", "Amount", "Payment Type", "Booked At", "Status"];
    const csvRows = [];
    csvRows.push(headers.join(","));
    slotsBookingData.forEach((item, ind) => {
      const col1 = ind + 1;
      const col2 = `"${item.userDetails?.name || "Unknown"}"`;
      const col3 = `"${item.userDetails?.email || "-"}"`;
      const col4 = `"${item.stationDetails?.stationName || "-"}"`;
      const col13 = `"${item.ownerName || "-"}"`;
      const col5 = `"${item.date?.seconds ? new Date(item.date.seconds * 1000).toDateString() : "-"}"`;
      const col6 = `"${item.timing || "-"}"`;
      const col7 = `"${item.plug || "-"}"`;
      const col8 = `"${typeof item.price !== 'undefined' ? item.price : "-"}"`;
      const col9 = `"${item.paymentType === "COD" ? "Cash On Delivery" : (item.paymentType ? "Card" : "-")}"`;
      const col10 = `"${item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleString() : "-"}"`;
      const col11 = `"${item.status}"`;
      
      csvRows.push([col1, col2, col3, col4, col13, col5, col6, col7, col8, col9, col10, col11].join(","));
    });
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "booked_slots_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchSlotsBookingDataByUsers = async () => {
    if (!isAdmin && !ownerData?.id) return;
    try {
      let stationData;
      let stationsMap = {};
      let ownersMap = {};

      if (!isAdmin) {
        console.log("ownerData",ownerData)
        stationData = await getOwnerStationData();
      } else {
         const ownersSnapshot = await getDocuments("owners");
         ownersSnapshot.docs.forEach((doc) => {
            ownersMap[doc.id] = doc.data().name || "Unknown";
         });

         const stationsSnapshot = await getDocuments("stations");
         stationsSnapshot.docs.forEach((doc) => {
             stationsMap[doc.id] = doc.data().owner;
         });
      }

      // Get reference to the users collection
      setIsFetchingData(true);
      const usersCollection = collection(db, "users");

      const usersSnapshot = await getDocs(usersCollection);

      const bookingData = [];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();

        const bookingCollectionRef = collection(userDoc.ref, "booking");

        const bookingSnapshot = await getDocs(bookingCollectionRef);

        bookingSnapshot.docs.forEach((bookingDoc) => {
          const bookingDataDoc = bookingDoc.data();
          const stationId = bookingDataDoc.stationDetails?.id;
          let ownerName = "Unknown";
          if (!isAdmin && ownerData) {
              ownerName = ownerData.name;
          } else if (isAdmin && stationId) {
              const ownerId = stationsMap[stationId];
              ownerName = ownerId ? (ownersMap[ownerId] || "Unknown") : "Unknown";
          }
          
          bookingData.push({
            userDetails: { id: userDoc.id, ...userData },
            id: bookingDoc.id,
            ownerName: ownerName,
            ...bookingDataDoc,
          });
          // console.log(bookingData);
        });
      }

      if (isAdmin) {
        setSlotsBookingData(bookingData);
      } else {
        console.log("stationData", stationData);
        // eslint-disable-next-line array-callback-return
        const filteredData = bookingData.filter((booking) => {
          const result = stationData.find(
            ({ id }) => id === booking.stationDetails.id
          );
          if (result) {
            return booking;
          }
        });
        setSlotsBookingData(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    fetchSlotsBookingDataByUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerData, isAdmin]);

  return (
    <div className="page-wrapper">
      <div className={"data-list-section"}>
        <PageHeader title={`Slot Booking (${data.length})`} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10, marginTop: 10 }}>
          <AntButton type="primary" onClick={downloadCSV}>Export to CSV</AntButton>
        </div>
        <div className="flex flex--column gap--20 table-container mt--page">
          <Table
            columns={columns}
            data={data}
            loading={isFetchingData}
            tableTitle={"Users Summary"}
          />
        </div>
      </div>
    </div>
  );
};

export default BookedSlots;
