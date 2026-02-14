import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import DataAction from "../stores/dataS/DataAction";
import { RootState } from "../stores/rootStore";
import { AffectationItem } from "../stores/dataS/DataReducer";

const generateRandomBlueGreenColor = (): string => {
    const r = Math.floor(Math.random() * 50);
    const g = Math.floor(150 + Math.random() * 105);
    const b = Math.floor(150 + Math.random() * 105);
    const toHex = (value: number) => value.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export default function AffectationManager() {
    const dispatch = useDispatch();
    const affectation = useSelector<RootState, AffectationItem[]>(
        (state) => state.dataSS.affectationList
    );

    const [newName, setNewName] = useState("");
    const [newColor, setNewColor] = useState(generateRandomBlueGreenColor());
    const [editingName, setEditingName] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const addAffectation = () => {
        const trimmed = newName.trim();
        if (!trimmed) return;
        if (affectation.some(a => a.name.toLowerCase() === trimmed.toLowerCase())) return;
        const newIndex = affectation.length;
        const updated = [...affectation, { name: trimmed, color: newColor, index: newIndex }];
        dispatch(DataAction.updateAffectation(updated));
        dispatch(DataAction.save_affectation());
        setNewName("");
        setNewColor(generateRandomBlueGreenColor());
    };

    const removeAffectation = (name: string) => {
        if (name === "stock") return;
        const updated = affectation.filter((a) => a.name !== name);
        dispatch(DataAction.updateAffectation(updated));
        dispatch(DataAction.save_affectation());
    };

    const startRename = (name: string) => {
        if (name === "stock") return;
        setEditingName(name);
        setEditValue(name);
    };

    const confirmRename = () => {
        if (!editingName) return;
        const trimmed = editValue.trim();
        if (!trimmed || trimmed === editingName) {
            setEditingName(null);
            return;
        }
        if (affectation.some(a => a.name.toLowerCase() === trimmed.toLowerCase())) {
            setEditingName(null);
            return;
        }
        dispatch(DataAction.renameAffectation(editingName, trimmed));
        dispatch(DataAction.save_affectation());
        setEditingName(null);
    };

    const handleRenameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") confirmRename();
        if (e.key === "Escape") setEditingName(null);
    };

    const changeColor = (name: string, color: string) => {
        const updated = affectation.map(a =>
            a.name === name ? { ...a, color } : a
        );
        dispatch(DataAction.updateAffectation(updated));
        dispatch(DataAction.save_affectation());
    };

    return (
        <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ width: "35%", border: "1px solid #ddd", padding: "8px" }}>Nom</th>
                        <th style={{ width: "15%", border: "1px solid #ddd", padding: "8px" }}>Couleur</th>
                        <th style={{ width: "50%", border: "1px solid #ddd", padding: "8px" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {affectation.map((a) => (
                        <tr key={a.name}>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                {editingName === a.name ? (
                                    <input
                                        type="text"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onBlur={confirmRename}
                                        onKeyDown={handleRenameKeyDown}
                                        maxLength={10}
                                        autoFocus
                                        style={{ width: "100%" }}
                                    />
                                ) : (
                                    a.name
                                )}
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                <input
                                    type="color"
                                    value={a.color}
                                    onChange={(e) => changeColor(a.name, e.target.value)}
                                    style={{ width: "30px", height: "24px", padding: "0", border: "none", cursor: "pointer" }}
                                />
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                {a.name !== "stock" && (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            onClick={() => startRename(a.name)}
                                            style={{ marginRight: "4px" }}
                                        >
                                            Renommer
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            onClick={() => removeAffectation(a.name)}
                                        >
                                            Supprimer
                                        </Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="Nouveau nom"
                    maxLength={10}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addAffectation()}
                    style={{ width: "150px" }}
                />
                <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    style={{ width: "40px", height: "28px", padding: "0", border: "none" }}
                />
                <Button onClick={addAffectation} disabled={!newName.trim()}>
                    Ajouter
                </Button>
            </div>
        </div>
    );
}
