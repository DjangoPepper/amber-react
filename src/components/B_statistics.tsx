//BStatistics.tsx

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../stores/rootStore";
import DataAction from "../stores/dataS/DataAction";

import { export_stepe_catalog_Data } from "../stores/dataS/DataReducer";
import { Table } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { affectation } from "../utils/destination";

import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

export default function Statistics() {
  const dispatch = useDispatch();
  const [Extended_Tally_Value, setExtendedTallyValue] = useState(false);
  const [checkbox_Hold_State, setCheckboxHoldState] = useState<{
    [key: string]: boolean;
  }>({});
  const [previous_Value_QT, setPreviousValueQT] = useState<{
    [key: string]: string;
  }>({});
  const [previous_Value_TO, setPreviousValueTO] = useState<{
    [key: string]: { prevTO_VALUE: string };
  }>({});
  const [maxi_Value_TO, setMaxiValues] = useState<{
    [key: string]: { maxi_To: string };
  }>({});
  const selectedColors = useSelector<RootState, { [key: string]: string }>(
    (state) => state.dataSS.pickerColors
  );
  const catalog_data = useSelector<RootState, export_stepe_catalog_Data[]>(
    (state) => state.dataSS.catalog_data_state
  );

  let totalCount = 0,
    totalWeight = 0,
    totalCalesCount = 0,
    totalCalesWeight = 0,
    totalstockCount = 0,
    totalstockWeight = 0;

  // Récupérer les valeurs stockées dans le localStorage lors du montage du composant
  useEffect(() => {
    const punits = window.localStorage.getItem("local_punit");
    if (punits) setPreviousValueQT(JSON.parse(punits));
  }, []);

  // Sauvegarde des valeurs de punits dans le localStorage à chaque mise à jour
  useEffect(() => {
    window.localStorage.setItem(
      "local_punit",
      JSON.stringify(previous_Value_QT)
    );
  }, [previous_Value_QT]);

  const handleExtendedTally = () => {
    setExtendedTallyValue(!Extended_Tally_Value);
  };

  const ToggleCheckboxBoolean = (k: string) => {
    const updatedCheckboxState = { ...checkbox_Hold_State };
    const hasValues =
      Number(previous_Value_QT[k]) > 0 ||
      Number(previous_Value_TO[k]?.prevTO_VALUE) > 0 ||
      Number(maxi_Value_TO[k]?.maxi_To) > 0;

    if (updatedCheckboxState[k] !== undefined) {
      if (hasValues && updatedCheckboxState[k] === false) {
        updatedCheckboxState[k] = true;
        toast.error("Ligne tally pleine", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500,
        });
      } else {
        updatedCheckboxState[k] = !updatedCheckboxState[k];
      }
    } else {
      updatedCheckboxState[k] = true;
    }

    setCheckboxHoldState(updatedCheckboxState);
    dispatch(
      DataAction.change_checkbox_state({ [k]: updatedCheckboxState[k] })
    );
    dispatch(DataAction.save_checkbox_state());
  };

  const handlePrevQTValueChange = (destination: string, value: string) => {
    setPreviousValueQT((prev) => ({ ...prev, [destination]: value }));
    dispatch(DataAction.change_previous_qtt({ destination, value }));
    dispatch(DataAction.save_previous_qtt());
  };

  const handlePrevTOValueChange = (destination: string, value: string) => {
    setPreviousValueTO((prev) => ({
      ...prev,
      [destination]: { prevTO_VALUE: value },
    }));
    dispatch(DataAction.change_previous_tons({ destination, value }));
    dispatch(DataAction.save_previous_tons());
  };

  const handleMaxiTOValueChange = (destination: string, value: string) => {
    setMaxiValues((prev) => ({ ...prev, [destination]: { maxi_To: value } }));
    dispatch(DataAction.change_maxi_tons({ destination, value }));
    dispatch(DataAction.save_maxi_tons());
  };

  const totalPreviousCalesCount = Object.values(previous_Value_QT).reduce(
    (total, value) => total + (parseFloat(value) || 0),
    0
  );
  const totalPreviousCalesWeight = Object.values(previous_Value_TO).reduce(
    (total, { prevTO_VALUE }) => total + (parseFloat(prevTO_VALUE) || 0),
    0
  );

  const statistics = catalog_data.reduce<
    Record<string, { count: number; weight: number }>
  >((acc, row) => {
    if (!acc[row.destination]) acc[row.destination] = { count: 0, weight: 0 };
    acc[row.destination].count += 1;
    acc[row.destination].weight += parseFloat(row.weight.toFixed(3));
    return acc;
  }, {});

  Object.values(statistics).forEach((destinationStats) => {
    totalCount += destinationStats.count;
    totalWeight += destinationStats.weight;
    totalCalesCount = totalCount;
    totalCalesWeight = totalWeight;

    if (statistics.stock) {
      totalstockCount = statistics.stock.count;
      totalstockWeight = parseFloat(statistics.stock.weight.toFixed(3));
      totalCalesCount = totalCount - totalstockCount;
      totalCalesWeight = parseFloat(
        (totalWeight - totalstockWeight).toFixed(3)
      );
    }
  });

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>DesT</th>
            <th style={{ textAlign: "center" }}>
              <Button variant="info" onClick={handleExtendedTally}>
                T
              </Button>
            </th>
            <th style={{ textAlign: "center" }}>Units</th>
            <th style={{ textAlign: "center" }}>Kilos</th>
            {Extended_Tally_Value && (
              <>
                <th style={{ textAlign: "center", backgroundColor: "gray" }}>
                  P Units
                </th>
                <th style={{ textAlign: "center", backgroundColor: "gray" }}>
                  P Kilos
                </th>
              </>
            )}
            <th style={{ textAlign: "center" }}>TT_Q</th>
            <th style={{ textAlign: "center" }}>TT_T</th>
          </tr>
        </thead>
        <tbody>
          {affectation.map((affectationItem) => {
            const statisticsArray = statistics[affectationItem.name] || {};
            const chsafin = checkbox_Hold_State[affectationItem.name] || false;

            if (chsafin || statisticsArray.count > 0) {
              return (
                <tr key={affectationItem.name}>
                  <td
                    style={{
                      backgroundColor: selectedColors[affectationItem.name],
                      textAlign: "left",
                    }}
                  >
                    {affectationItem.name}
                  </td>
                  {affectationItem.name !== "stock" && (
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={checkbox_Hold_State[affectationItem.name]}
                        onChange={() =>
                          ToggleCheckboxBoolean(affectationItem.name)
                        }
                      />
                    </td>
                  )}
                  <td style={{ textAlign: "center" }}>
                    {statisticsArray.count || 0}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {(statisticsArray.weight || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    })}
                  </td>
                  {affectationItem.name !== "stock" && Extended_Tally_Value && (
                    <>
                      <td
                        style={{ textAlign: "center", backgroundColor: "gray" }}
                      >
                        <input
                          style={{ width: "90%" }}
                          type="number"
                          value={previous_Value_QT[affectationItem.name] || ""}
                          onChange={(e) =>
                            handlePrevQTValueChange(
                              affectationItem.name,
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td
                        style={{ textAlign: "center", backgroundColor: "gray" }}
                      >
                        <input
                          style={{ width: "90%" }}
                          type="number"
                          value={
                            previous_Value_TO[affectationItem.name]
                              ?.prevTO_VALUE || ""
                          }
                          onChange={(e) =>
                            handlePrevTOValueChange(
                              affectationItem.name,
                              e.target.value
                            )
                          }
                        />
                      </td>
                    </>
                  )}
                  <td style={{ textAlign: "center", backgroundColor: "gray" }}>
                    {(
                      parseFloat(
                        previous_Value_QT[affectationItem.name] || "0"
                      ) + statisticsArray.count
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    })}
                  </td>
                  <td style={{ textAlign: "center", backgroundColor: "gray" }}>
                    {(
                      parseFloat(
                        previous_Value_TO[affectationItem.name]?.prevTO_VALUE ||
                          "0"
                      ) + statisticsArray.weight
                    ).toLocaleString("en-US", {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    })}
                  </td>
                </tr>
              );
            }
            return null;
          })}
          <tr>
            <td style={{ backgroundColor: "gray", textAlign: "left" }}>
              STOCK
            </td>
            <td colSpan={6}></td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
