import { createContext, useContext } from "react";

const DashboardContext = createContext();
export const DashboardContextProvider = DashboardContext.Provider;

export const useDashboardContext = () => {
	return useContext(  DashboardContext );
}