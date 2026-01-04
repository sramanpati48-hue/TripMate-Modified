"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"

export interface DataItem {
  id: string
  name: string
  category: string
  location: string
  status: "published" | "draft"
  rating?: number
  image?: string
}

interface DataTableProps {
  data: DataItem[]
  onEdit?: (item: DataItem) => void
  onDelete?: (item: DataItem) => void
  onToggleStatus?: (item: DataItem) => void
}

export function DataTable({ data, onEdit, onDelete, onToggleStatus }: DataTableProps) {
  const [items, setItems] = useState(data)

  const handleToggle = (item: DataItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: i.status === "published" ? "draft" : "published" } : i)),
    )
    onToggleStatus?.(item)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Visible</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <img
                  src={item.image || "/placeholder.svg?height=40&width=40&query=travel"}
                  alt={item.name}
                  className="w-10 h-10 rounded-md object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{item.category}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{item.location}</TableCell>
              <TableCell>
                <Badge variant={item.status === "published" ? "default" : "outline"}>
                  {item.status === "published" ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Switch checked={item.status === "published"} onCheckedChange={() => handleToggle(item)} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(item)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(item)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
