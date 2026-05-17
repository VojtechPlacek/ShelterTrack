import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Row } from "react-bootstrap";
import { getPets, getShelters } from "../fetch-helper";
import RegisterAnimalModal from "../components/RegisterAnimalModal";
import Loading from "../common/loading";
import Error from "../common/error";

function Animals() {
  const navigate = useNavigate();
  const [result, setResult] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [species, setSpecies] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [shelterId, setShelterId] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");

  const load = () => {
    setLoading(true);
    const params = {};
    if (species) params.species = species;
    if (status) params.status = status;
    if (shelterId) params.shelterId = shelterId;
    if (sort) params.sort = sort;
    if (order) params.order = order;

    Promise.all([getPets(params), getShelters()])
      .then(([data, shelterData]) => {
        setError("");
        setResult(data.itemList || []);
        setShelters(shelterData.itemList || []);
      })
      .catch((e) => setError(e.message || "Failed to load animals"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [species, status, shelterId, sort, order]);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Animals</h1>
          <p className="text-muted">Browse registered animals and open an animal card for details.</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowRegister(true)}>
            Register animal
          </Button>
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
          {result.map((animal) => (
            <Col key={animal.id}>
              <Card className="dashboard-card h-100">
                <Card.Body>
                  <Card.Title>{animal.name}</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">{animal.species}</Card.Subtitle>
                  <div className="mb-2">
                    <strong>Age:</strong> {animal.age}
                  </div>
                  <div className="mb-2">
                    <strong>Status:</strong> {animal.status}
                  </div>
                  <div className="mb-3">
                    <strong>Shelter:</strong> {animal.shelter?.name || "Unknown"}
                  </div>
                  <Button onClick={() => navigate(`/animal/${animal.id}`)}>Open animal</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <RegisterAnimalModal show={showRegister} onHide={() => setShowRegister(false)} onCreated={() => { setShowRegister(false); load(); }} />
    </>
  );
}

export default Animals;
