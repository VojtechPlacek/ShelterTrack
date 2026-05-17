import React, { useState } from "react";
import { Button, Collapse, Table } from "react-bootstrap";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function ShelterTable({ shelters, animals }) {
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  return (
    <Table responsive bordered hover className="mb-0 align-middle">
      <thead className="table-light">
        <tr>
          <th>Shelter</th>
          <th>Phone number</th>
          <th>Address</th>
          <th>Capacity</th>
          <th className="text-center">Open</th>
        </tr>
      </thead>
      <tbody>
        {shelters.map((shelter) => {
          const shelterAnimals = animals.filter((item) => item.shelterId === shelter.id);
          const occupied = shelterAnimals.length;
          const isOpen = expanded[shelter.id] || false;

          return (
            <React.Fragment key={shelter.id}>
              <tr>
                <td>{shelter.name}</td>
                <td>{shelter.phone}</td>
                <td>{shelter.address}</td>
                <td>{occupied}/{shelter.capacity}</td>
                <td className="text-center">
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => setExpanded((prev) => ({ ...prev, [shelter.id]: !prev[shelter.id] }))}
                  >
                    {isOpen ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
                  </Button>
                </td>
              </tr>
              <tr>
                <td colSpan={5} className="p-0 border-0">
                  <Collapse in={isOpen}>
                    <div className="p-3 bg-white border-top">
                      {shelterAnimals.length === 0 ? (
                        <div className="text-muted">No animals in this shelter yet.</div>
                      ) : (
                        <div className="d-flex flex-column gap-2">
                          {shelterAnimals.map((animal) => (
                            <Button
                              key={animal.id}
                              variant="light"
                              className="text-start shadow-sm"
                              onClick={() => navigate(`/animal/${animal.id}`)}
                            >
                              <strong>{animal.name}</strong> • {animal.species} • Age {animal.age} • {animal.status}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Collapse>
                </td>
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
    </Table>
  );
}

export default ShelterTable;
