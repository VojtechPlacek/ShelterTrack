import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function AnimalFilterModal({ show, onHide, onApply, shelters, currentSpecies, currentStatus, currentShelterId }) {
  const [species, setSpecies] = useState(currentSpecies || "");
  const [status, setStatus] = useState(currentStatus || "");
  const [shelterId, setShelterId] = useState(currentShelterId || "");

  const handleApply = () => {
    onApply(species, status, shelterId);
  };

  const handleClear = () => {
    onApply("", "", "");
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Filter Animals</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Species</Form.Label>
          <Form.Control
            placeholder="e.g., Dog, Cat, Bunny"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Any status</option>
            <option value="Available">Available</option>
            <option value="Under Treatment">Under Treatment</option>
            <option value="Reserved">Reserved</option>
            <option value="Adopted">Adopted</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Shelter</Form.Label>
          <Form.Select value={shelterId} onChange={(e) => setShelterId(e.target.value)}>
            <option value="">Any shelter</option>
            {shelters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleApply}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AnimalFilterModal;
