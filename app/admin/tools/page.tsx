"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

interface Tool {
  id: string
  name: string
  description: string
  credit_cost: number
  is_active: boolean
}

export default function AdminTools() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("tools").select("*").order("name", { ascending: true })

      if (error) throw error
      setTools(data)
    } catch (error) {
      console.error("Error fetching tools:", error)
      toast({
        title: "Error",
        description: "Failed to fetch tools. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleToolStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("tools").update({ is_active: !currentStatus }).eq("id", id)

      if (error) throw error

      setTools(tools.map((tool) => (tool.id === id ? { ...tool, is_active: !currentStatus } : tool)))

      toast({
        title: "Success",
        description: `Tool status updated successfully.`,
      })
    } catch (error) {
      console.error("Error updating tool status:", error)
      toast({
        title: "Error",
        description: "Failed to update tool status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tools Management</h1>
        <p className="text-gray-600">Manage and configure AI tools available on the platform</p>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading tools...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Credit Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell>{tool.name}</TableCell>
                <TableCell>{tool.description}</TableCell>
                <TableCell>{tool.credit_cost}</TableCell>
                <TableCell>{tool.is_active ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <Button
                    variant={tool.is_active ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleToolStatus(tool.id, tool.is_active)}
                  >
                    {tool.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AdminLayout>
  )
}
