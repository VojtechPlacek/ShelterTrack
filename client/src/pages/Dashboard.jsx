import { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { MdOutlinePets, MdRefresh, MdTune, MdSort } from "react-icons/md";
import { getPets, getShelters } from "../fetch-helper";
import ShelterTable from "../components/ShelterTable";
import SortModal from "../components/SortModal";
import FilterModal from "../components/FilterModal";
import Loading from "../common/loading";
import Error from "../common/error";

function Dashboard() {
  const [shelters, setShelters] = useState([]);
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [fullFilter, setFullFilter] = useState("all");
  const [targetSort, setTargetSort] = useState("shelter");
  const [animalSort, setAnimalSort] = useState("name");
  const [animalOrder, setAnimalOrder] = useState("asc");
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [shelterFilter, setShelterFilter] = useState("");
  const [minAgeFilter, setMinAgeFilter] = useState("");
  const [maxAgeFilter, setMaxAgeFilter] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [error, setError] = useState("");

  const loadData = () => {
    setLoading(true);
    const shelterParams = { search };
    if (sort) shelterParams.sort = sort;
    if (order) shelterParams.order = order;
    if (fullFilter === "true" || fullFilter === "false") shelterParams.full = fullFilter;

    const petParams = { search };
    if (animalSort) petParams.sort = animalSort;
    if (animalOrder) petParams.order = animalOrder;
    if (speciesFilter) petParams.species = speciesFilter;
    if (statusFilter) petParams.status = statusFilter;
    if (shelterFilter) petParams.shelterId = shelterFilter;
    if (minAgeFilter) petParams.minAge = minAgeFilter;
    if (maxAgeFilter) petParams.maxAge = maxAgeFilter;

    Promise.all([getShelters(shelterParams), getPets(petParams)])
      .then(([shelterData, petData]) => {
        setError("");
        let sList = shelterData.itemList || [];
        const pListRaw = petData.itemList || [];

        // Ensure filtering client-side in case backend doesn't support all params
        const pList = pListRaw.filter((p) => {
          if (speciesFilter && (!p.species || !p.species.toLowerCase().includes(speciesFilter.toLowerCase()))) return false;
          if (statusFilter && p.status !== statusFilter) return false;
          if (shelterFilter && p.shelterId !== shelterFilter) return false;
          if (minAgeFilter && Number(minAgeFilter) !== 0 && Number(p.age) < Number(minAgeFilter)) return false;
          if (maxAgeFilter && Number(maxAgeFilter) !== 0 && Number(p.age) > Number(maxAgeFilter)) return false;
          return true;
        });

        // If any animal filter is active, only show shelters that have matching animals
        if (speciesFilter || statusFilter || shelterFilter || minAgeFilter || maxAgeFilter) {
          const shelterIdsWithMatching = new Set(pList.map((p) => p.shelterId));
          sList = sList.filter((s) => shelterIdsWithMatching.has(s.id));
        }

        setShelters(sList);
        setPets(pList);
      })
      .catch((e) => setError(e.message || "Failed to load dashboard data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [search, sort, order, fullFilter, animalSort, animalOrder, speciesFilter, statusFilter, shelterFilter, minAgeFilter, maxAgeFilter]);

  const totalAvailable = useMemo(
    () => pets.filter((animal) => animal.status === "Available").length,
    [pets]
  );
  const totalAnimals = pets.length;

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col xs={12} md={8} className="mb-3 mb-md-0">
          <div className="d-flex align-items-center gap-2 mb-3">
            <MdOutlinePets size={36} className="text-primary" />
            <div>
              <h1 className="mb-1">Dashboard</h1>
              <p className="mb-0 text-muted">Manage pets, shelters, and occupancy in one view.</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="dashboard-card p-3 h-100">
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">Shelters</Card.Subtitle>
              <Card.Title>{shelters.length}</Card.Title>
              <Card.Text className="text-muted-small">Total shelters currently registered.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="dashboard-card p-3 h-100">
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">Animals</Card.Subtitle>
              <Card.Title>{totalAnimals}</Card.Title>
              <Card.Text className="text-muted-small">Total animals in all shelters.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}></Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}></Col>
        <Col md={4} className="d-flex gap-3 align-items-start justify-content-end">
            <Button
              variant="link"
              onClick={async () => {
                // reset non-default sorts/filters to defaults and reload
                setSort("name");
                setOrder("asc");
                setFullFilter("all");
                setAnimalSort("name");
                setAnimalOrder("asc");
                setSpeciesFilter("");
                setStatusFilter("");
                setShelterFilter("");
                setMinAgeFilter("");
                setMaxAgeFilter("");
                // fetch with defaults
                setLoading(true);
                try {
                  const shelterParams = { search, sort: "name", order: "asc" };
                  const petParams = { search, sort: "name", order: "asc" };
                  const [shelterData, petData] = await Promise.all([getShelters(shelterParams), getPets(petParams)]);
                  setShelters(shelterData.itemList || []);
                  setPets(petData.itemList || []);
                } catch (e) {
                  alert(e.message || "Failed to refresh data");
                } finally {
                  setLoading(false);
                }
              }}
              className="p-0 text-dark"
              title="Refresh"
            >
            <MdRefresh size={36} />
          </Button>
          <Button variant="link" onClick={() => setShowSort(true)} className="p-0 text-dark" title="Sort">
            <MdSort size={36} />
          </Button>
          <Button variant="link" onClick={() => setShowFilter(true)} className="p-0 text-dark" title="Filter">
            <MdTune size={36} />
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="dashboard-card p-4">
            <Form className="mb-3">
              <Form.Control
                size="lg"
                placeholder="Search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </Form>

            <h5 className="mb-1">Shelter list</h5>
            <p className="text-muted-small mb-3">Select a shelter to see resident animals.</p>

            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <Loading size={2.5} spin />
              </div>
            ) : error ? (
              <Error message={error} />
            ) : (
              <ShelterTable shelters={shelters} animals={pets} />
            )}
          </Card>
        </Col>
      </Row>

      <SortModal
        show={showSort}
        onHide={() => setShowSort(false)}
        onApply={(result) => {
          if (result?.shelter) {
            setSort(result.shelter.sort || sort);
            setOrder(result.shelter.order || order);
          }
          if (result?.animal) {
            setAnimalSort(result.animal.sort || animalSort);
            setAnimalOrder(result.animal.order || animalOrder);
          }
          setShowSort(false);
        }}
        currentSort={sort}
        currentOrder={order}
        currentAnimalSort={animalSort}
        currentAnimalOrder={animalOrder}
      />

      <FilterModal
        show={showFilter}
        onHide={() => setShowFilter(false)}
        onApply={(result) => {
          if (result?.shelterFilter !== undefined) {
            setFullFilter(result.shelterFilter);
          }
          if (result?.animalFilter) {
            setSpeciesFilter(result.animalFilter.species || "");
            setStatusFilter(result.animalFilter.status || "");
            setShelterFilter(result.animalFilter.shelterId || "");
            setMinAgeFilter(result.animalFilter.minAge || "");
          }
          setShowFilter(false);
        }}
        currentFilter={fullFilter}
        shelters={shelters}
        currentSpecies={speciesFilter}
        currentStatus={statusFilter}
        currentShelterId={shelterFilter}
        currentMinAge={minAgeFilter}
        currentMaxAge={maxAgeFilter}
      />
    </>
  );
}

export default Dashboard;
