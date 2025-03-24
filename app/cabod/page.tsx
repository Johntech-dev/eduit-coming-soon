"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bell, Download, LogOut, Rocket, Users, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getWaitlistEntries, getNotificationSubscribers, sendNotification, resendConfirmationEmails } from "@/lib/actions"
import { exportToCSV } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"
import { Send } from "lucide-react"

interface WaitlistEntry {
  id: number
  school_name: string
  email: string
  phone_number: string
  discount: number
  created_at: string
}

interface Subscriber {
  id: number
  email: string
  created_at: string
}

interface WaitlistResponse {
  entries: WaitlistEntry[]
  error?: string
}

interface SubscribersResponse {
  subscribers: Subscriber[]
  error?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([])
  const [notificationSubscribers, setNotificationSubscribers] = useState<Subscriber[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [isSendingNotification, setIsSendingNotification] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [isLoadingAuth, setIsLoadingAuth] = useState(false)

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    const checkAuth = async () => {
      const storedAuth = localStorage.getItem("adminAuth")
      if (storedAuth === "true") {
        setIsAuthenticated(true)
        fetchData()
      }
    }
    checkAuth()
  }, [])

  const fetchData = async () => {
    try {
      console.log("Fetching data...")
      const [waitlistData, subscribersData] = await Promise.all([
        getWaitlistEntries(),
        getNotificationSubscribers(),
      ])

      console.log("Waitlist data:", waitlistData)
      console.log("Subscribers data:", subscribersData)

      // Handle waitlist data
      if (Array.isArray(waitlistData)) {
        setWaitlistEntries(waitlistData)
      } else {
        console.error("Invalid waitlist data format:", waitlistData)
        setWaitlistEntries([])
      }

      // Handle subscribers data
      if (Array.isArray(subscribersData)) {
        setNotificationSubscribers(subscribersData)
      } else {
        console.error("Invalid subscribers data format:", subscribersData)
        setNotificationSubscribers([])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setWaitlistEntries([])
      setNotificationSubscribers([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoadingAuth(true)

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsAuthenticated(true)
        localStorage.setItem("adminAuth", "true")
        fetchData()
      } else {
        toast.error(data.error || "Invalid password")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Login failed")
    } finally {
      setIsLoadingAuth(false)
    }
  }

  const handleSendNotification = async () => {
    if (!notificationMessage.trim()) {
      toast.error("Please enter a message")
      return
    }

    setIsSendingNotification(true)
    try {
      const result = await sendNotification(notificationMessage)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Notification sent successfully!")
        setNotificationMessage("")
      }
    } catch (error) {
      console.error("Error sending notification:", error)
      toast.error("Failed to send notification")
    } finally {
      setIsSendingNotification(false)
    }
  }

  const handleExportCSV = () => {
    const data = [
      ...waitlistEntries.map((entry) => ({
        school_name: entry.school_name,
        email: entry.email,
        phone_number: entry.phone_number,
        discount: entry.discount,
        joined_date: formatDate(entry.created_at),
      })),
      ...notificationSubscribers.map((subscriber) => ({
        school_name: "Notification Subscriber",
        email: subscriber.email,
        phone_number: "",
        discount: "",
        joined_date: formatDate(subscriber.created_at),
      })),
    ]

    exportToCSV(data, "waitlist_entries")
  }

  const exportWaitlist = async () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      waitlistEntries.map(e => `${e.school_name},${e.email},${e.phone_number}`).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "waitlist.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportSubscribers = async () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      notificationSubscribers.map(e => `${e.email}`).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "subscribers.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleResendEmails = async () => {
    const response = await resendConfirmationEmails()
    if (response.success) {
      toast.success("Confirmation emails resent successfully.")
    } else {
      toast.error("Failed to resend confirmation emails.")
    }
  }

  const totalPages = Math.ceil(waitlistEntries.length / ITEMS_PER_PAGE)
  const waitlistPaginated = waitlistEntries.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen">
          {/* Left side - Login Form */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Login</h1>
                <p className="text-gray-600">Enter your password to access the dashboard</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                    disabled={isLoadingAuth}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoadingAuth}
                >
                  {isLoadingAuth ? "Logging in..." : "Login"}
                </Button>
              </form>
            </div>
          </div>

          {/* Right side - Decorative */}
          <div className="hidden lg:block flex-1 bg-green-600 p-8 text-white">
            <div className="h-full flex flex-col justify-center">
              <div className="max-w-md mx-auto text-center">
                <Rocket className="h-16 w-16 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">Welcome to EduIT Admin</h2>
                <p className="text-lg text-green-100">
                  Manage your waitlist and send notifications to your subscribers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex space-x-4">
              <Button
                onClick={handleExportCSV}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </Button>
              <Button
                onClick={exportWaitlist}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4" />
                <span>Export Waitlist</span>
              </Button>
              <Button
                onClick={exportSubscribers}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4" />
                <span>Export Subscribers</span>
              </Button>
              <Button
                onClick={handleResendEmails}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4" />
                <span>Resend Confirmation Emails</span>
              </Button>
              <Button
                onClick={() => {
                  localStorage.removeItem("adminAuth")
                  setIsAuthenticated(false)
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Logout
              </Button>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Send Notification
                </h2>
                <div className="space-y-4">
                  <Textarea
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Enter your notification message..."
                    className="min-h-[100px]"
                  />
                  <Button
                    onClick={handleSendNotification}
                    disabled={isSendingNotification || !notificationMessage.trim()}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4" />
                    <span>
                      {isSendingNotification ? "Sending..." : "Send Notification"}
                    </span>
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Waitlist Entries
                </h2>
                {isLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : waitlistEntries.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No waitlist entries yet
                  </div>
                ) : (
                  <>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>School Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Joined Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {waitlistPaginated.map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell>{entry.school_name}</TableCell>
                              <TableCell>{entry.email}</TableCell>
                              <TableCell>{entry.phone_number}</TableCell>
                              <TableCell>{entry.discount}%</TableCell>
                              <TableCell>{formatDate(entry.created_at)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <Button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center space-x-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </Button>
                      <span className="text-sm text-gray-500">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className="flex items-center space-x-2"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Notification Subscribers
                </h2>
                {isLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : notificationSubscribers.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No notification subscribers yet
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Subscribed Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {notificationSubscribers.map((subscriber) => (
                          <TableRow key={subscriber.id}>
                            <TableCell>{subscriber.email}</TableCell>
                            <TableCell>{formatDate(subscriber.created_at)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

