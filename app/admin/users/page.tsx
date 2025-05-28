"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface User {
  id: string
  email: string
  name: string
  credits: number
  created_at: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreditUpdate = async (userId: string, newCredits: number) => {
    try {
      const { data, error } = await supabase.from("users").update({ credits: newCredits }).eq("id", userId).select()

      if (error) throw error

      if (data && data.length > 0) {
        setUsers(users.map((user) => (user.id === userId ? { ...user, credits: data[0].credits } : user)))
        setEditingUser(null)
        toast({
          title: "Success",
          description: "User credits updated successfully.",
        })
      } else {
        throw new Error("No data returned from update operation")
      }
    } catch (error) {
      console.error("Error updating user credits:", error)
      toast({
        title: "Error",
        description: "Failed to update user credits. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-gray-600">Manage and view all users of the platform</p>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.credits}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User Credits</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="credits">Credits</Label>
                        <Input
                          id="credits"
                          type="number"
                          value={editingUser?.credits || 0}
                          onChange={(e) => {
                            const value = e.target.value === "" ? 0 : Number.parseInt(e.target.value, 10)
                            setEditingUser((prev) => (prev ? { ...prev, credits: value } : null))
                          }}
                          min="0"
                          step="1"
                        />
                      </div>
                      <Button
                        onClick={() => {
                          if (editingUser) {
                            handleCreditUpdate(editingUser.id, editingUser.credits)
                            setEditingUser(null)
                          }
                        }}
                      >
                        Update Credits
                      </Button>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AdminLayout>
  )
}
