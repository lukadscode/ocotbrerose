import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Nettoyer les données existantes
  await prisma.otpCode.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.rowingCareCupRegistration.deleteMany();
  await prisma.kilometerEntry.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.event.deleteMany();
  await prisma.club.deleteMany();
  await prisma.admin.deleteMany();

  // Créer l'admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@octobrerose2025.fr',
      password: hashedPassword,
      name: 'Administrateur Principal',
      role: 'SUPER_ADMIN'
    }
  });
  console.log('✅ Admin créé:', admin.email);

  // Créer les clubs
  const clubs = await Promise.all([
    prisma.club.create({
      data: {
        name: 'Club Nautique de Paris',
        city: 'Paris',
        country: 'France',
        totalKm: 1250.5,
        memberCount: 45
      }
    }),
    prisma.club.create({
      data: {
        name: 'Aviron Bayonnais',
        city: 'Bayonne',
        country: 'France',
        totalKm: 890.2,
        memberCount: 32
      }
    }),
    prisma.club.create({
      data: {
        name: 'Rowing Club Amsterdam',
        city: 'Amsterdam',
        country: 'Pays-Bas',
        totalKm: 2100.8,
        memberCount: 67
      }
    }),
    prisma.club.create({
      data: {
        name: 'Berlin Ruder Club',
        city: 'Berlin',
        country: 'Allemagne',
        totalKm: 1650.3,
        memberCount: 54
      }
    }),
    prisma.club.create({
      data: {
        name: 'Roma Canottieri',
        city: 'Rome',
        country: 'Italie',
        totalKm: 980.7,
        memberCount: 38
      }
    })
  ]);
  console.log('✅ Clubs créés:', clubs.length);

  // Créer les participants
  const participants = await Promise.all([
    prisma.participant.create({
      data: {
        firstName: 'Marie',
        lastName: 'Dupont',
        email: 'marie.dupont@email.com',
        club: 'Club Nautique de Paris'
      }
    }),
    prisma.participant.create({
      data: {
        firstName: 'Pierre',
        lastName: 'Martin',
        email: 'pierre.martin@email.com',
        club: 'Club Nautique de Paris'
      }
    }),
    prisma.participant.create({
      data: {
        firstName: 'Sophie',
        lastName: 'Bernard',
        email: 'sophie.bernard@email.com',
        club: 'Aviron Bayonnais'
      }
    }),
    prisma.participant.create({
      data: {
        firstName: 'Lucas',
        lastName: 'Moreau',
        email: 'lucas.moreau@email.com',
        club: 'Rowing Club Amsterdam'
      }
    }),
    prisma.participant.create({
      data: {
        firstName: 'Emma',
        lastName: 'Leroy',
        email: 'emma.leroy@email.com',
        club: 'Berlin Ruder Club'
      }
    }),
    prisma.participant.create({
      data: {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@test.com',
        club: 'Club Nautique de Paris'
      }
    })
  ]);
  console.log('✅ Participants créés:', participants.length);

  // Créer les entrées de kilomètres
  const kilometerEntries = [];
  for (let i = 0; i < 50; i++) {
    const participant = participants[Math.floor(Math.random() * participants.length)];
    const activityTypes = ['INDOOR', 'OUTDOOR', 'AVIFIT'];
    const participationTypes = ['INDIVIDUAL', 'COLLECTIVE'];
    
    const entry = await prisma.kilometerEntry.create({
      data: {
        participantId: participant.id,
        date: new Date(2025, 9, Math.floor(Math.random() * 31) + 1), // Octobre 2025
        activityType: activityTypes[Math.floor(Math.random() * activityTypes.length)],
        kilometers: Math.round((Math.random() * 15 + 1) * 10) / 10, // 1-15 km
        duration: `${Math.floor(Math.random() * 60) + 30} min`,
        location: participant.club,
        participationType: participationTypes[Math.floor(Math.random() * participationTypes.length)],
        participantCount: Math.floor(Math.random() * 4) + 1,
        description: `Séance d'entraînement ${i + 1}`,
        validated: true
      }
    });
    kilometerEntries.push(entry);
  }
  console.log('✅ Entrées kilomètres créées:', kilometerEntries.length);

  // Créer les événements
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: '#TOUSconcernés',
        description: 'Mobilisation hebdomadaire de sensibilisation avec des actions spécifiques dans chaque club.',
        dateStart: new Date('2025-10-01'),
        dateEnd: new Date('2025-10-29'),
        timeInfo: 'Tous les mercredis',
        eventType: 'recurring',
        color: 'from-pink-500 to-rose-500',
        activities: JSON.stringify(['Porter du rose pendant l\'entraînement', 'Partager ses séances sur les réseaux sociaux']),
        status: 'ACTIVE'
      }
    }),
    prisma.event.create({
      data: {
        title: 'Tous en rose au sommet',
        description: 'Week-end de lancement officiel avec des événements dans toute l\'Europe.',
        dateStart: new Date('2025-10-04'),
        dateEnd: new Date('2025-10-05'),
        timeInfo: 'Samedi 9h - Dimanche 18h',
        eventType: 'weekend',
        color: 'from-rose-500 to-pink-600',
        activities: JSON.stringify(['Séances collectives en rose', 'Petit-déjeuner solidaire']),
        status: 'COMPLETED'
      }
    }),
    prisma.event.create({
      data: {
        title: 'Rowing Care Cup',
        description: 'Événement connecté national avec courses individuelles et relais.',
        dateStart: new Date('2025-10-18'),
        timeInfo: 'Toute la journée',
        eventType: 'special',
        color: 'from-blue-600 to-indigo-600',
        activities: JSON.stringify(['Courses individuelles 250m/500m', 'Relais d\'équipe']),
        status: 'FEATURED'
      }
    }),
    prisma.event.create({
      data: {
        title: 'Célébration des Amazones',
        description: 'Semaine dédiée aux témoignages et à l\'hommage aux femmes courageuses.',
        dateStart: new Date('2025-10-13'),
        dateEnd: new Date('2025-10-19'),
        timeInfo: '7 jours d\'hommage',
        eventType: 'week',
        color: 'from-pink-600 to-rose-600',
        activities: JSON.stringify(['Témoignages de femmes courageuses', 'Séances dédiées aux Amazones']),
        status: 'UPCOMING'
      }
    }),
    prisma.event.create({
      data: {
        title: 'Mission Veni-Vidi-Vinci',
        description: 'Sprint final avec des défis quotidiens pour booster la progression.',
        dateStart: new Date('2025-10-20'),
        dateEnd: new Date('2025-10-24'),
        timeInfo: '5 jours intensifs',
        eventType: 'challenge',
        color: 'from-rose-600 to-pink-700',
        activities: JSON.stringify(['Défis quotidiens par équipe', 'Bonus kilomètres']),
        status: 'UPCOMING'
      }
    }),
    prisma.event.create({
      data: {
        title: 'City break & Bonus 27',
        description: 'Week-end urbain avec des événements dans les grandes villes européennes.',
        dateStart: new Date('2025-10-24'),
        dateEnd: new Date('2025-10-31'),
        timeInfo: '8 jours de clôture',
        eventType: 'finale',
        color: 'from-pink-700 to-rose-800',
        activities: JSON.stringify(['Événements dans les capitales', 'Bonus kilomètres x2']),
        status: 'UPCOMING'
      }
    })
  ]);
  console.log('✅ Événements créés:', events.length);

  // Créer quelques inscriptions Rowing Care Cup
  const rowingCareCupRegs = await Promise.all([
    prisma.rowingCareCupRegistration.create({
      data: {
        participantId: participants[0].id,
        category: 'individual',
        distance: '500m',
        gender: 'Femmes',
        price: 5.0,
        paid: true
      }
    }),
    prisma.rowingCareCupRegistration.create({
      data: {
        participantId: participants[1].id,
        category: 'team',
        distance: '4x500m',
        teamType: 'Relais Mixte',
        price: 15.0,
        paid: true
      }
    }),
    prisma.rowingCareCupRegistration.create({
      data: {
        participantId: participants[2].id,
        category: 'individual',
        distance: '250m',
        gender: 'Femmes',
        price: 5.0,
        paid: false
      }
    })
  ]);
  console.log('✅ Inscriptions Rowing Care Cup créées:', rowingCareCupRegs.length);

  // Créer quelques photos approuvées
  const photos = await Promise.all([
    prisma.photo.create({
      data: {
        participantId: participants[0].id,
        url: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg',
        caption: 'Séance d\'aviron motivante ! #OctobreRose2025',
        approved: true
      }
    }),
    prisma.photo.create({
      data: {
        participantId: participants[1].id,
        url: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
        caption: 'En rose pour la bonne cause !',
        approved: true
      }
    }),
    prisma.photo.create({
      data: {
        participantId: participants[2].id,
        url: 'https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg',
        caption: 'Équipe solidaire au complet',
        approved: false
      }
    })
  ]);
  console.log('✅ Photos créées:', photos.length);

  console.log('🎉 Seeding terminé avec succès !');
  console.log('');
  console.log('📊 Résumé des données créées :');
  console.log(`- ${clubs.length} clubs`);
  console.log(`- ${participants.length} participants`);
  console.log(`- ${kilometerEntries.length} entrées de kilomètres`);
  console.log(`- ${events.length} événements`);
  console.log(`- ${rowingCareCupRegs.length} inscriptions Rowing Care Cup`);
  console.log(`- ${photos.length} photos`);
  console.log(`- 1 admin`);
  console.log('');
  console.log('🔑 Comptes de test :');
  console.log('Admin: admin@octobrerose2025.fr / admin123');
  console.log('Participant: demo@test.com (OTP: 123456)');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });