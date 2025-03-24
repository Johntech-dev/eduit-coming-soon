"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@supabase/supabase-js"
import nodemailer from "nodemailer"

// Initialize Supabase client with proper error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
}

// Create the client only if we have the required values
const supabase = createClient(
  supabaseUrl || "", // Fallback to empty string to prevent initialization error
  supabaseServiceKey || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASSWORD || "",
  },
}

// Function to subscribe to notifications (just email)
export async function subscribeToNotifications(email: string) {
  if (!email || !email.includes("@")) {
    return { error: "Please provide a valid email address" }
  }

  try {
    // Check if the table exists
    const { error: tableCheckError } = await supabase.from("notifications").select("id").limit(1)

    if (tableCheckError) {
      console.error("Table check error:", tableCheckError)
      // If table doesn't exist, create it
      const { error: createTableError } = await supabase.rpc("create_notifications_if_not_exists")
      if (createTableError) {
        console.error("Failed to create table:", createTableError)
        return { error: "Database setup issue. Please contact support." }
      }
    }

    // Check if email already exists in notifications table
    const { data: existingNotification, error: checkError } = await supabase
      .from("notifications")
      .select("email")
      .eq("email", email)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing notification:", checkError)
      return { error: "Failed to check subscription status." }
    }

    if (existingNotification) {
      return { error: "This email is already subscribed for notifications" }
    }

    // Insert into notifications table with confirmed set to false
    const { error: insertError } = await supabase.from("notifications").insert({ email, confirmed: false })

    if (insertError) {
      console.error("Error inserting notification:", insertError)
      return { error: "Failed to subscribe. Database error." }
    }

    // Send confirmation email
    await sendConfirmationEmail(email, "notification")

    // Update confirmed status to true
    await supabase.from("notifications").update({ confirmed: true }).eq("email", email)

    return { success: true }
  } catch (error) {
    console.error("Error subscribing to notifications:", error)
    return { error: "Failed to subscribe. Please try again." }
  }
}

// Function to join waitlist (school name, email, and phone number)
export async function joinWaitlist(schoolName: string, email: string, phoneNumber: string) {
  if (!schoolName || !schoolName.trim()) {
    return { error: "Please provide a school name" }
  }

  if (!email || !email.includes("@")) {
    return { error: "Please provide a valid email address" }
  }

  if (!phoneNumber || !phoneNumber.trim()) {
    return { error: "Please provide a phone number" }
  }

  try {
    // Check if waitlist table exists
    const { error: tableCheckError } = await supabase.from("waitlist").select("id").limit(1)

    if (tableCheckError) {
      console.error("Table check error:", tableCheckError)
      // If table doesn't exist, create it
      const { error: createTableError } = await supabase.rpc("create_waitlist_if_not_exists")
      if (createTableError) {
        console.error("Failed to create table:", createTableError)
        return { error: "Database setup issue. Please contact support." }
      }
    }

    // Check if email already exists in waitlist table
    const { data: existingWaitlist, error: checkError } = await supabase
      .from("waitlist")
      .select("email")
      .eq("email", email)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking existing waitlist entry:", checkError)
      return { error: "Failed to check waitlist status." }
    }

    if (existingWaitlist) {
      return { error: "This school is already on our waitlist" }
    }

    // Insert into waitlist table with confirmed set to false
    const { error: insertError } = await supabase.from("waitlist").insert({
      school_name: schoolName,
      email,
      phone_number: phoneNumber,
      discount: 50,
      confirmed: false,
    })

    if (insertError) {
      console.error("Error inserting waitlist entry:", insertError)
      return { error: "Failed to join waitlist. Database error." }
    }

    // Send confirmation email
    await sendConfirmationEmail(email, "waitlist", schoolName)

    // Update confirmed status to true
    await supabase.from("waitlist").update({ confirmed: true }).eq("email", email)

    return { success: true }
  } catch (error) {
    console.error("Error joining waitlist:", error)
    return { error: "Failed to join waitlist. Please try again." }
  }
}

// Function to get all waitlist entries
export async function getWaitlistEntries() {
  try {
    const { data, error } = await supabase.from("waitlist").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching waitlist entries:", error)
    return []
  }
}

// Function to get all notification subscribers
export async function getNotificationSubscribers() {
  try {
    const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching notification subscribers:", error)
    return []
  }
}

// Function to send notification to all subscribers
export async function sendNotification(message: string) {
  if (!message || !message.trim()) {
    return { error: "Please enter a message" }
  }

  try {
    // Get all notification subscribers
    const subscribers = await getNotificationSubscribers()

    if (subscribers.length === 0) {
      return { error: "No subscribers to send notifications to" }
    }

    // Send emails to all subscribers
    const emailPromises = subscribers.map((subscriber) => sendEmailNotification(subscriber.email, message))

    await Promise.all(emailPromises)

    // Record the notification in the database
    const { error } = await supabase.from("sent_notifications").insert([
      {
        message,
        recipients_count: subscribers.length,
        sent_at: new Date().toISOString(),
      },
    ])

    if (error) throw error

    return { success: `Notification sent to ${subscribers.length} subscribers` }
  } catch (error) {
    console.error("Error sending notification:", error)
    return { error: "Failed to send notification. Please try again." }
  }
}

// Helper function to send confirmation emails
async function sendConfirmationEmail(email: string, type: "notification" | "waitlist", schoolName?: string) {
  try {
    const transporter = nodemailer.createTransport(emailConfig)

    let subject, html

    if (type === "notification") {
      subject = "Thank you for subscribing to EduIT notifications"
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #16a34a; padding: 20px; text-align: center; color: white;">
            <h1>EduIT</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <h2>Thank You for Subscribing!</h2>
            <p>You're now on our notification list. We'll let you know as soon as EduIT launches.</p>
            <p>We're building a complete school management system that will simplify administration, enhance learning, and connect your entire educational community.</p>
            <p>Stay tuned for updates!</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
              <p>© 2024 EduIT. All rights reserved.</p>
              <p>If you didn't sign up for notifications, please ignore this email.</p>
            </div>
          </div>
        </div>
      `
    } else if (type === "waitlist") {
      subject = "Thank you for joining the EduIT waitlist"
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #16a34a; padding: 20px; text-align: center; color: white;">
            <h1>EduIT</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <h2>Thank You for Joining the Waitlist!</h2>
            <p>Your school, ${schoolName}, has been added to our waitlist. We'll notify you as soon as we launch.</p>
            <p>Thank you for your interest in EduIT!</p>
          </div>
        </div>
      `
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html,
    })
  } catch (error) {
    console.error("Error sending confirmation email:", error)
  }
}

// Helper function to send notification emails
async function sendEmailNotification(email: string, message: string) {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport(emailConfig)

    // Send email
    await transporter.sendMail({
      from: `"EduIT" <${emailConfig.auth.user}>`,
      to: email,
      subject: "Important Update from EduIT",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #16a34a; padding: 20px; text-align: center; color: white;">
            <h1>EduIT</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <h2>Important Update</h2>
            <div style="padding: 15px; background-color: #f3f4f6; border-radius: 5px; margin: 20px 0;">
              ${message.replace(/\n/g, "<br>")}
            </div>
            <p>Thank you for your interest in EduIT!</p>  '<br>')}
            </div>
            <p>Thank you for your interest in EduIT!</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
              <p>© 2024 EduIT. All rights reserved.</p>
              <p>If you received this email by mistake, please ignore it.</p>
            </div>
          </div>
        </div>
      `,
      headers: {
        "X-Priority": "1", // High priority
        Importance: "high",
        "X-MSMail-Priority": "High",
        "X-Mailer": "EduIT Notification System",
      },
    })

    return true
  } catch (error) {
    console.error("Error sending notification email:", error)
    return false
  }
}

// Function to resend confirmation emails
export async function resendConfirmationEmails() {
  try {
    // Get all unconfirmed notifications
    const { data: unconfirmedNotifications, error: notificationError } = await supabase
      .from("notifications")
      .select("*")
      .eq("confirmed", false)

    if (notificationError) throw notificationError

    // Send emails to unconfirmed notifications
    for (const notification of unconfirmedNotifications) {
      await sendConfirmationEmail(notification.email, "notification")
      // Update confirmed status to true after sending
      await supabase.from("notifications").update({ confirmed: true }).eq("email", notification.email)
    }

    // Get all unconfirmed waitlist entries
    const { data: unconfirmedWaitlist, error: waitlistError } = await supabase
      .from("waitlist")
      .select("*")
      .eq("confirmed", false)

    if (waitlistError) throw waitlistError

    // Send emails to unconfirmed waitlist entries
    for (const entry of unconfirmedWaitlist) {
      await sendConfirmationEmail(entry.email, "waitlist", entry.school_name)
      // Update confirmed status to true after sending
      await supabase.from("waitlist").update({ confirmed: true }).eq("email", entry.email)
    }

    return { success: "Confirmation emails resent successfully." }
  } catch (error) {
    console.error("Error resending confirmation emails:", error)
    return { error: "Failed to resend confirmation emails." }
  }
}

