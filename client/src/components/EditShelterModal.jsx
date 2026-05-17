import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { updateShelter, deleteShelter } from "../fetch-helper";

function EditShelterModal({ show, onHide, shelter, onUpdated }) {
  const [name, setName] = useState(shelter?.name || "");
  const [capacity, setCapacity] = useState(shelter?.capacity || 10);
  const [phone, setPhone] = useState(shelter?.phone || "");
  const [address, setAddress] = useState(shelter?.address || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(shelter?.name || "");
    setCapacity(shelter?.capacity || 10);
    setPhone(shelter?.phone || "");
    setAddress(shelter?.address || "");
  }, [shelter, show]);

  const submit = async () => {
    setLoading(true);
    try {
      await updateShelter({ id: shelter.id, name, capacity: Number(capacity), phone, address });
      onUpdated && onUpdated();
    } catch (e) {
      alert(e.message || "Failed to update shelter");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete shelter "${shelter?.name}"? This action cannot be undone.`)) return;
    setLoading(true);
    try {
      await deleteShelter(shelter.id);
      onUpdated && onUpdated();
    } catch (e) {
      alert(e.message || "Failed to delete shelter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit shelter</Modal.Title>
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
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Delete"}
        </Button>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Update"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditShelterModal;
