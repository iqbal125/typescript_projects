import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
    type SortingState,
} from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash2 } from 'lucide-react';

import { getTodos, deleteTodo } from '@/api/todoApi';
import type { Todo } from '@/types/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const columnHelper = createColumnHelper<Todo>();

// ── Page ──────────────────────────────────────────────────────────────────────

const TodosTablePage: React.FC = () => {
    const queryClient = useQueryClient();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const { data: todos = [], isLoading, isError } = useQuery({
        queryKey: ['todos'],
        queryFn: getTodos,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
    });

    const columns = [
        columnHelper.accessor('id', {
            header: 'ID',
            size: 60,
        }),
        columnHelper.accessor('title', {
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Title
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            ),
        }),
        columnHelper.accessor('description', {
            header: 'Description',
            cell: (info) => info.getValue() ?? <span className="text-muted-foreground">—</span>,
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                    <Button size="icon" variant="outline" aria-label="Edit todo">
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="destructive"
                        aria-label="Delete todo"
                        disabled={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(row.original.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data: todos,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Todos</h1>
                <Input
                    placeholder="Search..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-xs"
                />
            </div>

            {isError && <p className="text-destructive text-sm">Failed to load todos.</p>}

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} style={{ width: header.getSize() }}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                                    No todos found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <p className="text-sm text-muted-foreground">
                {table.getFilteredRowModel().rows.length} of {todos.length} todo(s)
            </p>
        </div>
    );
};

export default TodosTablePage;
