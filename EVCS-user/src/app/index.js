import { useEffect,useState } from "react";
import { Redirect } from "expo-router";
import { routes } from "../routes/routes";
import { retrieveData } from "../services/local";

export default () => {
  const [token, setToken] = useState(null);
  const checkUser = async () => {
    const userToken = await retrieveData("token");
    setToken(userToken);
  };
  useEffect(() => {
    checkUser();
  }, []);
  return token ? (
    <Redirect href={routes.home.index.path} />
  ) : (
    <Redirect href={routes.auth.start.path} />
  );
};
