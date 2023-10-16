import {useSelector, useDispatch} from "react-redux";
import {RootState} from "../stores/rootStore";
import {Data} from "../stores/data/DataReducer";
import {Table} from "react-bootstrap";
import {colors} from "../utils/destination";
import React, { useState } from 'react';
//FRed
import DataAction from "../stores/data/DataAction";
//FRed

export default function Statistics() {
	//fred
	const dispatch = useDispatch();	
	const [previous_Values, setprevious_Values] = useState<{ [key: string]: { prevQt: string; previous_Tons: string } }>({});
	const [prevQt, setPrevQt] = useState<number>(0);
  	const [previous_Tons, setPrevTo] = useState<number>(0);
	
	const handle_PrevQtChange = (k: string, value: string) => {
		setprevious_Values((previous_Values) => ({
		  ...previous_Values,
		  [k]: { prevQt: value, previous_Tons: previous_Values[k] ? previous_Values[k].previous_Tons : '0' },
		}));
		let numericValue = parseFloat(value) || 0;
		dispatch(DataAction.changePreviousQTT({ destination: k, value: numericValue }));
	  };
	  
	const handle_MaxiToChange = (k: string, value: string) => {
	setprevious_Values((previous_Values) => ({
		...previous_Values,
		[k]: { prevQt: previous_Values[k] ? previous_Values[k].prevQt : '0', maxi_Tons: value },
	}));
	let numericValue = parseFloat(value) || 0;
	dispatch(DataAction.changeMaxiTONS({ destination: k, value: numericValue }));
	};  
	
	const handle_PrevToChange = (k: string, value: string) => {
		setprevious_Values((previous_Values) => ({
		  ...previous_Values,
		  [k]: { prevQt: previous_Values[k] ? previous_Values[k].prevQt : '0', previous_Tons: value },
		}));
		let numericValue = parseFloat(value) || 0;
		dispatch(DataAction.changePreviousTONS({ destination: k, value: numericValue }));
	  };
	  
	//fred
	
	const data = useSelector<RootState, Data[]>((state) => state.data.data);
	const selectedColors = useSelector<RootState, { [key: string]: string }>((state) => state.data.pickerColors);
	
	let totalCount = 0;
	let totalWeight = 0;

	let totalCalesCount = 0;
	let totalCalesWeight = 0;

	// let totalPreviousCalesCount = 0;
	// let totalPreviousCalesWeight = 0;

	let totalstockCount = 0;
	let totalstockWeight = 0;

	const totalPreviousCalesCount = Object.keys(previous_Values).reduce((total, k) => {
		return total + (previous_Values[k] ? parseFloat(previous_Values[k].prevQt) : 0);
	  }, 0);
	
	const totalPreviousCalesWeight = Object.keys(previous_Values).reduce((total, k) => {
	return total + (previous_Values[k]?.previous_Tons ? parseFloat(previous_Values[k].previous_Tons) : 0);
	}, 0);


	const statistics = data.reduce<any>((p, row) => {
		if (!p[row.destination]) {
		p[row.destination] = { count: 0, weight: 0 };
		}
		p[row.destination].count += 1;
		p[row.destination].weight += row.weight;
		return p;
	}, {});

  
	// Calcul du cumul des totaux
	Object.values(statistics).forEach((destinationStats: any ) => {    
		totalCount += destinationStats.count;
		totalWeight += destinationStats.weight;
		totalCalesCount = totalCount ;
    	totalCalesWeight = totalWeight;

		if (statistics.stock) {
			totalstockCount = statistics.stock.count;
			totalstockWeight = statistics.stock.weight;	
			totalCalesCount  = totalCount   - totalstockCount;
			totalCalesWeight = totalWeight  - totalstockWeight;
			
		}
		else {
			totalstockCount = 0;
			totalstockWeight = 0;	
			totalCalesCount  = totalCount;
			totalCalesWeight = totalWeight;
		}
	});

	const keys = Object.keys(statistics).sort();
		
	return (
		<Table>
		  <thead>
			<tr>
			  <th>DesT</th>
			  <th>ACTU_QT</th>
			  <th>ACTU_TO</th>
			  <th>PREV_QT</th>
			  <th>PREV_TO</th>
			  <th>TTL_QT</th>
	          <th>TTL_TO</th>
			  <th>  PU  </th>
			  <th> MAXI </th>
			  <th>LET_QT</th>
			  <th>LET_TO</th>
			</tr>
		  </thead>
		  <tbody>
{/* PARTIE HAUTE */}
		 

{keys.map((k) => (
  <tr key={k}>
{/* DEST */}
    <td style={{ backgroundColor: selectedColors[k] }}>{k}</td>
{/* ACTU_QT */}
	<td>{statistics[k].count}</td>
{/* ACTU_TO */}
	<td>
      {parseFloat(statistics[k].weight).toLocaleString("en-US", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })}
    </td>
    {k === 'stock' ? (
       <>
        <td colSpan={7}></td> 
        <td> </td> 
      </>
    ) : (
      <> 
	  	
{/* PREV_QT */}
        <td>
          <input
            type="text"
            style={{ width: '45px' }}
            value={previous_Values[k] ? previous_Values[k].prevQt : 0}
            onChange={(e) => handle_PrevQtChange(k, e.target.value)}
          />
        </td>
		
{/* PREV_TO */}
        <td>
          <input
            type="text"
            style={{ width: '80px' }}
            value={previous_Values[k] ? previous_Values[k].previous_Tons : 0}
            onChange={(e) => handle_PrevToChange(k, e.target.value)}
          />
        </td>

{/* TTL_QT */}
				<td>
                  {isNaN(statistics[k].count + (previous_Values[k] ? parseFloat(previous_Values[k].prevQt) : 0)) ? 0 : (statistics[k].count + (previous_Values[k] ? parseFloat(previous_Values[k].prevQt) : 0))}
                </td>
		
{/* TTL_TO */}
                {/* Vérifiez si TTL_TO est NaN, sinon affichez la valeur, sinon affichez 0 pour PREV_TO */}
                <td>
                  {isNaN(parseFloat(statistics[k].weight) + (previous_Values[k]?.previous_Tons ? parseFloat(previous_Values[k].previous_Tons) : 0)) ? 0 : (parseFloat(statistics[k].weight) + (previous_Values[k]?.previous_Tons ? parseFloat(previous_Values[k].previous_Tons) : 0)).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                </td>

{/* PU */}
        <td>
		{(
			(
				parseFloat(statistics[k].weight) +
				(previous_Values[k]?.previous_Tons ? parseFloat(previous_Values[k].previous_Tons) : 0)
			) /
			(statistics[k].count + (previous_Values[k]?.prevQt ? parseFloat(previous_Values[k].prevQt) : 0))
			).toFixed(3)}
        </td>
{/* MAXI_TO */}
		<td>
          <input
            type="text"
            style={{ width: '80px' }}
            value={previous_Values[k] ? previous_Values[k].maxi_Tons : 0}
            onChange={(e) => handle_MaxiToChange(k, e.target.value)}
          />
        </td>
	  </>
    )
	} 
  </tr>
))}




{/* PARTIE BASSE */}

			<tr>
			  <td>Totaux</td>
			  <td>{totalCalesCount}</td>
			  <td>{totalCalesWeight.toLocaleString("en-US")}</td>
			  <td>{totalPreviousCalesCount}</td>
			  <td>{totalPreviousCalesWeight.toLocaleString("en-US")}</td>
			  <td>{totalCalesCount + totalPreviousCalesCount}</td>
			  <td>{(totalCalesWeight + totalPreviousCalesWeight).toLocaleString("en-US")}</td>
			  <td>{((totalCalesWeight + totalPreviousCalesWeight)/(totalCalesCount + totalPreviousCalesCount)).toLocaleString("en-US")}</td>
			</tr>

			{/* <tr> */}
			  {/* <td>Total Général</td>
			  <td>{totalCalesCount+totalPreviousCalesCount}</td>
			  <td>{(totalCalesWeight+totalPreviousCalesWeight).toLocaleString("en-US")}</td> */}
				{/* <td>Total Général</td>
          		<td>{(totalCalesCount + totalPreviousCalesCount)}</td>
				<td>
					{(totalWeight + totalPreviousCalesWeight).toLocaleString("en-US", {
					minimumFractionDigits: 3,
					maximumFractionDigits: 3,
					})}
				</td>			   */}
			{/* </tr> */}

		  </tbody>
		</Table>
	  );
	}
