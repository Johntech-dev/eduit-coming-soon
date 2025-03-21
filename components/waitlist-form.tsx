"use client"

import type React from "react"

import { useState } from "react"
import { School, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { joinWaitlist } from "@/lib/actions"
import { PulseAnimation, SuccessAnimation } from "@/components/animations"
import { toast } from "sonner"

export default function WaitlistForm() {
  const [formData, setFormData] = useState({
    schoolName: "",
    email: "",
    phoneNumber: "",
  })
  const [status, setStatus] = useState<{ type: string; message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)

    try {
      const result = await joinWaitlist(formData.schoolName, formData.email, formData.phoneNumber)

      if (result.error) {
        setStatus({ type: "error", message: result.error })
        toast.error(result.error)
      } else {
        setStatus({ type: "success", message: "Your school has been added to our waitlist with a 50% discount!" })
        setFormData({ schoolName: "", email: "", phoneNumber: "" })
        toast.success("Successfully joined the waitlist!")
      }
    } catch (error) {
      setStatus({ type: "error", message: "Something went wrong. Please try again." })
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl text-center">Join with 50% Discount</CardTitle>
          <CardDescription className="text-center">
            Enter your school details to join our waitlist and secure your discount.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
            <motion.div
              className="space-y-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Label htmlFor="schoolName">School Name</Label>
              <Input
                id="schoolName"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                placeholder="Enter your school name"
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-green-500"
              />
            </motion.div>
            <motion.div
              className="space-y-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Label htmlFor="email">School Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="school@example.com"
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-green-500"
              />
            </motion.div>
            <motion.div
              className="space-y-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="transition-all duration-300 focus:ring-2 focus:ring-green-500"
              />
            </motion.div>
          </CardContent>
          <CardFooter>
            <PulseAnimation className="w-full">
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                disabled={isSubmitting}
              >
                <School className="mr-2 h-4 w-4" />
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Submitting...
                  </>
                ) : (
                  "Join Waitlist with 50% Discount"
                )}
              </Button>
            </PulseAnimation>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}

