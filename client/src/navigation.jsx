import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { MdOutlinePets, MdLocationCity, MdDashboard, MdPets } from "react-icons/md";

function Navigation() {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  return (
    <Navbar expand="md" bg="dark" variant="dark" className="shadow-sm">
      <Container>
        <Navbar.Brand onClick={() => navigate("/")}> 
          <MdPets size={24} className="me-2 align-middle" />
          ShelterTrack
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/")} active={currentPath === "/"}>
              <MdDashboard size={18} className="me-1" />Dashboard
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/animals")} active={currentPath.startsWith("/animals") && currentPath !== "/animal"}>
              <MdOutlinePets size={18} className="me-1" />Animals
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/shelters")} active={currentPath === "/shelters"}>
              <MdLocationCity size={18} className="me-1" />Shelters
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
