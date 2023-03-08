import React from "react";
import {
    createColumnHelper,
    FilterFn,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    Row,
    RowData,
    SortingState,
	PaginationState,
	ColumnDef,
    useReactTable
} from "@tanstack/react-table";

import {utils, writeFileXLSX} from "xlsx";

import {Button, Form, Table as TableRS} from "react-bootstrap";
// import {ColumnDef} from "@tanstack/table-core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores/rootStore";
import {Data} from "../stores/data/DataReducer";
import DebouncedInput from "./debounceInput";

import DataAction from "../stores/data/DataAction";

import {useVirtual} from 'react-virtual';
import {colors, destinations, HEADER} from "../utils/destination";
import Filter, {fuzzyFilter} from "./filter";



import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import './index-tanstack.css'
// import { fetchData, Person } from './fetchData'



declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (reference: number, columnId: string, value: unknown) => void
    }
}

const queryClient = new QueryClient()

const columnHelper = createColumnHelper<Data>();

const EditableCell = ({ getValue, row, column, table }: any) => {
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
        table.options.meta?.updateData(row.original.reference, column.id, value);
    }

    // If the initialValue is changed external, sync it up with our state
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

function useColumns(): any[] {
    const dispatch = useDispatch();
    // const cale = useSelector<RootState, string>(state => state.data.selectedCale);

    const columns = [
        columnHelper.accessor('rank', {
            //header: () => <span>Rang</span>, modif by fred pour faire comme les autres
            header: () => 'Rang',
            filterFn: fuzzyFilter,
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('prepa', {
            header: () => 'Prepa',
            cell: EditableCell,
            filterFn: fuzzyFilter,
            //footer: info => info.column.id,
        }),
        columnHelper.accessor('reference', {
            header: 'Reference',
            cell: ({row}: any) => <Button onClick={() => dispatch(DataAction.moveRow(row.original.reference))}>{row.original.reference}</Button>,
            filterFn: fuzzyFilter,
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('weight', {
            header: "Poids",
            cell: info => info.getValue(),
            filterFn: fuzzyFilter,
            // footer: info => info.column.id,
        }),
        /* columnHelper.accessor("position", {
            // id: 'lastName',
            cell: info => <i>{info.getValue()}</i>,
            header: () => "Position",
            footer: info => info.column.id,
        }), */
        columnHelper.accessor('destination', {
            header: 'Destination',
            filterFn: fuzzyFilter,
            // footer: info => info.column.id,
        })
        /* {
            id: 'select',
            header: "  ->",
            cell: ({row}: any) => <Button onClick={() => dispatch(DataAction.moveRow(row.original.reference))}>vers {cale}</Button>
        } */
    ];

    return columns;
}

const globalFilterFn: FilterFn<Data> = (row, columnId, filterValue: string) => {
    const search = filterValue.toLowerCase();

    let value = row.getValue(columnId) as string;
    if (typeof value === 'number') value = String(value);

    return value?.toLowerCase().includes(search);
};

export default function DataTable() {

	const rerender = React.useReducer(() => ({}), {})[1]

	const [{ pageIndex, pageSize }, setPagination] =
		React.useState<PaginationState>({
			pageIndex: 0,
			pageSize: 10,
		})

	/* const fetchDataOptions = {
		pageIndex,
		pageSize,
	} */
	/* const dataQuery = useQuery(
		['data', fetchDataOptions],
		() => fetchData(fetchDataOptions),
		{ keepPreviousData: true }
	) */
	const defaultData = React.useMemo(() => [], [])

	const pagination = React.useMemo(
		() => ({
			pageIndex,
			pageSize,
		}),
		[pageIndex, pageSize]
	)



    const dispatch = useDispatch();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('')
    const cale = useSelector<RootState, string>(state => state.data.selectedCale);
    // const prepa = useSelector<RootState, string>(state => state.data.selectedPrepa);
    const data = useSelector<RootState, Data[]>(state => state.data.data);

    const columns = useColumns();

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        meta: {
            updateData: (reference, columnId, value) => {
                // Skip age index reset until after next rerender
                if(columnId === "prepa") {
                    dispatch(DataAction.updateRow(reference, columnId, value));
                }
            },
        },
        getRowId: (row, relativeIndex) => {
            return row.reference;
        },
        debugTable: true,
    });

    const tableContainerRef = React.useRef<HTMLDivElement>(null)

    const { rows } = table.getRowModel()
    const rowVirtualizer = useVirtual({
        parentRef: tableContainerRef,
        size: rows.length,
        overscan: 10,
    })

    const { virtualItems: virtualRows, totalSize } = rowVirtualizer

    const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0

    const paddingBottom =
        virtualRows.length > 0
            ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
            : 0

    const exportData = () => {
        const aoa: any[][] = [HEADER.map(h => h.name)];
        for (const row of data) {
            aoa.push(HEADER.map(h => row[h.key as keyof Data]));
        }
        const sheet = utils.aoa_to_sheet(aoa)
        const wb = utils.book_new();
        utils.book_append_sheet(wb, sheet);
        writeFileXLSX(wb, "stepe.xlsx");
    };

    const clear = () => dispatch(DataAction.clear());

/*
////////////////////////////////////////////////////////////////////////////
const defaultColumn: Partial<ColumnDef<Data>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue()
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)
    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
        table.options.meta?.updateData(index, id, value)
        //table.options.meta?.updateData(prepa)
    }

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return (
        <input
            value={value as string}
            onChange={e => setValue(e.target.value)}
            onBlur={onBlur}
        />
    )
    },
}
////////////////////////////////////////////////////////////////////////////
*/

    return <>
        <div className="d-flex">
            <div style={{maxWidth: 165}}>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Filtre"
                />
            </div>
            &nbsp;
            <div style={{maxWidth: 150 }}>
                <Form.Select placeholder="vers..." value={cale} onChange={(e) => dispatch(DataAction.changeCale(e.target.value))}>
                    { destinations.map(
                        d => <option key={d.name} value={d.name} style={{backgroundColor:d.color}}>
                            {d.name}
                        </option>
                    )}
                </Form.Select>
            </div>
            &nbsp;
            <Button variant="success" onClick={exportData}>Exporter</Button>
            &nbsp;
            <Button variant="danger" onClick={clear}>Importer</Button>
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
                {/* <thead>
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
                </thead> */}

                <tbody className="overflow-auto" style={{maxHeight: "700px"}}>
                    {paddingTop > 0 && (
                        <tr>
                            <td style={{ height: `${paddingTop}px` }} />
                        </tr>
                    )}

                    {virtualRows.map(virtualRow => {
                        const row = rows[virtualRow.index] as Row<Data>;
                        return <tr key={row.id} style={{backgroundColor: colors[row.getValue("destination") as string]}}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    })}

                    {paddingBottom > 0 && (
                        <tr>
                            <td style={{ height: `${paddingBottom}px` }} />
                        </tr>
                    )}
                </tbody>

                <tfoot>
                {/* quel usage ? */}
                {/* {table.getFooterGroups().map(footerGroup => (
                    <tr key={footerGroup.id}>
                        {footerGroup.headers.map(header => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.footer,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))} */}
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
			>
				{'>>'}
			</button>&nbsp;&nbsp;&nbsp;&nbsp;
			&nbsp;&nbsp;&nbsp;&nbsp;
			<span className="flex items-center gap-1">
				{/* <div>Page</div> */}
				<strong>
					{table.getState().pagination.pageIndex + 1} of{' '}
					{table.getPageCount()}
				</strong>
			</span>
			&nbsp;&nbsp;
			<span className="flex items-center gap-1">
				| Go to : &nbsp;&nbsp;&nbsp;&nbsp;
				<input
					type="number"
					defaultValue={table.getState().pagination.pageIndex + 1}
					onChange={e => {
						const page = e.target.value ? Number(e.target.value) - 1 : 0
						table.setPageIndex(page)
					}}
					className="border p-1 rounded w-16"
					style={{maxWidth: 64 }}
				/>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			</span>
			<select
				value={table.getState().pagination.pageSize}
				onChange={e => {
					table.setPageSize(Number(e.target.value))
				}}
			>
				{[10, 20, 30, 40, 50].map(pageSize => (
					<option key={pageSize} value={pageSize}>
						Show {pageSize}
					</option>
				))}
			</select>
			{/* {dataQuery.isFetching ? 'Loading...' : null} */}
		</div>
		{/* <div>{table.getRowModel().rows.length} Lignes</div> */}
{/* 		<div>to
			<button onClick={() => rerender()}>Force Rerender</button>
		</div> */}
		{/* <pre>{JSON.stringify(pagination, null, 2)}</pre> */}
    </>
}