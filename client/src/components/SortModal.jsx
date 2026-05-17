import React, { useEffect, useState } from "react";
import { Modal, Button, Form, ButtonGroup } from "react-bootstrap";

function SortModal({ show, onHide, onApply, currentSort = "name", currentOrder = "asc", currentAnimalSort = "name", currentAnimalOrder = "asc" }) {
  const [shelterSort, setShelterSort] = useState(currentSort || "name");
  const [shelterOrder, setShelterOrder] = useState(currentOrder || "asc");

  const [animalSort, setAnimalSort] = useState(currentAnimalSort || "name");
  const [animalOrder, setAnimalOrder] = useState(currentAnimalOrder || "asc");

  useEffect(() => {
    setShelterSort(currentSort || "name");
    setShelterOrder(currentOrder || "asc");
    setAnimalSort(currentAnimalSort || "name");
    setAnimalOrder(currentAnimalOrder || "asc");
  }, [currentSort, currentOrder, currentAnimalSort, currentAnimalOrder, show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sort</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Shelter: Sort by</Form.Label>
          <Form.Select value={shelterSort} onChange={(e) => setShelterSort(e.target.value)}>
            <option value="name">Name</option>
            <option value="capacity">Capacity</option>
            <option value="occupancy">Occupancy</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Shelter: Order</Form.Label>
          <div>
            <ButtonGroup>
              <Button variant={shelterOrder === "asc" ? "primary" : "outline-primary"} onClick={() => setShelterOrder("asc")}>
                Ascending
              </Button>
              <Button variant={shelterOrder === "desc" ? "primary" : "outline-primary"} onClick={() => setShelterOrder("desc")}>
                Descending
              </Button>
            </ButtonGroup>
          </div>
        </Form.Group>

        <hr />

        <Form.Group className="mb-3">
          <Form.Label>Animals: Sort by</Form.Label>
          <Form.Select value={animalSort} onChange={(e) => setAnimalSort(e.target.value)}>
            <option value="name">Name</option>
            <option value="species">Species</option>
            <option value="age">Age</option>
            <option value="status">Status</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Animals: Order</Form.Label>
          <div>
            <ButtonGroup>
              <Button variant={animalOrder === "asc" ? "primary" : "outline-primary"} onClick={() => setAnimalOrder("asc")}>
                Ascending
              </Button>
              <Button variant={animalOrder === "desc" ? "primary" : "outline-primary"} onClick={() => setAnimalOrder("desc")}>
                Descending
              </Button>
            </ButtonGroup>
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => onApply({ shelter: { sort: shelterSort, order: shelterOrder }, animal: { sort: animalSort, order: animalOrder } })}
        >
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SortModal;
