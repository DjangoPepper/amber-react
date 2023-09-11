import React from "react";
import { useState } from 'react';
import {
    createColumnHelper,
    FilterFn,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    RowData,
    SortingState,
    useReactTable,
    getPaginationRowModel,
    PaginationState} from "@tanstack/react-table";

import {utils, writeFile } from "xlsx";
import {Button, Form, Table as TableRS} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores/rootStore";
import {Data} from "../stores/data/DataReducer";
import DebouncedInput from "./debounceInput";
import DataAction from "../stores/data/DataAction";
import {colors, destinations, HEADER} from "../utils/destination";
import Filter, {fuzzyFilter} from "./filter";
import './index-tanstack.css';
import Modal from "react-modal";

//FRED ****************************************************************
import SpaceatPos from "./SpaceatPos";
import * as fs from 'fs'
import * as path from 'path'

const monthNames = [
    'jan', 'fev', 'mar', 'avr', 'mai', 'juin',
    'juil', 'aou', 'sep', 'oct', 'nov', 'dec'
  ];

  

function backupCurrentDateTime(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  
  const month = monthNames[now.getMonth()];  

  //const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear());
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');

  return `Stepe ${month}${day}_${hour}${minute}.xlsx`;
}

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (reference: number, columnId: string, value: unknown) => void
    }
}

const columnHelper = createColumnHelper<Data>();

const EditableCell = ({ getValue, row, column, table }: any) => {
    const initialValue = getValue()
    const [value, setValue] = React.useState(initialValue)
    const onBlur = () => {
        table.options.meta?.updateData(row.original.reference, column.id, value);
    }

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return (
        <input
            value={value as string}
            onChange={e => setValue(e.target.value)}
            onBlur={onBlur}
            style={{width: "55px"}}
            // largeur prepa box
        />
    )
};

const globalFilterFn: FilterFn<Data> = (row, columnId, filterValue: string) => {
    const search = filterValue.toLowerCase();

    let value = row.getValue(columnId) as string;
    if (typeof value === 'number') value = String(value);

    return value?.toLowerCase().includes(search);
};

const pagePrev  = -1 ;

const useColumns = function useColumns(): any[] {
    const dispatch = useDispatch();

    const columns = [
        columnHelper.accessor('rank', {
            header: () => 'RANG',
            filterFn: fuzzyFilter,
        }),
        columnHelper.accessor('prepa', {
            header: () => 'PREPA',
            cell: EditableCell,
            filterFn: fuzzyFilter,
        }),
// #####################################################################################################################
        columnHelper.accessor('reference', {
            header: 'REF',
            cell: ({row}: any) =>
                <Button onClick={() => {
                    dispatch(DataAction.moveRow(row.original.reference)); //je change la detination de ref cale1,cale2, etc..
                }}

                >
                    {SpaceatPos(row.original.reference)}
                </Button>,
            filterFn: fuzzyFilter,

        }),
// #####################################################################################################################

        columnHelper.accessor('weight', {
            header: "POIDS",
            cell: info => info.getValue(),
            filterFn: fuzzyFilter,
        }),
        columnHelper.accessor('destination', {
            header: 'DEST',
            filterFn: fuzzyFilter,
        })
    ];

    return columns;
}

export default function DataTable() {
    const dispatch = useDispatch();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('')
    const cale = useSelector<RootState, string>(state => state.data.selectedCale);
    const data = useSelector<RootState, Data[]>(state => state.data.data);
    const columns = useColumns();
    //FRED #############################################################
    //FRED #############################################################
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(-1); // Nouvel état pour l'index de l'option sélectionnée
    const [isColorPickerOpen, setIsColorPickerOpen] = useState<boolean>(false); // État pour suivre si la fenêtre contextuelle est ouverte
    const [selectedColor, setSelectedColor] = useState<string>(''); // Couleur sélectionnée

    // Gestionnaire de double-clic sur une option
    const handleOptionDoubleClick = (index: number) => {
        setSelectedOptionIndex(index); // Définir l'index de l'option sélectionnée
        setIsColorPickerOpen(true); // Ouvrir la fenêtre contextuelle
    };

    // Gestionnaire de changement de couleur
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedColor(e.target.value); // Mettre à jour la couleur sélectionnée
    };

    // Gestionnaire de fermeture de la fenêtre contextuelle
    const handleCloseColorPicker = () => {
        setIsColorPickerOpen(false); // Fermer la fenêtre contextuelle
        setSelectedOptionIndex(-1); // Réinitialiser l'index de l'option sélectionnée
    }; 
    
    //FRED #############################################################
    //FRED #############################################################
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            // pagination
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
        // manualPagination: false,
        // onPaginationChange: setPagination,
        
        meta: {
            updateData: (reference, columnId, value) => {
                if(columnId === "prepa") {
                    dispatch(DataAction.updateRow(reference, columnId, value));
                }
            },
        },
// #####################################################################################################################
        getRowId: (row) => {
            return row.reference;
        },
        debugTable: true,
    }
    );
    const tableContainerRef = React.useRef<HTMLDivElement>(null)
    const exportData = () => {
        const aoa: any[][] = [HEADER.map(h => h.name)];
        for (const row of data) {
            aoa.push(HEADER.map(h => row[h.key as keyof Data]));
        }
        const sheet = utils.aoa_to_sheet(aoa)
        const wb = utils.book_new();
        utils.book_append_sheet(wb, sheet);
        writeFile(wb, backupCurrentDateTime())
    };

    const clear = () => dispatch(DataAction.clear());
    
    const [hold, setHold] = useState('');
    
    
    const handleHoldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(DataAction.changeCale(e.target.value)) 
        const selectedValue = (e.target.value);
        const selectedOption = destinations.find((d) => d.name === selectedValue);

        setHold(selectedValue);
        setSelectedColor(selectedOption ? selectedOption.color : '');    
    }

    return <>
        <div className="d-flex">
            <div style={{maxWidth: 90}}>
                {/* 11 chiffres POUR LE CHAMP search de rang*/}
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Filtre"
                />
            </div>
            &nbsp;
            <div style={{maxWidth: 350 }}>
                {/* largeur form select stock cale */}
                {/* // FRED ########################################"" */}
                {/* // FRED ########################################"" */}
                {/* // FRED ########################################"" */}
                <Form.Select 
                    placeholder="vers..." 
                    value={cale} 
                    onChange={(e) => handleHoldChange(e)}
                    style={{ backgroundColor: selectedColor }}
                >
                
                    { destinations.map((d, index) => (                        
                        <option 
                            key={d.name} 
                            value={d.name} 
                            style={{backgroundColor:d.color}}
                            onDoubleClick={() => handleOptionDoubleClick(index)}
                        >
                            {d.name}
                        </option>
                        ))}
                </Form.Select>

                <Modal
                    isOpen={isColorPickerOpen && selectedOptionIndex !== -1}
                    onRequestClose={handleCloseColorPicker}
                    contentLabel="Choisir une couleur"
                >
                    {/* Contenu de la fenêtre modale */}
                    <h2>Choisir une couleur</h2>
                    <input
                        type="color"
                        value={selectedColor}
                        onChange={handleColorChange}
                    />
                    <button onClick={handleCloseColorPicker}>Fermer</button>
            </Modal>
                
                {/* // FRED ########################################"" */}
                {/* // FRED ########################################"" */}
                {/* // FRED ########################################"" */}

            </div>
            

            &nbsp;
            <Button variant="success" onClick={exportData}>Export</Button>
            &nbsp;
            <Button variant="danger" onClick={clear}>Import</Button>
            &nbsp;
            
            

        </div>
        <thead>
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th key={header.id}>
                            {header.isPlaceholder
                                ? null
                                : <div
                                    {...{
                                        className: header.column.getCanSort()
                                            ? 'cursor-pointer select-none'
                                            : '',
                                    }}
                                >
                                    <div {...{
                                        onClick: header.column.getToggleSortingHandler(),
                                    }}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: ' 🔼',
                                            desc: ' 🔽',
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </div>
                                    {header.column.getCanFilter() ? (
                                        <div>
                                            <Filter column={header.column} table={table} />
                                        </div>
                                    ) : null}
                                </div>}
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
        <div ref={tableContainerRef} className="overflow-auto" style={{maxHeight: "490px"}}>
            {/* hauteur du tableau data 500 px*/}
            <TableRS>
                <tbody className="overflow-auto" style={{maxHeight: "100px"}}>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id} style={{backgroundColor: colors[row.getValue("destination") as string]}}>
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>

                <tfoot>
                </tfoot>
            </TableRS>
        </div>
		<div className="h-2" />
		<div className="flex items-center gap-2">
			<button
				className="border rounded p-1"
				onClick={() => table.setPageIndex(0)}
				disabled={!table.getCanPreviousPage()}
			>
				{'<<'}
			</button>&nbsp;&nbsp;&nbsp;&nbsp;
			


            <button
				className="border rounded p-1"
				onClick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				{'<'}
			</button>&nbsp;&nbsp;&nbsp;&nbsp;

            <button
				className="border rounded p-1"
				onClick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				{'>'}
			</button>&nbsp;&nbsp;&nbsp;&nbsp;

            <button
				className="border rounded p-1"
				onClick={() => table.setPageIndex(table.getPageCount() - 1)}
				disabled={!table.getCanNextPage()}
                // onclick={() => table.index
			>
				{'>>'}
			</button>&nbsp;&nbsp;&nbsp;&nbsp;

			<span className="flex items-center gap-1">
				{/* <div>Page</div> */}
				<strong>
					{table.getState().pagination.pageIndex + 1} of{' '}
					{table.getPageCount()}
				</strong>
			</span>
			&nbsp;&nbsp;
			<span className="flex items-center gap-1">
				| Vers : &nbsp;&nbsp;&nbsp;&nbsp;
				<input
					type="number"
					defaultValue={table.getState().pagination.pageIndex + 1}
					onChange={e => {
						const page = e.target.value ? Number(e.target.value) - 1 : 0
						table.setPageIndex(page)
					}}
					className="border p-1 rounded w-16"
					style={{maxWidth: 40 }}
				/>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			</span>
			<select
				value={table.getState().pagination.pageSize}
				onChange={e => {
					table.setPageSize(Number(e.target.value))
				}}
			>
				{[10, 40, 80, 120, 200].map(pageSize => (
					<option key={pageSize} value={pageSize}>
						{pageSize}
					</option>
				))}
			</select>
			
		</div>	
        	
    </>
}
