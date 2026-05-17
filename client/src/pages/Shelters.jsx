import { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { getShelters } from "../fetch-helper";
import AddShelterModal from "../components/AddShelterModal";
import EditShelterModal from "../components/EditShelterModal";
import Loading from "../common/loading";
import Error from "../common/error";

function Shelters() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editShelter, setEditShelter] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getShelters()
      .then((data) => {
        setError("");
        setShelters(data.itemList || []);
      })
      .catch((e) => setError(e.message || "Failed to load shelters"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Shelters</h1>
          <p className="text-muted">Manage shelter records and review occupancy by location.</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowAdd(true)}>Add shelter</Button>
        </Col>
      </Row>

      {loading ? (
        <div className="d-flex justify-content-center py-5 w-100">
          <Loading size={2.5} spin />
        </div>
      ) : error ? (
        <Error message={error} />
      ) : (
        <Row xs={1} md={2} className="g-4">
          {shelters.map((shelter) => {
            const current = (shelter.pets || []).length;
            const available = (shelter.pets || []).filter((pet) => pet.status === "Available").length;
            return (
              <Col key={shelter.id}>
                <Card className="dashboard-card h-100">
                  <Card.Body>
                    <Card.Title>{shelter.name}</Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">{shelter.address}</Card.Subtitle>
                    <div className="mb-2">
                      <strong>Phone:</strong> {shelter.phone}
                    </div>
                    <div className="mb-2">
                      <strong>Capacity:</strong> {current}/{shelter.capacity}
                    </div>
                    <div className="mb-2 text-success">
                      <strong>Available:</strong> {available}
                    </div>
                    <Button variant="outline-primary" onClick={() => { setEditShelter(shelter); setShowEdit(true); }}>Edit shelter</Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <AddShelterModal show={showAdd} onHide={() => setShowAdd(false)} onCreated={() => { setShowAdd(false); load(); }} />
      <EditShelterModal show={showEdit} onHide={() => setShowEdit(false)} shelter={editShelter} onUpdated={() => { setShowEdit(false); load(); }} />
    </>
  );
}

export default Shelters;
