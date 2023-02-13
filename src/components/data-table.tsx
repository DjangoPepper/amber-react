import React from "react";
import {
    ColumnDef,
    createColumnHelper,
    FilterFn,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    Row,
    RowData,
    SortingState,
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
import {colors, destinations} from "../utils/destination";

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (reference: number, columnId: string, value: unknown) => void
    }
}
// import {useBeforeUnload} from "react-use";

/*
////////////////////////////////////////////////////////////////////////////
declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void
    }
}
////////////////////////////////////////////////////////////////////////////
*/
/*
const Demo = () => {
    const [dirty, toggleDirty] = useToggle(false);
    useBeforeUnload(dirty, 'You have unsaved changes, are you sure?');
} */

const columnHelper = createColumnHelper<Data>();

interface ColumnsProps {
    columns: ColumnDef<Data>[]
}

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
    const cale = useSelector<RootState, string>(state => state.data.selectedCale);

    const columns = [
        columnHelper.accessor('rank', {
            //header: () => <span>Rang</span>, modif by fred pour faire comme les autres
            header: () => 'Rang'
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('prepa', {
            header: () => 'Prepa',
            cell: EditableCell,
            //footer: info => info.column.id,
        }),
        columnHelper.accessor('reference', {
            header: 'Reference',
            cell: ({row}: any) => <Button onClick={() => dispatch(DataAction.moveRow(row.original.reference))}>{row.original.reference}</Button>
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('weight', {
            header: "Poids",
            cell: info => info.getValue()
            // footer: info => info.column.id,
        }),
        /* columnHelper.accessor("position", {
            // id: 'lastName',
            cell: info => <i>{info.getValue()}</i>,
            header: () => "Position",
            footer: info => info.column.id,
        }), */
        columnHelper.accessor('destination', {
            header: 'Destination'
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

// const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
//     // Rank the item
//     const itemRank = rankItem(row.getValue(columnId), value)
//
//     // Store the itemRank info
//     addMeta({
//         itemRank,
//     })
//
//     // Return if the item should be filtered in/out
//     return itemRank.passed
// }

const globalFilterFn: FilterFn<Data> = (row, columnId, filterValue: string) => {
    const search = filterValue.toLowerCase();

    let value = row.getValue(columnId) as string;
    if (typeof value === 'number') value = String(value);

    return value?.toLowerCase().includes(search);
};

export default function DataTable() {
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
        const sheet = utils.json_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, sheet);
        writeFileXLSX(wb, "steppe.xlsx");
    };

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
        {/* <div>
            {dirty && <p>Try to reload or close tab</p>}
            <button onClick={() => toggleDirty()}>{dirty ? 'Disable' : 'Enable'}</button>
        </div> */}

        <div className="d-flex">
            <div style={{maxWidth: 200}}>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Filtrer les donnees..."
                />
            </div>
            &nbsp;
            <div style={{maxWidth: 150}}>
                <Form.Select placeholder="vers..." value={cale} onChange={(e) => dispatch(DataAction.changeCale(e.target.value))}>
                    { destinations.map(d => <option key={d.name} value={d.name}>{d.name}</option>) }
                </Form.Select>
            </div>
            &nbsp;
            <Button variant="success" onClick={exportData}>Exporter</Button>
            &nbsp;
            <Button variant="danger" onClick={console.log}>Importer</Button>
            &nbsp;
            {/* <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    DdBut
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    <Form.Select placeholder="vers..." value={cale} onChange={(e) => dispatch(DataAction.changeCale(e.target.value))}>
                    <Dropdown.Item value="Stock">Stock</Dropdown.Item>
                    <Dropdown.Item value="Cale1">Cale1</Dropdown.Item>
                    <Dropdown.Item value="Cale2">Cale2</Dropdown.Item>
                    <Dropdown.Item value="Cale3">Cale3</Dropdown.Item>
                    <Dropdown.Item value="Cale4">Cale4</Dropdown.Item>
                    <Dropdown.Item value="Cale5">Cale5</Dropdown.Item>
                    </Form.Select>
                </Dropdown.Menu>
            </Dropdown>
            */}
        </div>
        <div ref={tableContainerRef} className="overflow-auto" style={{maxHeight: "500px"}}>
            <TableRS>
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
                                            onClick: header.column.getToggleSortingHandler(),
                                        }}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: ' 🔼',
                                            desc: ' 🔽',
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </div>}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
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
                {table.getFooterGroups().map(footerGroup => (
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
                ))}
                </tfoot>
            </TableRS>
        </div>
    </>
}