"use server"

import { revalidatePath } from "next/cache"

// In a real application, you would use a database to store this information
const waitlistEntries: { email: string; date: string }[] = []

export async function subscribeToWaitlist(formData: FormData) {
  const email = formData.get("email") as string

  if (!email || !email.includes("@")) {
    return { error: "Please provide a valid email address" }
  }

  // Check if email already exists
  if (waitlistEntries.some((entry) => entry.email === email)) {
    return { error: "This email is already on our waitlist" }
  }

  // Add to waitlist
  waitlistEntries.push({
    email,
    date: new Date().toISOString(),
  })

  revalidatePath("/")
  revalidatePath("/admin")

  return { success: "You've been added to our waitlist!" }
}

export async function getWaitlistEntries() {
  // In a real application, you would fetch this from a database
  return waitlistEntries
}

export async function sendNotification(emails: string[], message: string) {
  // In a real application, you would integrate with an email service
  console.log(`Sending notification to ${emails.length} subscribers: ${message}`)

  // Simulate sending notification
  return { success: `Notification sent to ${emails.length} subscribers` }
}

