"use client"

import type React from "react"

import { useState } from "react"
import { Bell, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { subscribeToNotifications } from "@/lib/actions"
import { PulseAnimation, SuccessAnimation } from "@/components/animations"

export default function NotifyMeModal() {
  const [email, setEmail] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<{ type: string; message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)

    if (!email || !email.includes("@")) {
      setStatus({ type: "error", message: "Please enter a valid email address" })
      setIsSubmitting(false)
      return
    }

    try {
      const result = await subscribeToNotifications(email)

      if (result.error) {
        setStatus({ type: "error", message: result.error })
      } else {
        setStatus({ type: "success", message: "You'll be notified when we launch!" })
        setEmail("")
        // Close the dialog after a successful submission after 2 seconds
        setTimeout(() => setIsOpen(false), 2000)
      }
    } catch (error) {
      console.error("Notification subscription error:", error)
      setStatus({ type: "error", message: "Something went wrong. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <PulseAnimation>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:shadow-lg">
            <Bell className="mr-2 h-4 w-4" />
            Notify Me
          </Button>
        </PulseAnimation>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Get Notified</DialogTitle>
          <DialogDescription>Enter your school email to be notified when EduIT launches.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-3 text-sm rounded-md overflow-hidden ${
                    status.type === "success"
                      ? "bg-green-100 border border-green-200 text-green-600"
                      : "bg-red-100 border border-red-200 text-red-600"
                  }`}
                >
                  {status.type === "success" && (
                    <SuccessAnimation className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {status.message}
                    </SuccessAnimation>
                  )}
                  {status.type === "error" && status.message}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                School Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="school@example.com"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <PulseAnimation>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : null}
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </PulseAnimation>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

