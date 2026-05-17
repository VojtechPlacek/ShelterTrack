import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { createPet, getShelters } from "../fetch-helper";

function RegisterAnimalModal({ show, onHide, onCreated }) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [age, setAge] = useState(1);
  const [status, setStatus] = useState("Available");
  const [shelterId, setShelterId] = useState("");
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      getShelters().then((data) => {
        setShelters(data.itemList || []);
        if (data.itemList && data.itemList[0]) setShelterId(data.itemList[0].id);
      });
    }
  }, [show]);

  const submit = async () => {
    setLoading(true);
    try {
      await createPet({ name, species, age: Number(age), status, shelterId });
      onCreated && onCreated();
    } catch (e) {
      alert(e.message || "Failed to create animal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Register new animal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Species</Form.Label>
            <Form.Control value={species} onChange={(e) => setSpecies(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Age</Form.Label>
            <Form.Control type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Status</Form.Label>
            <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Available</option>
              <option>Under Treatment</option>
              <option>Reserved</option>
              <option>Adopted</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Shelter</Form.Label>
            <Form.Select value={shelterId} onChange={(e) => setShelterId(e.target.value)}>
              {shelters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Register"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RegisterAnimalModal;
