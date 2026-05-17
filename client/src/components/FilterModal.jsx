import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function FilterModal({ show, onHide, onApply, currentFilter, shelters = [], currentSpecies = "", currentStatus = "", currentShelterId = "", currentMinAge = "", currentMaxAge = "" }) {
  const [fullFilter, setFullFilter] = useState(currentFilter || "all");

  const [species, setSpecies] = useState(currentSpecies || "");
  const [status, setStatus] = useState(currentStatus || "");
  const [shelterId, setShelterId] = useState(currentShelterId || "");
  const [minAge, setMinAge] = useState(currentMinAge || "");
  const [maxAge, setMaxAge] = useState(currentMaxAge || "");

  useEffect(() => {
    setFullFilter(currentFilter || "all");
  }, [currentFilter, show]);

  useEffect(() => {
    setSpecies(currentSpecies || "");
    setStatus(currentStatus || "");
    setShelterId(currentShelterId || "");
    setMinAge(currentMinAge || "");
    setMaxAge(currentMaxAge || "");
  }, [currentSpecies, currentStatus, currentShelterId, currentMinAge, currentMaxAge, show]);

  const handleApply = () => {
    onApply({ shelterFilter: fullFilter, animalFilter: { species: species || "", status: status || "", shelterId: shelterId || "", minAge: minAge || "", maxAge: maxAge || "" } });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Filter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Capacity (Shelters)</Form.Label>
          <Form.Select value={fullFilter} onChange={(e) => setFullFilter(e.target.value)}>
            <option value="all">All shelters</option>
            <option value="true">Full only</option>
            <option value="false">Available space only</option>
          </Form.Select>
        </Form.Group>

        <hr />

        <h6 className="mt-3">Animals</h6>
        <Form.Group className="mb-3">
          <Form.Label>Species</Form.Label>
          <Form.Control placeholder="e.g., Dog, Cat" value={species} onChange={(e) => setSpecies(e.target.value)} />
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

        <Form.Group className="mb-3">
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

        <Form.Group className="mb-3">
          <Form.Label>Minimum age</Form.Label>
          <Form.Control type="number" min="0" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Maximum age</Form.Label>
          <Form.Control type="number" min="0" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
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

export default FilterModal;
