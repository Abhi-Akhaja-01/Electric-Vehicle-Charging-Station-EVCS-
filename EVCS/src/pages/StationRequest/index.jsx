import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  Fragment,
} from "react";
import { useSelector } from "react-redux";
import { FaEye } from "react-icons/fa";
import { CiCircleInfo, CiEdit } from "react-icons/ci";
import { Form, Image, Input, Select, Tooltip } from "antd";
import { toast } from "react-toastify";
import GoogleMapReact from "google-map-react";
import { AiOutlineDelete } from "react-icons/ai";

import Table from "../../Components/common/table";
import PageHeader from "../../Components/common/pageHeader";
import Modal from "../../Components/common/Modal";
import Button from "../../Components/common/Button";
import useFirebaseContext from "../../hooks/firebase";
import { ALL_CITIES, CHARGING_PLUGS } from "../../constant";
import style from "./station-request.module.scss";

import { MAPS_JAVASCRIPT_API } from "../../environment";

const STAUTS = {
  requested: "Requested",
  approved: "Approved",
  rejected: "Rejected",
};

const StationRequest = () => {
  const [stationRequestData, setStationRequestData] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDetailsModal, setIsDetailsModal] = useState(false);
  const [stationDetails, setStationDetails] = useState({});

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);        
  const [updateData, setUpdateData] = useState({});
  const [rejectId, setRejectId] = useState(null);

  const [isLoading, setLoading] = useState(false);
  const { addDocument, updateDocument, getDocuments, deleteDocument } =
    useFirebaseContext();
  const [form] = Form.useForm();
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const { isAdmin, ownerData } = useSelector((state) => state);
  const [currentLocation, setCurrentLocation] = useState();

  const handleStationRequestData = useCallback((initialData, data) => {
    data.forEach((item, ind) => {
      initialData.push({
        col1: ind + 1, 
        col2: <Image src={item.stationImage} alt="" height={50} width={100} />, 
        col3: item.stationName,
        col4: item.state,
        col5: item.city,
        col12: item.ownerName || "-",
        col13: item.ownerEmail || "-",
        col6: item.plugs.map((name, i) => (
          <p key={i}>
            {name} {i !== item.plugs.length - 1 && ","}
          </p>
        )),
        col11: item.price,
        col7: item.openTime,
        col8: item.closeTime,
        col9: (
          <Button
            className={`${
              item.status === "requested"
                ? "outline"
                : item.status === "rejected"
                ? "danger"
                : ""
            }`}
          >
            {STAUTS[item.status]}
          </Button>
        ),
        col10: (
          <div className="flex flex--wrap align-items--center justify-content--center gap--15">
            {!isAdmin && (
              <Fragment>
                <CiEdit
                  style={{ height: 22, width: 22 }}
                  onClick={() => {
                    form.setFieldsValue(item);
                    setUpdateData(item);
                    setUpdateId(item.id);
                    setIsModalOpen(true);
                  }}
                />
                <AiOutlineDelete
                  className="text--red font-size--22"
                  onClick={() => handleDeleteStation(item.id)}
                />
              </Fragment>
            )}
            {!isAdmin && item.status === "rejected" && (
              <Tooltip placement="left" title={item.rejectionMessage}>
                <CiCircleInfo size={30} />
              </Tooltip>
            )}
            {isAdmin && (
              <Fragment>
                <Button onClick={() => handleApproveStation(item)}>
                  Approve
                </Button>
                {item.status !== "rejected" && (
                  <Button
                    className="danger"
                    onClick={() => {
                      setIsRejectModalOpen(true);
                      setRejectId(item.id);
                    }}
                  >
                    Reject
                  </Button>
                )}
                <Button
                  className="outline gap--10"
                  onClick={() => {
                    setIsDetailsModal(true);
                    setStationDetails(item);
                  }}
                >
                  <FaEye />
                  View
                </Button>
              </Fragment>
            )}
          </div>
        ),
      });
    });
    return initialData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(
    () => handleStationRequestData([], stationRequestData),
    [stationRequestData, handleStationRequestData]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Sr.no",
        accessor: "col1",
      },
      {
        Header: "Station Image",
        accessor: "col2",
      },
      {
        Header: "Station Name",
        accessor: "col3",
      },
      {
        Header: "State",
        accessor: "col4",
      },
      {
        Header: "City",
        accessor: "col5",
      },
      {
        Header: "Owner Name",
        accessor: "col12",
      },
      {
        Header: "Email ID",
        accessor: "col13",
      },
      {
        Header: "Plugs",
        accessor: "col6",
      },
      {
        Header: "Price",
        accessor: "col11",
      },
      {
        Header: "Open Time",
        accessor: "col7",
      },
      {
        Header: "Close Time",
        accessor: "col8",
      },
      {
        Header: "Status",
        accessor: "col9",
      },
      {
        Header: "Action",
        accessor: "col10",
      },
    ],
    []
  );

  const getAllSettingRequestData = useCallback(async () => {
    if (!isAdmin && !ownerData?.id) return;
    setIsFetchingData(true);
    try {
      let ownersMap = {};
      let emailsMap = {};
      if (isAdmin) {
         const ownersSnapshot = await getDocuments("owners");
         ownersSnapshot.docs.forEach((doc) => {
            const data = doc.data();
            ownersMap[doc.id] = data.name || "Unknown";
            emailsMap[doc.id] = data.email || "Unknown";
         });
      }

      const query = [{ field: "owner", operator: "==", value: ownerData.id }];
      getDocuments("station-requests", !isAdmin ? query : []).then(
        (querySnapshot) => {
          const SETTING_DATA = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            let ownerName = "Unknown";
            let ownerEmail = "Unknown";
            if (!isAdmin) {
               ownerName = ownerData.name;
               ownerEmail = ownerData.email;
            } else {
               ownerName = ownersMap[data.owner] || "Unknown";
               ownerEmail = emailsMap[data.owner] || "Unknown";
            }
            return {
              ...data,
              id: doc.id,
              ownerName: ownerName,
              ownerEmail: ownerEmail,
            };
          });
          setStationRequestData(SETTING_DATA);
          setIsFetchingData(false);
        }
      );
    } catch (error) {
      console.log(error.message);
      setIsFetchingData(false);
    }
  }, [getDocuments, isAdmin, ownerData.id, ownerData.name, ownerData.email]);

  useEffect(() => {
    getAllSettingRequestData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerData, isAdmin]);

  const handleReset = () => {
    form.resetFields(); // This will reset all fields in the form
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsRejectModalOpen(false);
    setLoading(false);
    setUpdateId(null);
    handleReset();
    setUpdateData({});
    setIsDetailsModal(false);
    setStationDetails({});
  };

  const handleApproveStation = async (data) => {
    try {
      setLoading(true);
      const stationId = data.id
      delete data["id"];
      await addDocument("stations", {
        ...data,
        status: "approved",
        rejectionMessage: "",
        slotsBooked:[]
      });
      await deleteDocument("station-requests", stationId);
      toast.success(`Station Approved Successful`);
      getAllSettingRequestData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStation = async (id) => {
    setLoading(true);
    try {
      await deleteDocument("station-requests", id);
      toast.success(`Station Deleted Successfully`);
      getAllSettingRequestData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log({ ...values});
      if (!updateId) {
        await addDocument("station-requests", {
          ...values,
          lat: Number(values.lat),
          lng: Number(values.lng),
          owner: ownerData.id,
          status: "requested",
          isBlocked: false,
        });
      } else {
        await updateDocument("station-requests", updateId, {
          ...updateData,
          ...values,
          lat: Number(values.lat),
          lng: Number(values.lng),
          status: "requested",
        });
      }
      toast.success(`Station ${updateId ? "Updated" : "Added"} Successful`);
      getAllSettingRequestData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      handleCloseModal();
      setLoading(false);
    }
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedCity("");
  };

  const handleRejectStationRequest = async ({ rejectionMessage }) => {
    try {
      const stationData = stationRequestData.find(
        (data) => data.id === rejectId
      );
      setLoading(true);
      await updateDocument("station-requests", stationData.id, {
        ...stationData,
        rejectionMessage,
        status: "rejected",
      });
      toast.success(`Station Rejection Successful`);
      handleCloseModal();
      getAllSettingRequestData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          form.setFieldsValue({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="page-wrapper">
      {!isRejectModalOpen && (
        <Modal
          isVisible={isModalOpen}
          title={"Station Request"}
          onClose={handleCloseModal}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt--10"
            onValuesChange={(changedValues, allValues) => {
              if (changedValues.lat !== undefined || changedValues.lng !== undefined) {
                setCurrentLocation({
                  lat: Number(allValues.lat),
                  lng: Number(allValues.lng),
                });
              }
            }}
          >
            <Form.Item
              label="Station Name"
              name="stationName"
              rules={[{ required: true, message: "Station Name is required" }]}
            >
              <Input type="text" placeholder="Enter Station Name" />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <Input type="text" placeholder="Enter Address" />
            </Form.Item>
            <Form.Item
              label="PinCode"
              name="pinCode"
              rules={[{ required: true, message: "PinCode is required" }]}
            >
              <Input type="text" placeholder="Enter PinCode" />
            </Form.Item>
            <Form.Item
              label="State"
              name="state"
              rules={[
                {
                  required: true,
                  message: "Type is required",
                },
              ]}
            >
              <Select placeholder="Select State" onSelect={handleStateChange}>
                {Object.keys(ALL_CITIES).map((state, i) => (
                  <Select.Option value={state} key={i}>
                    {state}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              value={selectedCity}
              rules={[
                {
                  required: true,
                  message: "City is required",
                },
              ]}
            >
              <Select
                placeholder="Select City"
                onSelect={(city) => setSelectedCity(city)}
              >
                {selectedState &&
                  ALL_CITIES[selectedState].map((city, i) => (
                    <Select.Option value={city} key={i}>
                      {city}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Plugs"
              name="plugs"
              value={selectedCity}
              rules={[
                {
                  required: true,
                  message: "Plugs are required",
                },
              ]}
            >
              <Select
                placeholder="Select Plugs"
                mode="multiple"
                onSelect={(city) => setSelectedCity(city)}
              >
                {CHARGING_PLUGS.map((plug, i) => (
                  <Select.Option value={plug} key={i}>
                    {plug}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Price is required",
                },
              ]}
            >
              <Input type="number" placeholder="Enter Price" />
            </Form.Item>

            <Form.Item
              label="Open Time"
              name="openTime"
              rules={[
                {
                  required: true,
                  message: "Open Time is required",
                },
              ]}
            >
              <Input type="text" placeholder="Enter Open Time" />
            </Form.Item>
            <Form.Item
              label="Close Time"
              name="closeTime"
              rules={[
                {
                  required: true,
                  message: "Close Time is required",
                },
              ]}
            >
              <Input type="text" placeholder="Enter Close Time" />
            </Form.Item>
            <Form.Item
              label="Upload Image"
              name="stationImage"
              rules={[{ required: true, message: "Please add url of an image" }]}
            >
              <Input type="text" placeholder="Enter image url" />
            </Form.Item>
            
            <div className="flex gap--20" style={{ display: 'flex', gap: 20 }}>
              <Form.Item
                label="Latitude"
                name="lat"
                style={{ flex: 1 }}
                rules={[{ required: true, message: "Latitude is required" }]}
              >
                <Input type="number" step="any" placeholder="Enter Latitude" />
              </Form.Item>
              <Form.Item
                label="Longitude"
                name="lng"
                style={{ flex: 1 }}
                rules={[{ required: true, message: "Longitude is required" }]}
              >
                <Input type="number" step="any" placeholder="Enter Longitude" />
              </Form.Item>
            </div>

            <div style={{ height: 300, borderRadius: 20, overflow: "hidden" }}>
              {currentLocation && (
                <GoogleMapReact
                  bootstrapURLKeys={{
                    // key: "AIzaSyAPxVr83wbDkDHrd9WYDb93J6vQ316_4TA",
                    key: MAPS_JAVASCRIPT_API,
                  }}
                  center={currentLocation}
                  defaultCenter={currentLocation}
                  defaultZoom={18}
                >
                  <svg
                    stroke="#28b67e"
                    fill="#28b67e"
                    stroke-width="0"
                    version="1.2"
                    baseProfile="tiny"
                    viewBox="0 0 24 24"
                    height="5rem"
                    width="5em"
                    xmlns="http://www.w3.org/2000/svg"
                    lat={currentLocation.lat}
                    lng={currentLocation.lng}
                    text="My Marker"
                  >
                    <path d="M17.657 5.304c-3.124-3.073-8.189-3.073-11.313 0-3.124 3.074-3.124 8.057 0 11.13l5.656 5.565 5.657-5.565c3.124-3.073 3.124-8.056 0-11.13zm-5.657 8.195c-.668 0-1.295-.26-1.768-.732-.975-.975-.975-2.561 0-3.536.472-.472 1.1-.732 1.768-.732s1.296.26 1.768.732c.975.975.975 2.562 0 3.536-.472.472-1.1.732-1.768.732z"></path>
                  </svg>
                </GoogleMapReact>
              )}
            </div>
            <Button
              type="submit"
              className="full-width"
              loading={isLoading}
              style={{ marginTop: 50 }}
            >
              {updateId
                ? updateData.status === "rejected"
                  ? "Again Request with Updated Data"
                  : "Update Station Request"
                : "Add Station Request"}
            </Button>
          </Form>
        </Modal>
      )}
      {!isModalOpen && (
        <Modal
          isVisible={isRejectModalOpen}
          title={"Station Reject"}
          onClose={handleCloseModal}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleRejectStationRequest}
            className="mt--10"
          >
            <Form.Item
              label="Rejection Message"
              name="rejectionMessage"
              rules={[
                { required: true, message: "Rejection Message is required" },
              ]}
            >
              <Input type="text" placeholder="Enter Rejection Message" />
            </Form.Item>
            <Button
              type="submit"
              className="full-width danger"
              loading={isLoading}
              style={{ marginTop: 50 }}
            >
              Reject Station Request
            </Button>
          </Form>
        </Modal>
      )}

      <Modal
        isVisible={isDetailsModal}
        title={"Station Details"}
        onClose={handleCloseModal}
      >
        <div className=" mt--30">
          <img
            src={stationDetails.image}
            alt=""
            className={style.stationImage}
          />
        </div>
        <div className="flex mt--20">
          <span className={style["form-label"]}>Station Name</span> :
          <span className="font--medium ml--5 text--primary">
            {stationDetails.stationName}
          </span>
        </div>
        <div className="flex mt--20">
          <span className={style["form-label"]}>Owner Name</span> :
          <span className="font--medium ml--5 text--primary">
            {stationDetails.ownerName}
          </span> 
        </div>
        <div className="flex mt--20">
          <span className={style["form-label"]}>Owner Email</span> :
          <span className="font--medium ml--5 text--primary">
            {stationDetails.ownerEmail}
          </span> 
        </div>
        <div className="flex mt--20">
          <span className={style["form-label"]}>Address</span> :
          <span className="font--medium ml--5 text--primary">
            {stationDetails.address}
          </span>
        </div>
        <div className="flex mt--20">
          <span className={style["form-label"]}>City</span> :
          <span className="font--medium ml--5 text--primary">
            {stationDetails.city}
          </span>
        </div>
        <div className="flex mt--20">
          <span className={style["form-label"]}>PinCode</span> :
          <span className="font--medium ml--5 text--primary">
            {stationDetails.pinCode}
          </span>
        </div>
        <div className="flex mt--20">
          <span className={style["form-label"]}>State</span> :
          <span className="font--medium ml--5 text--primary">
            {stationDetails.state}
          </span>
        </div>
        <div className="flex mt--20">
          <span className={style["form-label"]}>Available Plugs</span> :
          {isDetailsModal &&
            stationDetails.plugs.map((name, i) => (
              <span className="font--medium ml--5 text--primary" key={i}>
                {name} {stationDetails.plugs.length !== i + 1 && ","}
              </span>
            ))}
        </div>
        <div className="flex mt--20">
          <span className={style["form-label"]}>Station Timing</span> :
          <span className="font--medium ml--5 text--primary">
            {stationDetails.openTime} - {stationDetails.closeTime}
          </span>
        </div>
        <div className="flex mt--20">
          <span className={style["form-label"]}>Status</span> :
          <span className="font--medium ml--5 text--primary">
            {stationDetails.status}
          </span>
        </div>
        <div className="flex mt--20">
          <span className={style["form-label"]}>Station Name</span> :
          <span className="font--medium ml--5 text--primary">
            {stationDetails.stationName}
          </span>
        </div>
        <div
          style={{ height: 300, borderRadius: 10, overflow: "hidden" }}
          className="mt--30"
        >
          {currentLocation && (
            <GoogleMapReact
              bootstrapURLKeys={{
                // key: "AIzaSyAPxVr83wbDkDHrd9WYDb93J6vQ316_4TA",
                key: MAPS_JAVASCRIPT_API,
              }}
              defaultCenter={{
                lat: stationDetails.lat,
                lng: stationDetails.lng,
              }}
              defaultZoom={18}
            >
              <svg
                stroke="#28b67e"
                fill="#28b67e"
                stroke-width="0"
                version="1.2"
                baseProfile="tiny"
                viewBox="0 0 24 24"
                height="5rem"
                width="5em"
                xmlns="http://www.w3.org/2000/svg"
                lat={currentLocation.lat}
                lng={currentLocation.lng}
                text="My Marker"
              >
                <path d="M17.657 5.304c-3.124-3.073-8.189-3.073-11.313 0-3.124 3.074-3.124 8.057 0 11.13l5.656 5.565 5.657-5.565c3.124-3.073 3.124-8.056 0-11.13zm-5.657 8.195c-.668 0-1.295-.26-1.768-.732-.975-.975-.975-2.561 0-3.536.472-.472 1.1-.732 1.768-.732s1.296.26 1.768.732c.975.975.975 2.562 0 3.536-.472.472-1.1.732-1.768.732z"></path>
              </svg>
            </GoogleMapReact>
          )}
        </div>
      </Modal>
      <div className={"data-list-section"}>
        <PageHeader
          title="Station Request"
          isAddBtn={!isAdmin}
          handleAdd={() => {
            setIsModalOpen(true);
          }}
        />
        <div className="flex flex--column gap--20 table-container mt--page">
          <Table
            columns={columns}
            data={data}
            loading={isFetchingData}
            tableTitle={"Station List"}
          />
        </div>
      </div>
    </div>
  );
};

export default StationRequest;
