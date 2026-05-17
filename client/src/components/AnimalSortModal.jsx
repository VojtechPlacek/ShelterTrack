import React, { useState } from "react";
import { Modal, Button, Form, ButtonGroup } from "react-bootstrap";

function AnimalSortModal({ show, onHide, onApply, currentSort, currentOrder }) {
  const [sort, setSort] = useState(currentSort || "name");
  const [order, setOrder] = useState(currentOrder || "asc");

  const handleApply = () => {
    onApply(sort, order);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sort Animals</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Sort by</Form.Label>
          <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="name">Name</option>
            <option value="species">Species</option>
            <option value="age">Age</option>
            <option value="status">Status</option>
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label>Order</Form.Label>
          <div>
            <ButtonGroup>
              <Button variant={order === "asc" ? "primary" : "outline-primary"} onClick={() => setOrder("asc")}>
                Ascending
              </Button>
              <Button variant={order === "desc" ? "primary" : "outline-primary"} onClick={() => setOrder("desc")}>
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
        <Button variant="primary" onClick={handleApply}>
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AnimalSortModal;
