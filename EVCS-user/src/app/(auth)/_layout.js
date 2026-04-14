import { Link, Redirect, Stack } from "expo-router";
import { routes, sectionToArray } from "../../routes/routes";
import DevMenu from "../../components/DevMenu";
import { uuid4 } from "../../helpers/common";
import { useEffect, useState } from "react";
import { retrieveData } from "../../services/local";

export default () => {
  const [token, setToken] = useState(null);
  const checkUser = async () => {
    const userToken = await retrieveData("token");
    setToken(userToken);
    // console.log("userToken : ",userToken)
  };
  useEffect(() => {
    checkUser();
  }, []);
  if (token) return <Redirect href={routes.home.index.path} />;
  return (
    <Stack
      screenOptions={{
        headerRight: (props) => <DevMenu />,
        headerShown: false,
      }}
    >
      {sectionToArray(routes.auth).map((r) => (
        <Stack.Screen key={uuid4()} name={r.name} options={r.options} />
      ))}
    </Stack>
  );
};
