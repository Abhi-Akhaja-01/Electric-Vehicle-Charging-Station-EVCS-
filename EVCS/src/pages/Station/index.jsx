import React, { useState, useCallback, useEffect, useMemo } from "react";
import Table from "../../Components/common/table";
import PageHeader from "../../Components/common/pageHeader";
import Modal from "../../Components/common/Modal";
import Button from "../../Components/common/Button";
import { CiEdit } from "react-icons/ci";
import { Form, Image, Input, Select } from "antd";
import { toast } from "react-toastify";
import useFirebaseContext from "../../hooks/firebase";
import { ALL_CITIES, CHARGING_PLUGS } from "../../constant";
import { useSelector } from "react-redux";  

const Station = () => {
  const [settingData, setSettingData] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const { addDocument, updateDocument, getDocuments } = useFirebaseContext();
  const [form] = Form.useForm();
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const { isAdmin, ownerData } = useSelector((state) => state);

  const handleSettingData = useCallback((initialData, data) => {
    data.forEach((item, ind) => {
      initialData.push({
        col1: ind + 1,
        col2: <Image src={item.stationImage} alt="" height={50} width={100} />,
        col3: item.stationName,
        col4: item.state,
        col5: item.city,
        col10: item.ownerName || "-",
        col12: item.ownerEmail || "-",
        col6: item.plugs.map((name, i) => (
          <p key={i}>
            {name} {i !== item.plugs.length - 1 && ","}
          </p>
        )),
        col11: item.price,
        col7: item.openTime,
        col8: item.closeTime,
        col9: (
          <div className="flex align-items--center justify-content--center gap--15">
            <CiEdit
              style={{ height: 22, width: 22 }}
              onClick={() => {
                form.setFieldsValue(item);
                setUpdateId(item.id);
                setIsModalOpen(true);
              }}
            />
          </div>
        ),
      });
    });
    return initialData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data = useMemo(
    () => handleSettingData([], settingData),
    [settingData, handleSettingData]
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
        accessor: "col10",
      },
      {
        Header: "Email ID",
        accessor: "col12",
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
        Header: "Action",
        accessor: "col9",
      },
    ],
    []
  );

  const getOwnerStationData = useCallback(async () => {
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
      await getDocuments("stations", !isAdmin ? query : []).then(
        (querySnapshot) => {
          const STATION_DATA = querySnapshot.docs.map((doc) => {
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
          setSettingData(STATION_DATA);
          setIsFetchingData(false);
        }
      );
    } catch (error) {
      console.log(error.message);
      setIsFetchingData(false);
    }
  }, [getDocuments, isAdmin, ownerData.id, ownerData.name, ownerData.email]);

  useEffect(() => {
    getOwnerStationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerData, isAdmin]);

  const handleReset = () => {
    form.resetFields(); // This will reset all fields in the form
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setLoading(false);
    setUpdateId(null);
    handleReset();
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      console.log("values" ,values);      
      if (!updateId) {
        await addDocument("stations", { ...values});
      } else {
        await updateDocument("stations", updateId, {
          ...values,
        });
      }
      toast.success(`Station ${updateId ? "Updated" : "Added"} Successful`);
      getOwnerStationData();
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

  return (
    <div className="page-wrapper">
      <Modal
        isVisible={isModalOpen}
        title={"Station"}
        onClose={handleCloseModal}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt--10"
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
                message: "plugs is required",
              },
            ]}
          >
            <Select
              placeholder="Select Plugs"
              mode="multiple"
              onSelect={(city) => setSelectedCity(city)}
            >
              {selectedState &&
                CHARGING_PLUGS.map((plug, i) => (
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
          <Button
            type="submit"
            className="full-width"
            loading={isLoading}
            style={{ marginTop: 50 }}
          >
            {updateId ? "Update Station" : "Add Station"}
          </Button>
        </Form>
      </Modal>
      <div className={"data-list-section"}>
        <PageHeader title="Station" />
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

export default Station;
