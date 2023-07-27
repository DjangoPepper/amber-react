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
import './index-tanstack.css'


//FRED ****************************************************************
import SpaceatPos from "./SpaceatPos";
//FRED ****************************************************************



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
            style={{width: "50px"}}
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

export default function DataTable() {
    
    
    const dispatch = useDispatch();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('')
    const cale = useSelector<RootState, string>(state => state.data.selectedCale);
    const data = useSelector<RootState, Data[]>(state => state.data.data);
    const columns = useColumns();
    
    const [{ pageIndex, pageSize }, setPagination] =
        React.useState<PaginationState>({
            pageIndex: 0,
            pageSize: 40,
        }
    )

    

    const rappel = React.useMemo(
        () => ({
            pagePrev,
        }),
        [pagePrev]
    )
    
    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize ]
    )

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            pagination
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        
        getPaginationRowModel: getPaginationRowModel(),   
        manualPagination: false,
        onPaginationChange: setPagination,
        
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
        writeFile(wb, "stepe.xlsx");
    };

    const clear = () => dispatch(DataAction.clear());
    const [hold, setHold] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const handleHoldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(DataAction.changeCale(e.target.value)) 
        const selectedValue = (e.target.value);
        const selectedOption = destinations.find((d) => d.name === selectedValue);

        setHold(selectedValue);
        setSelectedColor(selectedOption ? selectedOption.color : '');    
    }

    function reelPage() { 
        rappel.pagePrev = pageIndex;
    }
    function retournePage() {
        table.setPageIndex(rappel.pagePrev)
    }

    function useColumns(): any[] {

        

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
                        reelPage(); //je memeorise la page de travail
                        dispatch(DataAction.moveRow(row.original.reference)); //je change la detination de ref cale1,cale2, etc..
                        retournePage();//je devrais retourner à la page de travail memorisé mais ca marche po^                    
                    }}
                    
                    >
                        {/* {row.original.reference}  */}
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

    return <>
        <div className="d-flex">
            <div style={{maxWidth: 90}}>
                {/* 11 chiffres */}
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Filtre"
                />
            </div>
            &nbsp;
            <div style={{maxWidth: 150 }}>
                <Form.Select placeholder="vers..." value={cale} 
                    onChange={(e) => handleHoldChange(e)}
                    style={{ backgroundColor: selectedColor }}
                    >
                    { destinations.map(
                        d => <option key={d.name} value={d.name} style={{backgroundColor:d.color}}>
                            {d.name}
                        </option>
                    )}
                </Form.Select>
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
        <div ref={tableContainerRef} className="overflow-auto" style={{maxHeight: "500px"}}>
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
                onClick = {() => table.setPageIndex(rappel.pagePrev)}
			>
				{'(o)'}
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
				{[40, 80, 120, 160].map(pageSize => (
					<option key={pageSize} value={pageSize}>
						{pageSize}
					</option>
				))}
			</select>
			
		</div>		
    </>
}
