import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../stores/rootStore";
import DataAction from "../stores/dataS/DataAction";
import { stepe_Data } from "../stores/dataS/DataReducer";
import { Table } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import { affectation } from "../utils/destination";
import Button from 'react-bootstrap/Button';
import { toast, ToastContainer } from 'react-toastify';

// Définissez l'interface pour les props
interface StatisticsProps {
  updateFirstRender: (value: boolean) => void;
}

const Statistics: React.FC<StatisticsProps> = ({ updateFirstRender }) => {
  // Le reste du code de votre composant
  // ...

  return (
    <div>
      {/* Le reste du rendu JSX */}
    </div>
  );
};

export default Statistics;
