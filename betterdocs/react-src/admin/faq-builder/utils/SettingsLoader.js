// SettingsLoader.js
import { useEffect, useState } from "react";
import { getSettingsData } from "../utils/function";

const SettingsLoader = ({ children }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettingsData()
      .then((getSettings) => {
        setSettings(getSettings);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return <>{settings ? children(settings) : null}</>;
};

export default SettingsLoader;
