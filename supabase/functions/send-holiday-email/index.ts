import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.7";

const SMTP_EMAIL = Deno.env.get("SMTP_EMAIL");
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");

const PLAYLIST = [
    { title: "Jingle Bell Rock", url: "https://www.youtube.com/watch?v=itcMLwMEeMQ" },
    { title: "All I Want for Christmas is You", url: "https://www.youtube.com/watch?v=yXQViqx6GMY" },
    { title: "Last Christmas", url: "https://www.youtube.com/watch?v=E8gmARGvPlI" },
    { title: "Rockin' Around the Christmas Tree", url: "https://www.youtube.com/watch?v=_6xNuUEnh2g" },
    { title: "Feliz Navidad", url: "https://www.youtube.com/watch?v=N8NcQzMQN_U" },
];

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { email, name } = await req.json();

        if (!email) {
            throw new Error("Email is required");
        }

        if (!SMTP_EMAIL || !SMTP_PASSWORD) {
            console.error("SMTP credentials missing");
            throw new Error("Server configuration error: Missing SMTP Credentials");
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: SMTP_EMAIL,
                pass: SMTP_PASSWORD,
            },
        });

        const randomSong = PLAYLIST[Math.floor(Math.random() * PLAYLIST.length)];

        const info = await transporter.sendMail({
            from: `"Interactive Christmas Tree" <${SMTP_EMAIL}>`,
            to: email,
            subject: "🎄 Mutlu Noeller ! İşte yeni yıl motto şarkın",
            html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
          <h1 style="color: #d32f2f;">Mutlu Yıllar, ${name || 'Dostum'}! 🎅</h1>
          <p>İnteraktif Yılbaşı Ağacımıza not bıraktığın için teşekkürler.</p>
          <p>Ufak bir hediye olarak, işte sana özel şarkın:</p>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #f0fdf4; border-radius: 10px; border: 2px dashed #166534;">
            <h3 style="margin: 0 0 10px 0;">${randomSong.title}</h3>
            <a href="${randomSong.url}" style="display: inline-block; background-color: #d32f2f; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;">
              Şimdi Dinle 🎧
            </a>
          </div>

          <p style="font-size: 14px; color: #666;">
            Umarız neşe ve mutluluk dolu harika bir yıl geçirirsin!
          </p>
        </div>
      `,
        });

        console.log("Email sent: %s", info.messageId);

        return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
