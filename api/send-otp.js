const https = require("https");
const querystring = require("querystring");

export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Permettre uniquement les requêtes POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, otpCode } = req.body;

    // Validation des données
    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        error: "Email et code OTP requis",
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Format d'email invalide",
      });
    }

    // Validation du code OTP (6 chiffres)
    if (!/^\d{6}$/.test(otpCode)) {
      return res.status(400).json({
        success: false,
        error: "Code OTP invalide (6 chiffres requis)",
      });
    }

    // Template HTML simple
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Code d'accès - Octobre Rose 2025</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; line-height: 1.6;">
        <div class="container" style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);">
          
          <!-- Header avec branding FFAviron -->
          <div style="background: linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #be185d 100%); padding: 40px 20px; text-align: center;">
            <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.15); border-radius: 50%; margin: 0 auto 20px;">
              <span style="color: white; font-size: 32px; font-weight: bold;">🎀</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Octobre Rose 2025</h1>
            <p style="color: rgba(255,255,255,0.95); margin: 10px 0 0; font-size: 18px; font-weight: 500;">x Fédération Française d'Aviron</p>
          </div>

          <!-- Contenu principal -->
          <div style="padding: 50px 30px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h2 style="color: #1f2937; margin: 0 0 15px; font-size: 28px; font-weight: 600;">Votre code d'accès</h2>
              <p style="color: #6b7280; font-size: 16px; margin: 0; max-width: 400px; margin: 0 auto;">
                Utilisez ce code pour accéder à votre espace participant sécurisé
              </p>
            </div>

            <!-- Code OTP avec design premium -->
            <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border: 3px solid #ec4899; border-radius: 16px; padding: 40px 20px; text-align: center; margin: 40px 0; position: relative; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.15);">
              <div style="font-size: 42px; font-weight: 800; color: #be185d; letter-spacing: 12px; font-family: 'Courier New', monospace; margin-bottom: 15px;">
                ${otpCode}
              </div>
              <div style="display: flex; align-items: center; justify-content: center; gap: 8px; color: #be185d; font-size: 14px; font-weight: 600;">
                <span style="font-size: 16px;">⏰</span>
                <span>Code valable 10 minutes</span>
              </div>
            </div>

            <!-- Instructions -->
            <div style="background: #f1f5f9; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #1e40af; margin: 0 0 10px; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                <span>🔐</span> Instructions de sécurité
              </h3>
              <ul style="color: #475569; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li>Ce code est personnel et confidentiel</li>
                <li>Ne le partagez avec personne</li>
                <li>Il expire automatiquement dans 10 minutes</li>
                <li>En cas de problème, demandez un nouveau code</li>
              </ul>
            </div>

            <!-- Support -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 10px;">
                Vous n'avez pas demandé ce code ? Ignorez cet email.
              </p>
              <p style="color: #64748b; font-size: 13px; margin: 0;">
                <strong>Support :</strong> contact@ffaviron.fr
              </p>
            </div>
          </div>

          <!-- Footer professionnel -->
          <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 30px 20px; text-align: center;">
            <div style="margin-bottom: 15px;">
              <span style="color: #f9fafb; font-size: 16px; font-weight: 600;">Fédération Française d'Aviron</span>
            </div>
            <div style="color: #9ca3af; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 5px;">17 Boulevard Morland, 75004 Paris</p>
              <p style="margin: 0 0 15px;">© 2025 FFAviron - Octobre Rose. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Appel à l'API Resend via fetch
    const resendData = {
      from: "Octobre Rose 2025 <onboarding@resend.dev>",
      to: [email],
      subject: "🎀 Votre code d'accès - Octobre Rose 2025",
      html: htmlTemplate,
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resendData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Erreur Resend:", result);
      return res.status(500).json({
        success: false,
        error: "Erreur lors de l'envoi de l'email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email envoyé avec succès",
      id: data.id,
    });

    console.log("✅ Email OTP envoyé avec succès:", result);
  } catch (error) {
    console.error("❌ Erreur serveur:", error);
    return res.status(500).json({
      success: false,
      error: "Erreur interne du serveur",
    });
  }
}
