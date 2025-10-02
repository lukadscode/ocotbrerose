const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(express.static("dist"));

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// API Route - Endpoint pour envoyer OTP
app.post("/api/send-otp", async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    // Validation
    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        error: "Email et code OTP requis",
      });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Format d'email invalide",
      });
    }

    // Validation OTP (6 chiffres)
    if (!/^\d{6}$/.test(otpCode)) {
      return res.status(400).json({
        success: false,
        error: "Code OTP invalide (6 chiffres requis)",
      });
    }

    // Template HTML
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Code d'accès - Octobre Rose 2025</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #be185d 100%); padding: 40px 20px; text-align: center;">
            <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.15); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 32px;">🎀</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Octobre Rose 2025</h1>
            <p style="color: rgba(255,255,255,0.95); margin: 10px 0 0; font-size: 18px;">x Fédération Française d'Aviron</p>
          </div>

          <!-- Contenu -->
          <div style="padding: 50px 30px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h2 style="color: #1f2937; margin: 0 0 15px; font-size: 28px;">Votre code d'accès</h2>
              <p style="color: #6b7280; font-size: 16px; margin: 0;">
                Utilisez ce code pour accéder à votre espace participant
              </p>
            </div>

            <!-- Code OTP -->
            <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border: 3px solid #ec4899; border-radius: 16px; padding: 40px 20px; text-align: center; margin: 40px 0;">
              <div style="font-size: 42px; font-weight: 800; color: #be185d; letter-spacing: 12px; font-family: 'Courier New', monospace; margin-bottom: 15px;">
                ${otpCode}
              </div>
              <div style="color: #be185d; font-size: 14px; font-weight: 600;">
                ⏰ Code valable 10 minutes
              </div>
            </div>

            <!-- Instructions -->
            <div style="background: #f1f5f9; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #1e40af; margin: 0 0 10px; font-size: 16px;">🔐 Instructions</h3>
              <ul style="color: #475569; font-size: 14px; margin: 0; padding-left: 20px;">
                <li>Ce code est personnel et confidentiel</li>
                <li>Ne le partagez avec personne</li>
                <li>Il expire dans 10 minutes</li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #1f2937; padding: 30px 20px; text-align: center;">
            <div style="color: #f9fafb; font-size: 16px; font-weight: 600; margin-bottom: 15px;">
              Fédération Française d'Aviron
            </div>
            <div style="color: #9ca3af; font-size: 12px;">
              <p style="margin: 0;">© 2025 FFAviron - Octobre Rose</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Appel à Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Octobre Rose 2025 <onboarding@resend.dev>",
        to: [email],
        subject: "🎀 Votre code d'accès - Octobre Rose 2025",
        html: htmlTemplate,
      }),
    });

    const resendResult = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("❌ Erreur Resend:", resendResult);
      return res.status(500).json({
        success: false,
        error: "Erreur lors de l'envoi de l'email",
      });
    }

    console.log("✅ Email OTP envoyé avec succès:", resendResult);

    return res.status(200).json({
      success: true,
      message: "Email envoyé avec succès",
      id: resendResult.id,
    });
  } catch (error) {
    console.error("❌ Erreur serveur:", error);
    return res.status(500).json({
      success: false,
      error: "Erreur interne du serveur",
    });
  }
});

// Servir les fichiers statiques React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📧 API disponible sur http://localhost:${PORT}/api/send-otp`);
});
