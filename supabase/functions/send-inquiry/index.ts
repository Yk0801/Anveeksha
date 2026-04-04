import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message } = await req.json();

    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment variable. Add it via Vercel or Supabase Dashboard.");
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sri Anveeksha <onboarding@resend.dev>",
        to: "yukthasri0801@gmail.com",
        reply_to: email,
        subject: `New Admission Inquiry from ${name}`,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f9ece4; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(249, 115, 22, 0.05);">
            <div style="background-color: #F97316; padding: 24px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">New Admission Inquiry</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 14px;">Sri Anveeksha Public School</p>
            </div>
            <div style="background-color: #ffffff; padding: 32px 24px;">
              <p style="font-size: 16px; color: #475569; margin-top: 0;">Hello Administration,</p>
              <p style="font-size: 16px; color: #475569; line-height: 1.6;">You have received a new inquiry through the website's contact form. Below are the details:</p>
              <div style="background-color: #fff7ed; border-left: 4px solid #F97316; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #64748b; width: 80px; font-weight: bold;">Name:</td>
                    <td style="padding: 8px 0; font-size: 15px; color: #1e293b; font-weight: 500;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #64748b; font-weight: bold;">Email:</td>
                    <td style="padding: 8px 0; font-size: 15px; color: #1e293b;"><a href="mailto:${email}" style="color: #F97316; text-decoration: none;">${email}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; color: #64748b; font-weight: bold;">Phone:</td>
                    <td style="padding: 8px 0; font-size: 15px; color: #1e293b;">${phone}</td>
                  </tr>
                </table>
              </div>
              <h3 style="color: #0f172a; font-size: 16px; margin: 0 0 12px 0;">Message:</h3>
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; font-size: 15px; color: #334155; line-height: 1.6; white-space: pre-wrap;">
                ${message}
              </div>
            </div>
            <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 13px;">This email was automatically generated from the Sri Anveeksha website.</p>
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to send email via Resend");
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
