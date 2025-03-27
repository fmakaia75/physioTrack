"use client";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import CoachDashboard from "./coach-dashboard";

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <Provider store={store}>
        <CoachDashboard />
      </Provider>
    </UserProvider>
  );
};

export default ClientProvider;