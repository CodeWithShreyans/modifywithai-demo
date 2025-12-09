"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
      id={`data-table-drag-handle-${id}`}
    >
      <IconGripVertical className="text-muted-foreground size-3" id={`data-table-drag-handle-icon-${id}`} />
      <span className="sr-only" id={`data-table-drag-handle-text-${id}`}>Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center" id="data-table-select-all-container">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          id="data-table-select-all-checkbox"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center" id={`data-table-select-row-container-${row.original.id}`}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          id={`data-table-select-row-checkbox-${row.original.id}`}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Header",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "Section Type",
    cell: ({ row }) => (
      <div className="w-32" id={`data-table-type-container-${row.original.id}`}>
        <Badge variant="outline" className="text-muted-foreground px-1.5" id={`data-table-type-badge-${row.original.id}`}>
          <span id={`data-table-type-text-${row.original.id}`}>{row.original.type}</span>
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5" id={`data-table-status-badge-${row.original.id}`}>
        {row.original.status === "Done" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" id={`data-table-status-icon-${row.original.id}`} />
        ) : (
          <IconLoader id={`data-table-status-icon-${row.original.id}`} />
        )}
        <span id={`data-table-status-text-${row.original.id}`}>{row.original.status}</span>
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: () => <div className="w-full text-right" id="data-table-target-header">Target</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: "Done",
            error: "Error",
          })
        }}
        id={`data-table-target-form-${row.original.id}`}
      >
        <Label htmlFor={`${row.original.id}-target`} className="sr-only" id={`data-table-target-label-${row.original.id}`}>
          Target
        </Label>
        <Input
          className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
          defaultValue={row.original.target}
          id={`${row.original.id}-target`}
        />
      </form>
    ),
  },
  {
    accessorKey: "limit",
    header: () => <div className="w-full text-right" id="data-table-limit-header">Limit</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.header}`,
            success: "Done",
            error: "Error",
          })
        }}
        id={`data-table-limit-form-${row.original.id}`}
      >
        <Label htmlFor={`${row.original.id}-limit`} className="sr-only" id={`data-table-limit-label-${row.original.id}`}>
          Limit
        </Label>
        <Input
          className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
          defaultValue={row.original.limit}
          id={`${row.original.id}-limit`}
        />
      </form>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "Reviewer",
    cell: ({ row }) => {
      const isAssigned = row.original.reviewer !== "Assign reviewer"

      if (isAssigned) {
        return <span id={`data-table-reviewer-text-${row.original.id}`}>{row.original.reviewer}</span>
      }

      return (
        <div id={`data-table-reviewer-container-${row.original.id}`}>
          <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only" id={`data-table-reviewer-label-${row.original.id}`}>
            Reviewer
          </Label>
          <Select id={`data-table-reviewer-select-${row.original.id}`}>
            <SelectTrigger
              className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              id={`${row.original.id}-reviewer`}
            >
              <SelectValue placeholder="Assign reviewer" id={`data-table-reviewer-select-value-${row.original.id}`} />
            </SelectTrigger>
            <SelectContent align="end" id={`data-table-reviewer-select-content-${row.original.id}`}>
              <SelectItem value="Eddie Lake" id={`data-table-reviewer-select-item-eddie-lake-${row.original.id}`}>Eddie Lake</SelectItem>
              <SelectItem value="Jamik Tashpulatov" id={`data-table-reviewer-select-item-jamik-${row.original.id}`}>
                Jamik Tashpulatov
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu id={`data-table-actions-dropdown-${row.original.id}`}>
        <DropdownMenuTrigger asChild id={`data-table-actions-trigger-${row.original.id}`}>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
            id={`data-table-actions-button-${row.original.id}`}
          >
            <IconDotsVertical id={`data-table-actions-icon-${row.original.id}`} />
            <span className="sr-only" id={`data-table-actions-text-${row.original.id}`}>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32" id={`data-table-actions-content-${row.original.id}`}>
          <DropdownMenuItem id={`data-table-actions-item-edit-${row.original.id}`}>
            <span id={`data-table-actions-item-edit-text-${row.original.id}`}>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem id={`data-table-actions-item-copy-${row.original.id}`}>
            <span id={`data-table-actions-item-copy-text-${row.original.id}`}>Make a copy</span>
          </DropdownMenuItem>
          <DropdownMenuItem id={`data-table-actions-item-favorite-${row.original.id}`}>
            <span id={`data-table-actions-item-favorite-text-${row.original.id}`}>Favorite</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator id={`data-table-actions-separator-${row.original.id}`} />
          <DropdownMenuItem variant="destructive" id={`data-table-actions-item-delete-${row.original.id}`}>
            <span id={`data-table-actions-item-delete-text-${row.original.id}`}>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
      id={`data-table-row-${row.original.id}`}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} id={`data-table-cell-${row.original.id}-${cell.column.id}`}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
      id="data-table-tabs"
    >
      <div className="flex items-center justify-between px-4 lg:px-6" id="data-table-header">
        <Label htmlFor="view-selector" className="sr-only" id="data-table-view-selector-label">
          View
        </Label>
        <Select defaultValue="outline" id="data-table-view-selector">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" id="data-table-view-selector-value" />
          </SelectTrigger>
          <SelectContent id="data-table-view-selector-content">
            <SelectItem value="outline" id="data-table-view-selector-item-outline">Outline</SelectItem>
            <SelectItem value="past-performance" id="data-table-view-selector-item-past-performance">Past Performance</SelectItem>
            <SelectItem value="key-personnel" id="data-table-view-selector-item-key-personnel">Key Personnel</SelectItem>
            <SelectItem value="focus-documents" id="data-table-view-selector-item-focus-documents">Focus Documents</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex" id="data-table-tabs-list">
          <TabsTrigger value="outline" id="data-table-tabs-trigger-outline">Outline</TabsTrigger>
          <TabsTrigger value="past-performance" id="data-table-tabs-trigger-past-performance">
            <span id="data-table-tabs-trigger-past-performance-text">Past Performance</span> <Badge variant="secondary" id="data-table-tabs-trigger-past-performance-badge">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="key-personnel" id="data-table-tabs-trigger-key-personnel">
            <span id="data-table-tabs-trigger-key-personnel-text">Key Personnel</span> <Badge variant="secondary" id="data-table-tabs-trigger-key-personnel-badge">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="focus-documents" id="data-table-tabs-trigger-focus-documents">Focus Documents</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2" id="data-table-header-actions">
          <DropdownMenu id="data-table-columns-dropdown">
            <DropdownMenuTrigger asChild id="data-table-columns-trigger">
              <Button variant="outline" size="sm" id="data-table-columns-button">
                <IconLayoutColumns id="data-table-columns-icon" />
                <span className="hidden lg:inline" id="data-table-columns-text-desktop">Customize Columns</span>
                <span className="lg:hidden" id="data-table-columns-text-mobile">Columns</span>
                <IconChevronDown id="data-table-columns-chevron" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" id="data-table-columns-content">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      id={`data-table-columns-item-${column.id}`}
                    >
                      <span id={`data-table-columns-item-text-${column.id}`}>{column.id}</span>
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" id="data-table-add-section-button">
            <IconPlus id="data-table-add-section-icon" />
            <span className="hidden lg:inline" id="data-table-add-section-text">Add Section</span>
          </Button>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        id="data-table-tabs-content-outline"
      >
        <div className="overflow-hidden rounded-lg border" id="data-table-container">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table id="data-table">
              <TableHeader className="bg-muted sticky top-0 z-10" id="data-table-header-row">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} id={`data-table-header-row-group-${headerGroup.id}`}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan} id={`data-table-header-cell-${header.id}`}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8" id="data-table-body">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                    id="data-table-sortable-context"
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow id="data-table-empty-row">
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                      id="data-table-empty-cell"
                    >
                      <span id="data-table-empty-text">No results.</span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4" id="data-table-pagination-container">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex" id="data-table-selection-info">
            <span id="data-table-selection-info-text">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </span>
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit" id="data-table-pagination-controls">
            <div className="hidden items-center gap-2 lg:flex" id="data-table-rows-per-page-container">
              <Label htmlFor="rows-per-page" className="text-sm font-medium" id="data-table-rows-per-page-label">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
                id="data-table-rows-per-page-select"
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                    id="data-table-rows-per-page-value"
                  />
                </SelectTrigger>
                <SelectContent side="top" id="data-table-rows-per-page-content">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`} id={`data-table-rows-per-page-item-${pageSize}`}>
                      <span id={`data-table-rows-per-page-item-text-${pageSize}`}>{pageSize}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium" id="data-table-page-info">
              <span id="data-table-page-info-text">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0" id="data-table-pagination-buttons">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                id="data-table-pagination-button-first"
              >
                <span className="sr-only" id="data-table-pagination-button-first-text">Go to first page</span>
                <IconChevronsLeft id="data-table-pagination-button-first-icon" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                id="data-table-pagination-button-prev"
              >
                <span className="sr-only" id="data-table-pagination-button-prev-text">Go to previous page</span>
                <IconChevronLeft id="data-table-pagination-button-prev-icon" />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                id="data-table-pagination-button-next"
              >
                <span className="sr-only" id="data-table-pagination-button-next-text">Go to next page</span>
                <IconChevronRight id="data-table-pagination-button-next-icon" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                id="data-table-pagination-button-last"
              >
                <span className="sr-only" id="data-table-pagination-button-last-text">Go to last page</span>
                <IconChevronsRight id="data-table-pagination-button-last-icon" />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
        id="data-table-tabs-content-past-performance"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" id="data-table-tabs-content-past-performance-placeholder"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6" id="data-table-tabs-content-key-personnel">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" id="data-table-tabs-content-key-personnel-placeholder"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
        id="data-table-tabs-content-focus-documents"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed" id="data-table-tabs-content-focus-documents-placeholder"></div>
      </TabsContent>
    </Tabs>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} id={`data-table-cell-viewer-drawer-${item.id}`}>
      <DrawerTrigger asChild id={`data-table-cell-viewer-trigger-${item.id}`}>
        <Button variant="link" className="text-foreground w-fit px-0 text-left" id={`data-table-cell-viewer-button-${item.id}`}>
          <span id={`data-table-cell-viewer-button-text-${item.id}`}>{item.header}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent id={`data-table-cell-viewer-content-${item.id}`}>
        <DrawerHeader className="gap-1" id={`data-table-cell-viewer-header-${item.id}`}>
          <DrawerTitle id={`data-table-cell-viewer-title-${item.id}`}>{item.header}</DrawerTitle>
          <DrawerDescription id={`data-table-cell-viewer-description-${item.id}`}>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm" id={`data-table-cell-viewer-body-${item.id}`}>
          {!isMobile && (
            <div id={`data-table-cell-viewer-desktop-content-${item.id}`}>
              <ChartContainer config={chartConfig} id={`data-table-cell-viewer-chart-container-${item.id}`}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                  id={`data-table-cell-viewer-area-chart-${item.id}`}
                >
                  <CartesianGrid vertical={false} id={`data-table-cell-viewer-cartesian-grid-${item.id}`} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                    id={`data-table-cell-viewer-x-axis-${item.id}`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" id={`data-table-cell-viewer-tooltip-content-${item.id}`} />}
                    id={`data-table-cell-viewer-tooltip-${item.id}`}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                    id={`data-table-cell-viewer-area-mobile-${item.id}`}
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                    id={`data-table-cell-viewer-area-desktop-${item.id}`}
                  />
                </AreaChart>
              </ChartContainer>
              <Separator id={`data-table-cell-viewer-separator-1-${item.id}`} />
              <div className="grid gap-2" id={`data-table-cell-viewer-trend-info-${item.id}`}>
                <div className="flex gap-2 leading-none font-medium" id={`data-table-cell-viewer-trend-${item.id}`}>
                  <span id={`data-table-cell-viewer-trend-text-${item.id}`}>Trending up by 5.2% this month</span>{" "}
                  <IconTrendingUp className="size-4" id={`data-table-cell-viewer-trend-icon-${item.id}`} />
                </div>
                <div className="text-muted-foreground" id={`data-table-cell-viewer-trend-description-${item.id}`}>
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator id={`data-table-cell-viewer-separator-2-${item.id}`} />
            </div>
          )}
          <form className="flex flex-col gap-4" id={`data-table-cell-viewer-form-${item.id}`}>
            <div className="flex flex-col gap-3" id={`data-table-cell-viewer-form-header-container-${item.id}`}>
              <Label htmlFor={`data-table-cell-viewer-header-input-${item.id}`} id={`data-table-cell-viewer-form-header-label-${item.id}`}>Header</Label>
              <Input id={`data-table-cell-viewer-header-input-${item.id}`} defaultValue={item.header} />
            </div>
            <div className="grid grid-cols-2 gap-4" id={`data-table-cell-viewer-form-type-status-container-${item.id}`}>
              <div className="flex flex-col gap-3" id={`data-table-cell-viewer-form-type-container-${item.id}`}>
                <Label htmlFor={`data-table-cell-viewer-type-select-${item.id}`} id={`data-table-cell-viewer-form-type-label-${item.id}`}>Type</Label>
                <Select defaultValue={item.type} id={`data-table-cell-viewer-type-select-${item.id}`}>
                  <SelectTrigger id={`data-table-cell-viewer-type-select-trigger-${item.id}`} className="w-full">
                    <SelectValue placeholder="Select a type" id={`data-table-cell-viewer-type-select-value-${item.id}`} />
                  </SelectTrigger>
                  <SelectContent id={`data-table-cell-viewer-type-select-content-${item.id}`}>
                    <SelectItem value="Table of Contents" id={`data-table-cell-viewer-type-select-item-table-of-contents-${item.id}`}>
                      Table of Contents
                    </SelectItem>
                    <SelectItem value="Executive Summary" id={`data-table-cell-viewer-type-select-item-executive-summary-${item.id}`}>
                      Executive Summary
                    </SelectItem>
                    <SelectItem value="Technical Approach" id={`data-table-cell-viewer-type-select-item-technical-approach-${item.id}`}>
                      Technical Approach
                    </SelectItem>
                    <SelectItem value="Design" id={`data-table-cell-viewer-type-select-item-design-${item.id}`}>Design</SelectItem>
                    <SelectItem value="Capabilities" id={`data-table-cell-viewer-type-select-item-capabilities-${item.id}`}>Capabilities</SelectItem>
                    <SelectItem value="Focus Documents" id={`data-table-cell-viewer-type-select-item-focus-documents-${item.id}`}>
                      Focus Documents
                    </SelectItem>
                    <SelectItem value="Narrative" id={`data-table-cell-viewer-type-select-item-narrative-${item.id}`}>Narrative</SelectItem>
                    <SelectItem value="Cover Page" id={`data-table-cell-viewer-type-select-item-cover-page-${item.id}`}>Cover Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3" id={`data-table-cell-viewer-form-status-container-${item.id}`}>
                <Label htmlFor={`data-table-cell-viewer-status-select-${item.id}`} id={`data-table-cell-viewer-form-status-label-${item.id}`}>Status</Label>
                <Select defaultValue={item.status} id={`data-table-cell-viewer-status-select-${item.id}`}>
                  <SelectTrigger id={`data-table-cell-viewer-status-select-trigger-${item.id}`} className="w-full">
                    <SelectValue placeholder="Select a status" id={`data-table-cell-viewer-status-select-value-${item.id}`} />
                  </SelectTrigger>
                  <SelectContent id={`data-table-cell-viewer-status-select-content-${item.id}`}>
                    <SelectItem value="Done" id={`data-table-cell-viewer-status-select-item-done-${item.id}`}>Done</SelectItem>
                    <SelectItem value="In Progress" id={`data-table-cell-viewer-status-select-item-in-progress-${item.id}`}>In Progress</SelectItem>
                    <SelectItem value="Not Started" id={`data-table-cell-viewer-status-select-item-not-started-${item.id}`}>Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4" id={`data-table-cell-viewer-form-target-limit-container-${item.id}`}>
              <div className="flex flex-col gap-3" id={`data-table-cell-viewer-form-target-container-${item.id}`}>
                <Label htmlFor={`data-table-cell-viewer-target-input-${item.id}`} id={`data-table-cell-viewer-form-target-label-${item.id}`}>Target</Label>
                <Input id={`data-table-cell-viewer-target-input-${item.id}`} defaultValue={item.target} />
              </div>
              <div className="flex flex-col gap-3" id={`data-table-cell-viewer-form-limit-container-${item.id}`}>
                <Label htmlFor={`data-table-cell-viewer-limit-input-${item.id}`} id={`data-table-cell-viewer-form-limit-label-${item.id}`}>Limit</Label>
                <Input id={`data-table-cell-viewer-limit-input-${item.id}`} defaultValue={item.limit} />
              </div>
            </div>
            <div className="flex flex-col gap-3" id={`data-table-cell-viewer-form-reviewer-container-${item.id}`}>
              <Label htmlFor={`data-table-cell-viewer-reviewer-select-${item.id}`} id={`data-table-cell-viewer-form-reviewer-label-${item.id}`}>Reviewer</Label>
              <Select defaultValue={item.reviewer} id={`data-table-cell-viewer-reviewer-select-${item.id}`}>
                <SelectTrigger id={`data-table-cell-viewer-reviewer-select-trigger-${item.id}`} className="w-full">
                  <SelectValue placeholder="Select a reviewer" id={`data-table-cell-viewer-reviewer-select-value-${item.id}`} />
                </SelectTrigger>
                <SelectContent id={`data-table-cell-viewer-reviewer-select-content-${item.id}`}>
                  <SelectItem value="Eddie Lake" id={`data-table-cell-viewer-reviewer-select-item-eddie-lake-${item.id}`}>Eddie Lake</SelectItem>
                  <SelectItem value="Jamik Tashpulatov" id={`data-table-cell-viewer-reviewer-select-item-jamik-${item.id}`}>
                    Jamik Tashpulatov
                  </SelectItem>
                  <SelectItem value="Emily Whalen" id={`data-table-cell-viewer-reviewer-select-item-emily-${item.id}`}>Emily Whalen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DrawerFooter id={`data-table-cell-viewer-footer-${item.id}`}>
          <Button id={`data-table-cell-viewer-submit-button-${item.id}`}>
            <span id={`data-table-cell-viewer-submit-button-text-${item.id}`}>Submit</span>
          </Button>
          <DrawerClose asChild id={`data-table-cell-viewer-close-${item.id}`}>
            <Button variant="outline" id={`data-table-cell-viewer-done-button-${item.id}`}>
              <span id={`data-table-cell-viewer-done-button-text-${item.id}`}>Done</span>
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
