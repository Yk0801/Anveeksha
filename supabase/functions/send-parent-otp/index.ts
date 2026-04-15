import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, otp, name } = await req.json();

    if (!email || !otp) {
      throw new Error("Missing email or otp");
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sri Anveeksha <noreply@srianveeksha.me>",
        to: [email],
        subject: "Your Password Reset OTP",
        html: `
          <div style="font-family: sans-serif; max-w-xl mx-auto p-6 bg-slate-50">
            <h2 style="color: #0c2340;">Sri Anveeksha Techno School</h2>
            <p>Hello ${name || "Parent"},</p>
            <p>You requested a password reset for your Parent Portal account. Please use the following OTP to verify your identity.</p>
            <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; font-size: 24px; text-align: center; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
              ${otp}
            </div>
            <p>This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
