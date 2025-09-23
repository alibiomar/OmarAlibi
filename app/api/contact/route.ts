// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

// Validation schema
const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  persona: z.enum(["engineer", "freelancer"]),
})

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 unique IPs per minute
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip ?? '127.0.0.1'
    const { success } = await limiter.check(5, ip) // 5 requests per minute per IP
    
    if (!success) {
      return NextResponse.json(
        { message: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate request data
    const validatedData = contactSchema.parse(body)

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
      },
    })

    // Email content based on persona
    const isEngineer = validatedData.persona === 'engineer'
    const personaLabel = isEngineer ? 'Engineering' : 'Design'
    
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            New ${personaLabel} Contact Form Submission
          </h2>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #0066cc; margin-bottom: 15px;">Contact Details</h3>
            <p><strong>Name:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
            <p><strong>Persona:</strong> ${personaLabel}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #0066cc; margin-bottom: 15px;">Message</h3>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #0066cc;">
              ${validatedData.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This email was sent from your portfolio contact form on ${new Date().toLocaleString()}.</p>
            <p>Reply directly to this email to respond to ${validatedData.firstName}.</p>
          </div>
        </div>
      </div>
    `

    const emailText = `
New ${personaLabel} Contact Form Submission

Name: ${validatedData.firstName} ${validatedData.lastName}
Email: ${validatedData.email}
Subject: ${validatedData.subject}
Persona: ${personaLabel}

Message:
${validatedData.message}

Sent on: ${new Date().toLocaleString()}
    `

    // Send email to yourself
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Send to yourself
      replyTo: validatedData.email, // Set reply-to as the sender's email
      subject: `${personaLabel} Contact: ${validatedData.subject}`,
      text: emailText,
      html: emailHTML,
    })

    // Send confirmation email to the sender
    const confirmationHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Thank you for reaching out!</h2>
          
          <p>Hi ${validatedData.firstName},</p>
          
          <p>Thank you for contacting me about "${validatedData.subject}". I've received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #0066cc; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0066cc;">Your Message Summary:</h3>
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
            <p><strong>Message:</strong> ${validatedData.message.substring(0, 100)}${validatedData.message.length > 100 ? '...' : ''}</p>
          </div>
          
          <p>If you have any urgent questions, feel free to call me at (+216) 20 261 004.</p>
          
          <p>Best regards,<br>Omar Alibi</p>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This is an automated confirmation email from omaralibi.tn</p>
          </div>
        </div>
      </div>
    `

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: validatedData.email,
      subject: `Thank you for contacting Omar Alibi - ${validatedData.subject}`,
      html: confirmationHTML,
    })

    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid form data', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}