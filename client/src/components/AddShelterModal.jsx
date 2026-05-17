import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { createShelter } from "../fetch-helper";

function AddShelterModal({ show, onHide, onCreated }) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await createShelter({ name, occupancy: 0, capacity: Number(capacity), phone, address });
      onCreated && onCreated();
    } catch (e) {
      alert(e.message || "Failed to create shelter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add shelter</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Capacity</Form.Label>
            <Form.Control type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Phone</Form.Label>
            <Form.Control value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Address</Form.Label>
            <Form.Control value={address} onChange={(e) => setAddress(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Create"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddShelterModal;
