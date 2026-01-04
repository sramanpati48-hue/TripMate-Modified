"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable, type DataItem } from "@/components/admin/data-table"
import { PlaceFormDialog } from "@/components/admin/place-form-dialog"
import { Search, Plus, Filter } from "lucide-react"

const mockData: DataItem[] = [
  {
    id: "1",
    name: "Eiffel Tower",
    category: "Landmark",
    location: "Paris, France",
    status: "published",
    rating: 4.8,
    image: "/eiffel-tower-paris-landmark.jpg",
  },
  {
    id: "2",
    name: "Sakura Sushi Bar",
    category: "Restaurant",
    location: "Kyoto, Japan",
    status: "published",
    rating: 4.9,
    image: "/japanese-sushi-restaurant.png",
  },
  {
    id: "3",
    name: "Grand Hyatt Tokyo",
    category: "Hotel",
    location: "Tokyo, Japan",
    status: "published",
    rating: 4.7,
    image: "/luxury-hotel-tokyo-skyline.jpg",
  },
  {
    id: "4",
    name: "Northern Lights Tour",
    category: "Experience",
    location: "Iceland",
    status: "draft",
    rating: 4.9,
    image: "/northern-lights-aurora-iceland.jpg",
  },
  {
    id: "5",
    name: "Colosseum",
    category: "Historical",
    location: "Rome, Italy",
    status: "published",
    rating: 4.8,
    image: "/colosseum-rome-ancient-architecture.jpg",
  },
]

export default function AdminPlacesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DataItem | null>(null)
  const [data, setData] = useState(mockData)

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEdit = (item: DataItem) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  const handleDelete = (item: DataItem) => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      setData((prev) => prev.filter((i) => i.id !== item.id))
    }
  }

  const handleSave = (item: Partial<DataItem>) => {
    if (editingItem) {
      setData((prev) => prev.map((i) => (i.id === editingItem.id ? { ...i, ...item } : i)))
    } else {
      setData((prev) => [...prev, item as DataItem])
    }
    setEditingItem(null)
  }

  const handleOpenNew = () => {
    setEditingItem(null)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Places</h1>
          <p className="text-muted-foreground">Manage all destinations, attractions, and points of interest</p>
        </div>
        <Button onClick={handleOpenNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Place
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <DataTable data={filteredData} onEdit={handleEdit} onDelete={handleDelete} />

      <PlaceFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} item={editingItem} onSave={handleSave} />
    </div>
  )
}
