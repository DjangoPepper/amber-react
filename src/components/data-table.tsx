import React from "react";
import {
    createColumnHelper, FilterFn,
    flexRender,
    getCoreRowModel, getFilteredRowModel,
    getSortedRowModel, Row,
    SortingState,
    useReactTable
} from "@tanstack/react-table";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores/rootStore";
import {Data} from "../stores/data/DataReducer";
import DebouncedInput from "./debounceInput";
import {Button, Form, Table} from "react-bootstrap";
import DataAction from "../stores/data/DataAction";
import {ColumnDef} from "@tanstack/table-core";
import { useVirtual } from 'react-virtual'

const columnHelper = createColumnHelper<Data>();

interface ColumnsProps {
    columns: ColumnDef<Data>[]
}

function useColumns(): any[] {
    const dispatch = useDispatch();
    const cale = useSelector<RootState, string>(state => state.data.selectedCale);

    const columns = [
        columnHelper.accessor('rank', {
            header: () => <span>Rang</span>,
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('prepa', {
            header: () => 'Prepa',
            cell: info => info.renderValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('reference', {
            header: 'Reference',
            // footer: info => info.column.id,
        }),
        columnHelper.accessor('weight', {
            header: "Poids",
            cell: info => info.getValue(),
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
            // footer: info => info.column.id,
        }),
        {
            id: 'select',
            header: "->",
            cell: ({row}: any) => <Button onClick={() => dispatch(DataAction.moveRow(row.original.reference))}>vers {cale}</Button>
        }
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

    return <>
        <div className="d-flex">
            <div style={{maxWidth: 300}}>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Filtrer les donnees..."
                />
            </div>
            <div style={{maxWidth: 200}}>
                <Form.Select placeholder="vers..." value={cale} onChange={(e) => dispatch(DataAction.changeCale(e.target.value))}>
                    <option value="Stock">Stock</option>
                    <option value="Cale1">Cale1</option>
                    <option value="Cale2">Cale2</option>
                    <option value="Cale3">Cale3</option>
                    <option value="Cale4">Cale4</option>
                    <option value="Cale5">Cale5</option>
                </Form.Select>
            </div>
            <Button onClick={console.log}>Exporter</Button>
        </div>
        <div ref={tableContainerRef} className="overflow-auto" style={{maxHeight: "500px"}}>
            <Table>
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
                        return <tr key={row.id}>
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
            </Table>
        </div>
    </>
}