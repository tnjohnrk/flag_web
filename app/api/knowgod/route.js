import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const apiKey =
      process.env.Resend_Api_Key ||
      process.env.RESEND_API_KEY ||
      process.env.resend_api_key ||
      process.env.Resend_API_Key;

    const fromAddress =
      process.env.from_address ||
      process.env.FROM_ADDRESS ||
      process.env.From_Address ||
      process.env.fromAddress;

    const toAddress =
      process.env.to_address ||
      process.env.TO_ADDRESS ||
      process.env.To_Address ||
      process.env.toAddress;

    if (!apiKey) {
      console.error("Missing Resend API Key in environment variables.");
      return NextResponse.json(
        {
          success: false,
          error: "Resend API key is missing. Please check your Vercel Environment Variables (Resend_Api_Key or RESEND_API_KEY).",
        },
        { status: 500 }
      );
    }

    if (!fromAddress || !toAddress) {
      console.error("Missing from_address or to_address in environment variables.");
      return NextResponse.json(
        {
          success: false,
          error: `Missing email configuration: ${!fromAddress ? 'from_address' : ''} ${!toAddress ? 'to_address' : ''}. Please check Vercel Environment Variables.`,
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      mobile,
      email,
      address,
      mapLink,
      houseVisit,
      canContact,
      communicationConsent,
    } = body;

    if (!firstName || !lastName || !mobile || !address || !houseVisit || !canContact) {
      return NextResponse.json(
        { success: false, error: "Please fill out all required fields." },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);

    const emailSubject = `New Know God Connect Request: ${firstName} ${lastName}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f5f7; color: #1e293b; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { background: #1b2559; color: #ffffff; padding: 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; color: #D9A31A; }
            .header p { margin: 6px 0 0 0; font-size: 14px; opacity: 0.9; }
            .content { padding: 24px; }
            .field-group { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
            .field-group:last-child { border-bottom: none; margin-bottom: 0; }
            .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600; margin-bottom: 4px; }
            .value { font-size: 16px; color: #0f172a; font-weight: 500; }
            .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Know God - Connect Request</h1>
              <p>Full Life Assembly of God Church</p>
            </div>
            <div class="content">
              <div class="field-group">
                <div class="label">Full Name</div>
                <div class="value">${firstName} ${lastName}</div>
              </div>
              <div class="field-group">
                <div class="label">Email Address</div>
                <div class="value">${email ? `<a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>` : '<span style="color: #94a3b8; font-style: italic;">Not provided</span>'}</div>
              </div>
              <div class="field-group">
                <div class="label">Mobile Number</div>
                <div class="value">${mobile}</div>
              </div>
               <div class="field-group">
                <div class="label">Address of Residency</div>
                <div class="value">${address}</div>
              </div>
              ${mapLink ? `
              <div class="field-group">
                <div class="label">Marked Location (Google Maps)</div>
                <div class="value"><a href="${mapLink}" style="color: #2563eb; text-decoration: underline;">View Marked Position on Map</a></div>
              </div>
              ` : ""}
              <div class="field-group">
                <div class="label">Can we visit your house?</div>
                <div class="value">${houseVisit}</div>
              </div>
              <div class="field-group">
                <div class="label">Can we contact you?</div>
                <div class="value">${canContact}</div>
              </div>
              <div class="field-group">
                <div class="label">Communication Consent</div>
                <div class="value">${communicationConsent ? "Yes, consented to contact via phone/SMS/WhatsApp" : "No"}</div>
              </div>
            </div>
            <div class="footer">
              This message was sent automatically from the Know God section on Full Life AG Church website.
            </div>
          </div>
        </body>
      </html>
    `;

    const emailPayload = {
      from: fromAddress,
      to: [toAddress],
      subject: emailSubject,
      html: htmlContent,
    };

    if (email && typeof email === "string" && email.trim()) {
      emailPayload.replyTo = email.trim();
    }

    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      console.error("Resend API Error details:", error);
      const errMsg = error.message || (typeof error === "string" ? error : JSON.stringify(error));
      return NextResponse.json(
        { success: false, error: `Resend API Error: ${errMsg}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("Server Route Catch Error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
