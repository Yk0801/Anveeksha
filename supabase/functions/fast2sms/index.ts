import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FAST2SMS_API_KEY = Deno.env.get("FAST2SMS_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { numbers, message } = await req.json();

    if (!numbers || !message) {
      throw new Error("Missing numbers or message payload");
    }

    if (!FAST2SMS_API_KEY) {
      throw new Error("Missing FAST2SMS_API_KEY inside Supabase Environment Secrets");
    }

    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": FAST2SMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message: message,
        numbers: numbers,
      }),
    });

    const data = await res.json();
    
    if (!res.ok || data.return === false) {
       console.error("Fast2SMS API Error:", data);
       throw new Error(data.message || "Fast2SMS rejected the payload");
    }

    return new Response(JSON.stringify({ success: true, data }), {
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
