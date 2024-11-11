import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Dashboard from "./components/pages/Processes/ProcessEditor/ProcessEditor";
import Integration from "./components/pages/Integrations/Integration";
import IntegrationCatalog from "./components/pages/Integrations/IntegrationCatalog";
import Integrations from "./components/pages/Integrations/Integrations";
import ProcessEditor from "./components/pages/Processes/ProcessEditor/ProcessEditor";
import Processes from "./components/pages/Processes/Processes/ProcessList/Processes";
import Layout from "./components/shared/Layout";
import Page from "./components/pages/Documentation/Documentation";
import { useProcessData } from "./hooks/use-process";
import { useUser } from "@clerk/clerk-react";

function App() {
  const { user, isLoaded, isSignedIn } = useUser();
  const {
    fetchProcesses,
    fetchProcessById,
    createProcess,
    deleteProcess,
  } = useProcessData();

  if (!isSignedIn && isLoaded) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes (With Layout Header) */}
        <Route
          path="/"
          element={
            <Layout loading={!isLoaded}>
              <Dashboard userId={user?.id} fetchProcessById={fetchProcessById} />
            </Layout>
          }
        />
        <Route
          path="/processes"
          element={
            <Layout loading={!isLoaded}>
              <Processes
                user={user as {
                  id: string;
              }}
                deleteProcess={deleteProcess}
                createProcess={createProcess}
                fetchProcesses={fetchProcesses}
              />
            </Layout>
          }
        />
        <Route
          path="/processes/:processId"
          element={
            <Layout loading={!isLoaded}>
              <ProcessEditor userId={user?.id} fetchProcessById={fetchProcessById} />
            </Layout>
          }
        />
        <Route
          path="/integrations"
          element={
            <Layout loading={!isLoaded}>
              <Integrations userId={user?.id} />
            </Layout>
          }
        />
        <Route
          path="/integrations/:integrationId"
          element={
            <Layout loading={!isLoaded}>
              <Integration userId={user?.id} />
            </Layout>
          }
        />
        <Route
          path="/catalog"
          element={
            <Layout loading={!isLoaded}>
              <IntegrationCatalog />
            </Layout>
          }
        />
        <Route
          path="/documentation/*"
          element={
            <Layout loading={!isLoaded}>
              <Page />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout loading={!isLoaded}>
              <IntegrationCatalog />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
