import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Modal, Button } from "react-bootstrap";

interface Affectation {
    name: string;
    color: string;
    index: number;
}

interface AffectationManagerProps {
    affectation: Affectation[];
    setAffectation: React.Dispatch<React.SetStateAction<Affectation[]>>; // Ajout de setAffectation
}

const AffectationManager: React.FC<AffectationManagerProps> = ({ affectation, setAffectation }) => {
    const dispatch = useDispatch();

    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState("#000000");

    const addAffectation = () => {
        const newIndex = affectation.length;
        const newAffectation = [...affectation, { name: newName, color: newColor, index: newIndex }];
        setAffectation(newAffectation);
        setNewName("");
        setNewColor("#000000");
    };

    const removeAffectation = (name: string) => {
        const updatedAffectation = affectation.filter((a) => a.name !== name);
        setAffectation(updatedAffectation);
    };

    return (
        <div>
            <h3>Gestion des Affectations</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ width: "40%", border: "1px solid #ddd", padding: "8px" }}>Nom</th>
                        <th style={{ width: "40%", border: "1px solid #ddd", padding: "8px" }}>Couleur</th>
                        <th style={{ width: "20%", border: "1px solid #ddd", padding: "8px" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {affectation.map((a) => (
                        <tr key={a.name}>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{a.name}</td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                <div
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        backgroundColor: a.color,
                                        border: "1px solid #000",
                                    }}
                                ></div>
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                <button onClick={() => removeAffectation(a.name)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: "20px" }}>
                <input
                    type="text"
                    placeholder="Nom"
                    maxLength={10}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{ width: "150px", marginRight: "10px" }}
                />
                <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    style={{ marginRight: "10px" }}
                />
                <button onClick={addAffectation} disabled={!newName.trim()}>
                    Ajouter
                </button>
            </div>
        </div>
    );
};

const AffectationModal: React.FC<{
    showAffectationManager: boolean;
    handleCloseAffectationManager: () => void;
    affectation: Affectation[];
    setAffectation: React.Dispatch<React.SetStateAction<Affectation[]>>;
}> = ({ showAffectationManager, handleCloseAffectationManager, affectation, setAffectation }) => {
    return (
        <Modal show={showAffectationManager} onHide={handleCloseAffectationManager}>
            <Modal.Header closeButton>
                <Modal.Title>Gestion des Affectations</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AffectationManager
                    affectation={affectation}
                    setAffectation={setAffectation} // Passer setAffectation comme prop
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseAffectationManager}>
                    Fermer
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AffectationManager;
export { AffectationModal };