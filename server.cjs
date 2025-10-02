const express = require("express");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3003;
const prisma = new PrismaClient();

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

// ============ PARTICIPANTS API ============

app.post("/api/participants", async (req, res) => {
  try {
    const { firstName, lastName, email, club } = req.body;

    // Vérifier si le participant existe déjà
    const existing = await prisma.participant.findUnique({
      where: { email }
    });

    if (existing) {
      return res.json(existing);
    }

    const participant = await prisma.participant.create({
      data: { firstName, lastName, email, club }
    });

    res.json(participant);
  } catch (error) {
    console.error("Error creating participant:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/participants", async (req, res) => {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/participants/stats", async (req, res) => {
  try {
    const totalParticipants = await prisma.participant.count();
    const totalKilometers = await prisma.kilometerEntry.aggregate({
      _sum: { kilometers: true },
      where: { validated: true }
    });
    const totalClubs = await prisma.club.count();

    res.json({
      totalParticipants,
      totalKilometers: totalKilometers._sum.kilometers || 0,
      totalClubs
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============ KILOMETERS API ============

app.post("/api/kilometers", async (req, res) => {
  try {
    const {
      participantId,
      date,
      activityType,
      kilometers,
      duration,
      location,
      participationType,
      participantCount,
      description,
      photoUrl
    } = req.body;

    const entry = await prisma.kilometerEntry.create({
      data: {
        participantId,
        date: new Date(date),
        activityType,
        kilometers: parseFloat(kilometers),
        duration,
        location,
        participationType,
        participantCount: parseInt(participantCount),
        description,
        photoUrl,
        validated: false
      },
      include: {
        participant: true
      }
    });

    if (location) {
      await prisma.club.updateMany({
        where: { name: location },
        data: {
          totalKm: {
            increment: parseFloat(kilometers)
          }
        }
      });
    }

    res.json(entry);
  } catch (error) {
    console.error("Error creating kilometer entry:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/defi-rose/submit", async (req, res) => {
  try {
    const {
      typeParticipant,
      firstName,
      lastName,
      email,
      structureName,
      structureEmail,
      pays,
      kilometers,
      date,
      activityType,
      duration,
      location,
      description,
      participantCount,
      photoUrl
    } = req.body;

    const finalEmail = typeParticipant === 'individual' ? email : structureEmail;
    const finalFirstName = typeParticipant === 'individual' ? firstName : structureName;
    const finalLastName = typeParticipant === 'individual' ? lastName : '';

    let participant = await prisma.participant.findUnique({
      where: { email: finalEmail }
    });

    if (!participant) {
      participant = await prisma.participant.create({
        data: {
          firstName: finalFirstName,
          lastName: finalLastName,
          email: finalEmail,
          participantType: typeParticipant === 'structure' ? 'CLUB' : 'INDIVIDUAL',
          organizationName: typeParticipant === 'structure' ? structureName : null,
          city: pays || null
        }
      });
    }

    const entry = await prisma.kilometerEntry.create({
      data: {
        participantId: participant.id,
        date: new Date(date),
        activityType: activityType ? activityType.toUpperCase() : 'INDOOR',
        kilometers: parseFloat(kilometers),
        duration: duration || null,
        location: location || pays || null,
        participationType: typeParticipant === 'structure' ? 'COLLECTIVE' : 'INDIVIDUAL',
        participantCount: typeParticipant === 'structure' ? parseInt(participantCount) || 1 : 1,
        description: description || null,
        photoUrl: photoUrl || null,
        validated: false
      },
      include: {
        participant: true
      }
    });

    res.json({
      success: true,
      entry,
      participant
    });
  } catch (error) {
    console.error("Error submitting Défi Rose entry:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get("/api/kilometers", async (req, res) => {
  try {
    const entries = await prisma.kilometerEntry.findMany({
      include: { participant: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(entries);
  } catch (error) {
    console.error("Error fetching kilometers:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/kilometers/validated", async (req, res) => {
  try {
    const entries = await prisma.kilometerEntry.findMany({
      where: { validated: true },
      include: { participant: true },
      orderBy: { date: "desc" }
    });
    res.json(entries);
  } catch (error) {
    console.error("Error fetching validated kilometers:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/kilometers/participant/:participantId", async (req, res) => {
  try {
    const { participantId } = req.params;
    const entries = await prisma.kilometerEntry.findMany({
      where: { participantId },
      include: { participant: true },
      orderBy: { date: "desc" }
    });
    res.json(entries);
  } catch (error) {
    console.error("Error fetching participant kilometers:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============ EVENTS API ============

app.get("/api/events", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { dateStart: "desc" }
    });
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const event = await prisma.event.create({
      data: req.body
    });
    res.json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============ CLUBS API ============

app.get("/api/clubs", async (req, res) => {
  try {
    const clubs = await prisma.club.findMany({
      orderBy: { totalKm: "desc" }
    });
    res.json(clubs);
  } catch (error) {
    console.error("Error fetching clubs:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============ PHOTOS API ============

app.get("/api/photos", async (req, res) => {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/photos/approved", async (req, res) => {
  try {
    const photos = await prisma.photo.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(photos);
  } catch (error) {
    console.error("Error fetching approved photos:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/photos", async (req, res) => {
  try {
    const { participantId, url, caption } = req.body;
    const photo = await prisma.photo.create({
      data: {
        participantId,
        url,
        caption,
        approved: false
      }
    });
    res.json(photo);
  } catch (error) {
    console.error("Error creating photo:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============ ROWING CARE CUP API ============

app.post("/api/rowing-care-cup", async (req, res) => {
  try {
    const registration = await prisma.rowingCareCupRegistration.create({
      data: req.body
    });
    res.json(registration);
  } catch (error) {
    console.error("Error creating registration:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/rowing-care-cup/stats", async (req, res) => {
  try {
    const total = await prisma.rowingCareCupRegistration.count();
    const totalAmount = await prisma.rowingCareCupRegistration.aggregate({
      _sum: { price: true },
      where: { paid: true }
    });

    res.json({
      total,
      totalRegistrations: total,
      totalAmount: totalAmount._sum.price || 0
    });
  } catch (error) {
    console.error("Error fetching rowing stats:", error);
    res.status(500).json({ error: error.message });
  }
});

// ============ ADMIN API ============

app.get("/api/admin/stats", async (req, res) => {
  try {
    const [
      totalParticipants,
      totalKilometers,
      totalClubs,
      totalEvents,
      pendingPhotos,
      pendingEntries,
      rowingRegistrations
    ] = await Promise.all([
      prisma.participant.count(),
      prisma.kilometerEntry.aggregate({
        _sum: { kilometers: true },
        where: { validated: true }
      }),
      prisma.club.count(),
      prisma.event.count(),
      prisma.photo.count({ where: { approved: false } }),
      prisma.kilometerEntry.count({ where: { validated: false } }),
      prisma.rowingCareCupRegistration.count()
    ]);

    res.json({
      totalParticipants,
      totalKilometers: totalKilometers._sum.kilometers || 0,
      totalClubs,
      totalEvents,
      pendingPhotos,
      pendingEntries,
      rowingRegistrations
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("Error admin login:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ OTP API ============

app.post("/api/otp/send", async (req, res) => {
  try {
    const { email } = req.body;

    // Générer un code OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Supprimer les anciens codes
    await prisma.otpCode.deleteMany({
      where: { email }
    });

    // Créer le nouveau code
    await prisma.otpCode.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      }
    });

    console.log(`OTP pour ${email}: ${code}`);

    res.json({ success: true, message: "OTP envoyé" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/otp/verify", async (req, res) => {
  try {
    const { email, code } = req.body;

    const otpCode = await prisma.otpCode.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!otpCode) {
      return res.status(401).json({
        success: false,
        message: "Code invalide ou expiré"
      });
    }

    // Marquer comme utilisé
    await prisma.otpCode.update({
      where: { id: otpCode.id },
      data: { used: true }
    });

    // Trouver ou créer le participant
    let participant = await prisma.participant.findUnique({
      where: { email }
    });

    if (!participant) {
      participant = await prisma.participant.create({
        data: {
          firstName: email.split("@")[0],
          lastName: "Participant",
          email
        }
      });
    }

    res.json({
      success: true,
      participant
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ EMAIL OTP (Resend) ============

app.post("/api/send-otp", async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        error: "Email et code OTP requis"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Format d'email invalide"
      });
    }

    if (!/^\d{6}$/.test(otpCode)) {
      return res.status(400).json({
        success: false,
        error: "Code OTP invalide (6 chiffres requis)"
      });
    }

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
          <div style="background: linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #be185d 100%); padding: 40px 20px; text-align: center;">
            <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.15); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 32px;">🎀</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Octobre Rose 2025</h1>
            <p style="color: rgba(255,255,255,0.95); margin: 10px 0 0; font-size: 18px;">x Fédération Française d'Aviron</p>
          </div>
          <div style="padding: 50px 30px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h2 style="color: #1f2937; margin: 0 0 15px; font-size: 28px;">Votre code d'accès</h2>
              <p style="color: #6b7280; font-size: 16px; margin: 0;">
                Utilisez ce code pour accéder à votre espace participant
              </p>
            </div>
            <div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border: 3px solid #ec4899; border-radius: 16px; padding: 40px 20px; text-align: center; margin: 40px 0;">
              <div style="font-size: 42px; font-weight: 800; color: #be185d; letter-spacing: 12px; font-family: 'Courier New', monospace; margin-bottom: 15px;">
                ${otpCode}
              </div>
              <div style="color: #be185d; font-size: 14px; font-weight: 600;">
                ⏰ Code valable 10 minutes
              </div>
            </div>
          </div>
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

    if (process.env.RESEND_API_KEY) {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Octobre Rose 2025 <onboarding@resend.dev>",
          to: [email],
          subject: "🎀 Votre code d'accès - Octobre Rose 2025",
          html: htmlTemplate
        })
      });

      const resendResult = await resendResponse.json();

      if (!resendResponse.ok) {
        console.error("❌ Erreur Resend:", resendResult);
        return res.status(500).json({
          success: false,
          error: "Erreur lors de l'envoi de l'email"
        });
      }

      console.log("✅ Email OTP envoyé avec succès:", resendResult);
    } else {
      console.log("✅ OTP (mode dev):", otpCode);
    }

    return res.status(200).json({
      success: true,
      message: "Email envoyé avec succès"
    });
  } catch (error) {
    console.error("❌ Erreur serveur:", error);
    return res.status(500).json({
      success: false,
      error: "Erreur interne du serveur"
    });
  }
});

// Servir les fichiers statiques React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 API disponible sur http://localhost:${PORT}/api`);
});

// Gestion propre de la fermeture
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
