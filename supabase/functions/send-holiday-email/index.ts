import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.7";

const SMTP_EMAIL = Deno.env.get("SMTP_EMAIL");
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");

const PLAYLIST = [
    { title: "Yaşar - Divane", url: "https://www.youtube.com/watch?v=L5Q4UjT7rQ0" },
    { title: "Yaşar - Kumralım", url: "https://www.youtube.com/watch?v=kYJj4_5033c" },
    { title: "Ebru Gündeş - Çingenem", url: "https://www.youtube.com/watch?v=gT1-56q1u_Q" },
    { title: "Harun Kolçak - Gir Kanıma", url: "https://www.youtube.com/watch?v=nO3_TfWjQ0w" },
    { title: "Gülşen - Be Adam", url: "https://www.youtube.com/watch?v=Td5ZZ6yWUos" },
    { title: "Aşkın Nur Yengi - Ay İnanmıyorum", url: "https://www.youtube.com/watch?v=k_l2uYg3G_c" },
    { title: "Serdar Ortaç - Gamzelim", url: "https://www.youtube.com/watch?v=kYn3NfP7EOM" },
    { title: "Mustafa Sandal - Aya Benzer", url: "https://www.youtube.com/watch?v=34wK9KkQ0gI" },
    { title: "Barış Manço - Bal Böceği", url: "https://www.youtube.com/watch?v=13Q1v701R0Q" },
    { title: "Burak Kut - Yaşandı Bitti", url: "https://www.youtube.com/watch?v=Jm_6YFwK5F0" },
    { title: "MFÖ - Sakın Gelme", url: "https://www.youtube.com/watch?v=3eCjP1iC_9g" },
    { title: "Ayna - Yeniden de Sevebiliriz... Akdeniz", url: "https://www.youtube.com/watch?v=0kG7u15Q778" },
    { title: "Özdemir Erdoğan - Aç Kapıyı Gir İçeri", url: "https://www.youtube.com/watch?v=YpLgT8H1vL0" },
    { title: "Oya, Bora - Sevme Zamanı", url: "https://www.youtube.com/watch?v=mDfY78u5D94" },
    { title: "Ezginin Günlüğü - Düşler Sokağı", url: "https://www.youtube.com/watch?v=2n-i3-lX7vE" },
    { title: "Zeki Müren - Elbet Birgün Buluşacağız", url: "https://www.youtube.com/watch?v=YfH8a9KzK70" },
    { title: "Füsun Önal - Senden Başka", url: "https://www.youtube.com/watch?v=R9K1uW8mC0U" },
    { title: "Emel Sayın - Mavi Boncuk", url: "https://www.youtube.com/watch?v=t-q5H_15y2A" },
    { title: "Cici Kızlar - Delisin", url: "https://www.youtube.com/watch?v=3OnqQrQLHp8" },
    { title: "Şenay - Sev Kardeşim", url: "https://www.youtube.com/watch?v=r0l5f12Gf1w" },
    { title: "Hande Yener - Aşkın Ateşi", url: "https://www.youtube.com/watch?v=jW_s_h0_4oA" },
    { title: "Gülşen - Ne Kavgam Bitti Ne Sevdam", url: "https://www.youtube.com/watch?v=GjYyL1c3IuA" },
    { title: "Gülşen - Sarışınım", url: "https://www.youtube.com/watch?v=Zc2gYd8_L4c" },
    { title: "Gülçin Ergül - Bir Tanecik Aşkım", url: "https://www.youtube.com/watch?v=qX3H_u5f2oE" },
    { title: "Sezen Aksu - Kaçın Kurası", url: "https://www.youtube.com/watch?v=yYyT5wT_vXU" },
    { title: "Göksel - Baksana Talihe", url: "https://www.youtube.com/watch?v=1d9l5S_7l1k" },
    { title: "Hakan Peker - Karam", url: "https://www.youtube.com/watch?v=yY1lG0q82XQ" },
    { title: "Yaşar - Birtanem", url: "https://www.youtube.com/results?search_query=Yasar+Birtanem" },
    { title: "Sezen Aksu - Haydi Gel Benimle Ol", url: "https://www.youtube.com/results?search_query=Sezen+Aksu+Haydi+Gel+Benimle+Ol" },
    { title: "Reyhan Karaca - Sevdik Sevdalandık", url: "https://www.youtube.com/results?search_query=Reyhan+Karaca+Sevdik+Sevdalandik" },
    { title: "Barış Manço - Gibi Gibi", url: "https://www.youtube.com/results?search_query=Baris+Manco+Gibi+Gibi" },
    { title: "Erol Evgin, Hande Yener - Sevdan Olmasa", url: "https://www.youtube.com/results?search_query=Erol+Evgin+Hande+Yener+Sevdan+Olmasa" },
    { title: "Barış Manço - Kara Sevda", url: "https://www.youtube.com/results?search_query=Baris+Manco+Kara+Sevda" },
    { title: "Sıla - Kafa", url: "https://www.youtube.com/results?search_query=Sila+Kafa" },
    { title: "Serdar Ortaç - Ben Adam Olmam", url: "https://www.youtube.com/results?search_query=Serdar+Ortac+Ben+Adam+Olmam" },
    { title: "Sezen Aksu - İkili Delilik", url: "https://www.youtube.com/results?search_query=Sezen+Aksu+Ikili+Delilik" },
    { title: "Duman - Bal", url: "https://www.youtube.com/results?search_query=Duman+Bal" },
    { title: "Halit Bilgiç - Özledim Seni", url: "https://www.youtube.com/results?search_query=Halit+Bilgic+Ozledim+Seni" },
    { title: "Ayla Dikmen - İlk ve Son Aşkım Sen Olacaksın", url: "https://www.youtube.com/results?search_query=Ayla+Dikmen+Ilk+Ve+Son+Askim+Sen+Olacaksin" },
    { title: "Sezen Aksu - Ben Her Bahar Aşık Olurum", url: "https://www.youtube.com/results?search_query=Sezen+Aksu+Ben+Her+Bahar+Asik+Olurum" }
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
