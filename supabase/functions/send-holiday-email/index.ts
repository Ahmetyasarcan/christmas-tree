import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.7";

const SMTP_EMAIL = Deno.env.get("SMTP_EMAIL");
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");

const PLAYLIST = [
    { title: "Yaşar - Divane", url: "https://www.youtube.com/watch?v=HhucJr-9MCk&list=RDHhucJr-9MCk&start_radio=1" },
    { title: "Yaşar - Kumralım", url: "https://www.youtube.com/watch?v=UXK9s54VmxQ&list=RDUXK9s54VmxQ&start_radio=1" },
    { title: "Ebru Gündeş - Çingenem", url: "https://www.youtube.com/watch?v=uOGTROc4TQ4&list=RDuOGTROc4TQ4&start_radio=1" },
    { title: "Harun Kolçak - Gir Kanıma", url: "https://www.youtube.com/watch?v=hK73i75SnQw&list=RDhK73i75SnQw&start_radio=1" },
    { title: "Gülşen - Be Adam", url: "https://www.youtube.com/watch?v=Td5ZZ6yWUos&list=RDTd5ZZ6yWUos&start_radio=1" },
    { title: "Aşkın Nur Yengi - Ay İnanmıyorum", url: "https://www.youtube.com/watch?v=zFM9Jq31UEY&list=RDzFM9Jq31UEY&start_radio=1" },
    { title: "Serdar Ortaç - Gamzelim", url: "https://www.youtube.com/results?search_query=gamzelim" },
    { title: "Mustafa Sandal - Aya Benzer", url: "https://www.youtube.com/results?search_query=aya+benzer" },
    { title: "Barış Manço - Bal Böceği", url: "https://www.youtube.com/watch?v=YXmSNwYIw7Q&list=RDYXmSNwYIw7Q&start_radio=1" },
    { title: "Burak Kut - Yaşandı Bitti", url: "https://www.youtube.com/watch?v=Fx4ccla8O7Y&list=RDFx4ccla8O7Y&start_radio=1" },
    { title: "MFÖ - Sakın Gelme", url: "https://www.youtube.com/watch?v=IBXWly0Fnhs&list=RDIBXWly0Fnhs&start_radio=1" },
    { title: "Ayna - Yeniden de Sevebiliriz... Akdeniz", url: "https://www.youtube.com/watch?v=eKANhic0mFc&list=RDeKANhic0mFc&start_radio=1" },
    { title: "Özdemir Erdoğan - Aç Kapıyı Gir İçeri", url: "https://www.youtube.com/watch?v=Dfinmno4rlE&list=RDDfinmno4rlE&start_radio=1" },
    { title: "Oya, Bora - Sevme Zamanı", url: "https://www.youtube.com/watch?v=w7LqXb1Qm1U&list=RDw7LqXb1Qm1U&start_radio=1" },
    { title: "Ezginin Günlüğü - Düşler Sokağı", url: "https://www.youtube.com/watch?v=4L1C5FRIdiw&list=RD4L1C5FRIdiw&start_radio=1" },
    { title: "Zeki Müren - Elbet Birgün Buluşacağız", url: "https://www.youtube.com/watch?v=Fg4dtwj7fRM&list=RDFg4dtwj7fRM&start_radio=1" },
    { title: "Füsun Önal - Senden Başka", url: "https://www.youtube.com/watch?v=W-704ks3fmM&list=RDW-704ks3fmM&start_radio=1" },
    { title: "Emel Sayın - Mavi Boncuk", url: "https://www.youtube.com/results?search_query=mavi+boncuk" },
    { title: "Cici Kızlar - Delisin", url: "https://www.youtube.com/watch?v=ZD5_x2ZYopg&list=RDZD5_x2ZYopg&start_radio=1" },
    { title: "Şenay - Sev Kardeşim", url: "https://www.youtube.com/watch?v=B_jgYzkX5kM&list=RDB_jgYzkX5kM&start_radio=1" },
    { title: "Hande Yener - Aşkın Ateşi", url: "https://www.youtube.com/watch?v=iC8pSeoHphI&list=RDiC8pSeoHphI&start_radio=1" },
    { title: "Gülşen - Ne Kavgam Bitti Ne Sevdam", url: "https://www.youtube.com/watch?v=_kBMsB32Fg8&list=RD_kBMsB32Fg8&start_radio=1" },
    { title: "Gülşen - Sarışınım", url: "https://www.youtube.com/watch?v=aiXmGQdXnsE&list=RDaiXmGQdXnsE&start_radio=1" },
    { title: "Gülçin Ergül - Bir Tanecik Aşkım", url: "https://www.youtube.com/watch?v=tUDD7LA_sJQ&list=RDtUDD7LA_sJQ&start_radio=1" },
    { title: "Sezen Aksu - Kaçın Kurası", url: "https://www.youtube.com/watch?v=352QSI4nsQk&list=RD352QSI4nsQk&start_radio=1" },
    { title: "Göksel - Baksana Talihe", url: "https://www.youtube.com/watch?v=-A9cVnlHa9A&list=RD-A9cVnlHa9A&start_radio=1" },
    { title: "Hakan Peker - Karam", url: "https://www.youtube.com/watch?v=F-AVZUpxTtQ&list=RDF-AVZUpxTtQ&start_radio=1" },
    { title: "Yaşar - Birtanem", url: "https://www.youtube.com/watch?v=MRsF_H_6w48&list=RDMRsF_H_6w48&start_radio=1" },
    { title: "Sezen Aksu - Haydi Gel Benimle Ol", url: "https://www.youtube.com/watch?v=qol0bBbcm44&list=RDqol0bBbcm44&start_radio=1" },
    { title: "Reyhan Karaca - Sevdik Sevdalandık", url: "https://www.youtube.com/watch?v=r3m7wsu4FmU&list=RDr3m7wsu4FmU&start_radio=1" },
    { title: "Barış Manço - Gibi Gibi", url: "https://www.youtube.com/watch?v=vqFb0kCvE5o&list=RDvqFb0kCvE5o&start_radio=1" },
    { title: "Erol Evgin, Hande Yener - Sevdan Olmasa", url: "https://www.youtube.com/watch?v=XHTsd0OihWA&list=RDXHTsd0OihWA&start_radio=1" },
    { title: "Barış Manço - Kara Sevda", url: "https://www.youtube.com/watch?v=jxi17F3z0Xw&list=RDjxi17F3z0Xw&start_radio=1" },
    { title: "Sıla - Kafa", url: "https://www.youtube.com/watch?v=2NSOvjbCbDk&list=RD2NSOvjbCbDk&start_radio=1" },
    { title: "Serdar Ortaç - Ben Adam Olmam", url: "https://www.youtube.com/watch?v=IxBEG2JRm3I&list=RDIxBEG2JRm3I&start_radio=1" },
    { title: "Sezen Aksu - İkili Delilik", url: "https://www.youtube.com/watch?v=_uxJw_azXaI&list=RD_uxJw_azXaI&start_radio=1" },
    { title: "Duman - Bal", url: "https://www.youtube.com/watch?v=NUXbWSsMLSI&list=RDNUXbWSsMLSI&start_radio=1" },
    { title: "Halit Bilgiç - Özledim Seni", url: "https://www.youtube.com/watch?v=sJxOk5nqhDo&list=RDsJxOk5nqhDo&start_radio=1" },
    { title: "Ayla Dikmen - İlk ve Son Aşkım Sen Olacaksın", url: "https://www.youtube.com/watch?v=LCg7daZtE9s&list=RDLCg7daZtE9s&start_radio=1" },
    { title: "Sezen Aksu - Ben Her Bahar Aşık Olurum", url: "https://www.youtube.com/watch?v=vS0oVjcxC_o&list=RDvS0oVjcxC_o&start_radio=1" }
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
