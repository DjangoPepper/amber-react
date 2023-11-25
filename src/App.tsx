import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './stores/rootStore';
import DataAction from './stores/dataS/DataAction';
import { stepe_Data } from './stores/dataS/DataReducer';
import { Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { toast, ToastContainer } from 'react-toastify';
import { affectation } from './utils/destination';

interface StatisticsProps {
	updateFirstRender: (value: boolean) => void;
}

const Statistics: React.FC<StatisticsProps> = ({ updateFirstRender }) => {
	const dispatch = useDispatch();

  // State pour gérer les valeurs précédentes et maximales
	const [previousValueTO, setPreviousValueTO] = useState<{ [key: string]: { prevTO_VALUE: string } }>({});
	const [previousValueQT, setPreviousValueQT] = useState<{ [key: string]: { prevQT_VALUE: string } }>({});
	const [maxiValuesTO, setMaxiValues] = useState<{ [key: string]: { maxi_To: string } }>({});
	const [checkboxHoldState, setCheckboxHoldState] = useState<{ [key: string]: { checkbox_VALUE: boolean } }>({});

  // State pour gérer l'affichage étendu
	const [extendedTallyValue, setExtendedTallyValue] = useState(false);

  // Handler pour basculer l'affichage étendu
	const handleExtendedTally = () => {
    setExtendedTallyValue((prevValue) => !prevValue);
		};

  // Handler pour basculer l'état de la case à cocher
  const toggleCheckboxBooleanValueChange = (k: string) => {
    const updatedCheckboxState = { ...checkboxHoldState };

    if (updatedCheckboxState[k] !== undefined) {
      updatedCheckboxState[k].checkbox_VALUE = !updatedCheckboxState[k].checkbox_VALUE;
    } else {
      updatedCheckboxState[k] = { checkbox_VALUE: true };
    }

    setCheckboxHoldState(updatedCheckboxState);
    dispatch(DataAction.change_CHECKBOX_STATE({ key: k, value: updatedCheckboxState[k].checkbox_VALUE }));
  };

  // Handlers pour les changements de valeurs précédentes et maximales
  const handleMaxiTOValueChange = (k: string, value: string) => {
    setMaxiValues((maxiValuesTO) => ({
      ...maxiValuesTO,
      [k]: { maxi_To: value },
    }));
    const numericValue = parseFloat(value) || 0;
    dispatch(DataAction.changeMaxiTONS({ destination: k, value: numericValue }));
  };

  const handlePreviousQTValueChange = (k: string, value: string) => {
    setPreviousValueQT((previousValueQT) => ({
      ...previousValueQT,
      [k]: {
        prevQT_VALUE: value,
      },
    }));
    let numericValue = parseFloat(value) || 0;
    dispatch(DataAction.changePreviousQTT({ destination: k, value: numericValue }));
  };

  const handlePreviousTOValueChange = (k: string, value: string) => {
    setPreviousValueTO((previousValueTO) => ({
      ...previousValueTO,
      [k]: {
        prevTO_VALUE: value,
      },
    }));
    let numericValue = parseFloat(value) || 0;
    dispatch(DataAction.changePreviousTONS({ destination: k, value: numericValue }));
  };

  // Récupération des données depuis le store Redux
  const catalogData = useSelector<RootState, stepe_Data[]>((state) => state.data.Interfaced_data_state);
  const selectedColors = useSelector<RootState, { [key: string]: string }>((state) => state.data.pickerColors);

  // Autres variables de calcul
  let totalCount = 0;
  let totalWeight = 0;

  let totalCalesCount = 0;
  let totalCalesWeight = 0;

  let totalStockCount = 0;
  let totalStockWeight = 0;

  // Logique de calcul
  // ...

  return (
    <div>
      {/* Le reste du rendu JSX */}
    </div>
  );
};

export default Statistics;
