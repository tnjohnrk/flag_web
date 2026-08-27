import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request) {
  try {
    const apiKey = process.env.Resend_Api_Key || process.env.RESEND_API_KEY;
    const fromAddress = process.env.from_address || process.env.FROM_ADDRESS;
    const toAddress = process.env.to_address || process.env.TO_ADDRESS;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Resend API key is missing in environment variables." },
        { status: 500 }
      );
    }

    if (!fromAddress || !toAddress) {
      return NextResponse.json(
        { success: false, error: "Email from_address or to_address is missing in environment variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      mobile,
      email,
      city,
      religiousBackground,
      watchingOnline,
      communicationConsent,
    } = body;

    if (!firstName || !lastName || !mobile || !email || !city || !religiousBackground || !watchingOnline) {
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
                <div class="value"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></div>
              </div>
              <div class="field-group">
                <div class="label">Mobile Number</div>
                <div class="value">${mobile}</div>
              </div>
              <div class="field-group">
                <div class="label">City</div>
                <div class="value">${city}</div>
              </div>
              <div class="field-group">
                <div class="label">Religious Background</div>
                <div class="value">${religiousBackground}</div>
              </div>
              <div class="field-group">
                <div class="label">Watching Online Duration</div>
                <div class="value">${watchingOnline}</div>
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

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [toAddress],
      replyTo: email,
      subject: emailSubject,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to send email via Resend." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error("Server Route Error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
