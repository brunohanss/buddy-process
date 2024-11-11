"use client"

import { ColumnDef } from "@tanstack/react-table"


import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Checkbox } from "@/components/ui/checkbox"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css";
import { Module } from "../../data/schema"
import { ModuleActionTypeList } from "../../data/data"
export const columns: ColumnDef<Module>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: "code",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Code" />
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("code")}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "logoUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Provider" />
    ),
    cell: ({ row }) => {
      const logoUrl = row.getValue("logoUrl") as string

      if (!logoUrl) {
        return null
      }

      return (
        <div className="flex items-center">
          {<LazyLoadImage
            src={row.getValue("logoUrl")}
            alt="Integration Logo"
            effect="blur"
            height={30} 
            width={30} 
          />}
          {row.original.integrationName}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <div>
        <DataTableColumnHeader column={column} title="Name" />
      </div>
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label);
  
      return (
        <div className="flex space-x-2 lg:flex"> 
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },{
    accessorKey: "addModule",
    header: ({ column }) => (
      <div>
        <DataTableColumnHeader column={column} title="Name" />
      </div>
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.label);
  
      return (
        <div className="flex space-x-2 lg:flex"> 
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "actionType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      // console.log("Row action type", row.getValue("actionType"))
      const actionType = ModuleActionTypeList.find(
        (status) => status.value === row.getValue("actionType")
      )

      if (!actionType) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {actionType && 
            actionType.icon()
          }
          <span>{actionType.value}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
