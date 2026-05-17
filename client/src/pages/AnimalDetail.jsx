import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { getPet, getShelters, updatePet, movePet } from "../fetch-helper";
import Loading from "../common/loading";
import Error from "../common/error";

function AnimalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [shelters, setShelters] = useState([]);
  const [status, setStatus] = useState("Available");
  const [shelterId, setShelterId] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([getPet(id), getShelters()])
      .then(([petData, shelterData]) => {
        setError("");
        setAnimal(petData);
        setStatus(petData.status);
        setShelterId(petData.shelterId);
        setShelters(shelterData.itemList || []);
      })
      .catch((e) => setError(e.message || "Failed to load animal details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5 w-100">
        <Loading size={2.5} spin />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center py-5 w-100">
        <Error message={error} />
      </div>
    );
  }

  if (!animal) {
    return (
      <Card className="dashboard-card p-4">
        <Card.Body>
          <h2>Animal not found</h2>
          <Button onClick={() => navigate(-1)}>Return to dashboard</Button>
        </Card.Body>
      </Card>
    );
  }

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const updated = await updatePet({ id: animal.id, status });
      setAnimal(updated);
      alert("Status updated successfully");
    } catch (e) {
      alert(e.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleMoveAnimal = async () => {
    setUpdating(true);
    try {
      const updated = await movePet(animal.id, shelterId);
      setAnimal(updated);
      alert("Animal moved successfully");
    } catch (e) {
      alert(e.message || "Failed to move animal");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className="dashboard-card p-4">
      <Row>
        <Col xs={12} md={8}>
          <h2>{animal.name}</h2>
          <p className="mb-1">
            <strong>Species:</strong> {animal.species}
          </p>
          <p className="mb-1">
            <strong>Age:</strong> {animal.age}
          </p>
          <p className="mb-1">
            <strong>Status:</strong> {animal.status}
          </p>
        </Col>
        <Col xs={12} md={4} className="text-md-end">
          <Button variant="outline-secondary" onClick={() => navigate(-1)}>
            Close
          </Button>
        </Col>
      </Row>

      <Row className="mt-4 g-4">
        <Col xs={12} md={6}>
          <Card className="p-3 h-100">
            <Card.Body>
              <Card.Title>Current status</Card.Title>
              <Form.Select value={status} onChange={(event) => setStatus(event.target.value)} disabled={updating}>
                <option>Available</option>
                <option>Under Treatment</option>
                <option>Reserved</option>
                <option>Adopted</option>
              </Form.Select>
              <Button variant="primary" className="mt-3 w-100" onClick={handleUpdateStatus} disabled={updating}>
                {updating ? <Spinner animation="border" size="sm" /> : "Update status"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="p-3 h-100">
            <Card.Body>
              <Card.Title>Current shelter</Card.Title>
              <Form.Select value={shelterId} onChange={(event) => setShelterId(event.target.value)} disabled={updating}>
                {shelters.map((shelter) => (
                  <option key={shelter.id} value={shelter.id}>
                    {shelter.name}
                  </option>
                ))}
              </Form.Select>
              <Button variant="outline-primary" className="mt-3 w-100" onClick={handleMoveAnimal} disabled={updating}>
                {updating ? <Spinner animation="border" size="sm" /> : "Move animal"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card className="p-3 text-muted-small">
            <div>
              <strong>Animal ID:</strong> {animal.id}
            </div>
            <div>
              <strong>Shelter ID:</strong> {shelterId}
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );
}

export default AnimalDetail;
