import Navigation from "./navigation";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Navigation />
      <main className="container py-4">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
