import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traductions françaises
const fr = {
  translation: {
    // Navigation
    nav: {
      home: "Accueil",
      challenge: "Le Défi ROSE",
      rowingCareCup: "Rowing Care Cup",
      participantSpace: "Espace Participant",
      admin: "Admin"
    },
    
    // Page d'accueil
    home: {
      title: "Octobre Rose 2025",
      subtitle: "x FFAviron",
      description: "{{distance}} km pour relier les capitales de l'Union Européenne et lutter ensemble contre le cancer du sein !",
      participateBtn: "Participer au Défi",
      rowingCareCupBtn: "Rowing Care Cup",
      followRibbon: "Suivez le Ruban Rose à travers l'Europe",
      followDescription: "Découvrez en temps réel l'avancement du défi sur notre carte interactive. Chaque kilomètre parcouru nous rapproche de notre objectif !",
      calendar: "Calendrier des Animations",
      calendarDescription: "Découvrez les temps forts d'Octobre Rose 2025",
      readyToMakeDifference: "Prêt à faire la différence ?",
      readyDescription: "Chaque kilomètre compte, chaque geste compte. Rejoignez des milliers de participants dans cette aventure solidaire exceptionnelle.",
      createSpace: "Créer mon espace",
      donate: "Faire un don"
    },
    
    // Statistiques
    stats: {
      progression: "Progression du Défi",
      accomplished: "{{percent}}% accompli",
      kilometersCompleted: "Kilomètres parcourus",
      participants: "Participants",
      clubs: "Clubs participants",
      fundsRaised: "Fonds récoltés",
      inProgress: "En progression",
      registered: "Inscrits",
      active: "Actifs",
      objective: "Objectif: {{amount}}€",
      remaining: "Plus que {{km}} km pour atteindre notre objectif !",
      together: "Ensemble, nous pouvons faire la différence dans la lutte contre le cancer du sein.",
      startNow: "Le défi commence maintenant. Chaque kilomètre compte dans cette aventure solidaire."
    },
    
    // Défi Rose
    challenge: {
      title: "Le Défi ROSE",
      description: "Du 1er au 31 octobre 2025, participez à cette aventure européenne exceptionnelle",
      participate: "Participer au Défi",
      addKm: "Ajouter mes km",
      concept: "Le Concept",
      conceptItems: {
        distance: {
          title: "{{distance}} kilomètres à parcourir",
          description: "Distance symbolique reliant toutes les capitales de l'Union Européenne, représentant l'union dans la lutte contre le cancer du sein."
        },
        participation: {
          title: "Participation collective",
          description: "Clubs, individuels, familles... Chacun peut contribuer avec ses kilomètres d'aviron indoor, outdoor ou AviFit."
        },
        tracking: {
          title: "Suivi en temps réel",
          description: "Visualisez l'avancement du ruban rose sur la carte interactive et suivez la progression vers l'objectif commun."
        }
      },
      objective2025: "Objectif 2025",
      toComplete: "À parcourir ensemble du 1er au 31 octobre",
      capitals: "Capitales",
      days: "Jours",
      animationsCalendar: "Calendrier des Animations",
      animationsDescription: "Des événements spéciaux tout au long du mois d'octobre",
      gallery: "Galerie des Participants",
      galleryDescription: "Découvrez les moments forts partagés par nos participants",
      sharePhoto: "Partager ma photo",
      joinAdventure: "Rejoignez l'aventure !",
      joinDescription: "Chaque kilomètre compte dans cette belle aventure solidaire. Inscrivez-vous dès maintenant et contribuez à cette cause exceptionnelle.",
      participateNow: "Participer maintenant",
      registerClub: "Inscrire mon club"
    },
    
    // Rowing Care Cup
    rowingCareCup: {
      title: "Rowing Care Cup",
      subtitle: "Événement connecté national - Samedi 18 octobre 2025",
      date: "18 octobre 2025",
      allDay: "Toute la journée",
      connected: "100% connecté",
      registered: "Inscrits",
      collected: "Collectés",
      registerNow: "Je m'inscris maintenant",
      concept: "Le Challenge Indoor Connecté",
      conceptItems: {
        flexible: {
          title: "Participation flexible",
          description: "Participez depuis votre club, chez votre kinésithérapeute, ou même depuis chez vous avec votre ergomètre."
        },
        technology: {
          title: "Technologie Time Team",
          description: "Système de chronométrage connecté pour une compétition équitable et des résultats en temps réel."
        },
        rankings: {
          title: "Classements en direct",
          description: "Suivez les performances en temps réel et découvrez les résultats individuels et par équipe instantanément."
        }
      },
      solidaryPrices: "Tarifs Solidaires",
      individual: "Individuel",
      team: "Équipe",
      partReversed: "Une partie des inscriptions est reversée à la Ligue contre le cancer",
      categories: "Catégories de Course",
      categoriesDescription: "Choisissez votre défi et participez à cette aventure solidaire",
      individualRaces: "Courses Individuelles",
      teamRelays: "Relais d'Équipe",
      register: "S'inscrire",
      participationMethods: "Modalités de Participation",
      whereParticipate: "Où participer ?",
      howItWorks: "Comment ça marche ?",
      rewards: "Récompenses",
      liveRanking: "Classement en Direct",
      liveDescription: "Suivez les performances en temps réel le jour J",
      liveDate: "LIVE le 18 octobre",
      topIndividual: "Top Individuel",
      topTeams: "Top Équipes",
      availableOnDay: "Disponible le jour J",
      readyForChallenge: "Prêt pour le défi ?",
      readyDescription: "Inscrivez-vous dès maintenant à la Rowing Care Cup et participez à cet événement solidaire exceptionnel le 18 octobre 2025.",
      teamRegistration: "Inscription équipe"
    },
    
    // Espace participant
    participant: {
      title: "Espace Participant",
      subtitle: "Accédez à votre espace personnel sécurisé",
      email: "Adresse email",
      receiveCode: "Recevoir le code d'accès",
      sending: "Envoi...",
      codeSent: "Un code d'accès a été envoyé à",
      accessCode: "Code d'accès (6 chiffres)",
      connect: "Se connecter",
      connecting: "Connexion...",
      changeEmail: "← Changer d'adresse email",
      disconnect: "Se déconnecter",
      quickActions: "Actions rapides",
      addKm: "Ajouter des km",
      recordSession: "Enregistrer une séance",
      registerEvent: "S'inscrire à l'événement",
      recentActivities: "Mes dernières activités",
      noActivity: "Aucune activité enregistrée",
      addFirstKm: "Ajoutez vos premiers kilomètres !",
      myStats: "Mes statistiques",
      kmCompleted: "km parcourus",
      sessions: "Séances",
      ranking: "Classement",
      myClub: "Mon club",
      activeMember: "Participant actif",
      memberSince: "Membre depuis {{date}}",
      upcoming: "À venir",
      indoor: "Aviron indoor",
      outdoor: "Aviron bateau"
    },
    
    // Administration
    admin: {
      title: "Administration",
      subtitle: "Accès réservé aux administrateurs",
      email: "Adresse email",
      password: "Mot de passe",
      login: "Se connecter",
      connecting: "Connexion...",
      incorrectCredentials: "Email ou mot de passe incorrect"
    },
    
    // Formulaires
    forms: {
      required: "requis",
      optional: "optionnel",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      phone: "Téléphone",
      club: "Club / Structure",
      date: "Date",
      distance: "Distance (km)",
      duration: "Durée",
      location: "Lieu",
      description: "Description",
      photo: "Photo",
      cancel: "Annuler",
      save: "Enregistrer",
      submit: "Valider",
      close: "Fermer",
      add: "Ajouter",
      remove: "Supprimer",
      edit: "Modifier",
      delete: "Supprimer",
      confirm: "Confirmer",
      loading: "Chargement...",
      saving: "Enregistrement...",
      success: "Succès !",
      error: "Erreur",
      tryAgain: "Réessayer"
    },
    
    // Défi Rose
    challenge: {
      title: "Le Défi ROSE",
      description: "Du 1er au 31 octobre 2025, participez à cette aventure européenne exceptionnelle",
      participate: "Participer au Défi",
      addKm: "Ajouter mes km",
      concept: "Le Concept",
      conceptItems: {
        distance: {
          title: "{{distance}} kilomètres à parcourir",
          description: "Distance symbolique reliant toutes les capitales de l'Union Européenne, représentant l'union dans la lutte contre le cancer du sein."
        },
        participation: {
          title: "Participation collective",
          description: "Clubs, individuels, familles... Chacun peut contribuer avec ses kilomètres d'aviron indoor, outdoor ou AviFit."
        },
        tracking: {
          title: "Suivi en temps réel",
          description: "Visualisez l'avancement du ruban rose sur la carte interactive et suivez la progression vers l'objectif commun."
        }
      },
      objective2025: "Objectif 2025",
      toComplete: "À parcourir ensemble du 1er au 31 octobre",
      capitals: "Capitales",
      days: "Jours",
      animationsCalendar: "Calendrier des Animations",
      animationsDescription: "Des événements spéciaux tout au long du mois d'octobre",
      gallery: "Galerie des Participants",
      galleryDescription: "Découvrez les moments forts partagés par nos participants",
      sharePhoto: "Partager ma photo",
      joinAdventure: "Rejoignez l'aventure !",
      joinDescription: "Chaque kilomètre compte dans cette belle aventure solidaire. Inscrivez-vous dès maintenant et contribuez à cette cause exceptionnelle.",
      participateNow: "Participer maintenant",
      registerClub: "Inscrire mon club"
    },
    
    // Rowing Care Cup
    rowingCareCup: {
      title: "Rowing Care Cup",
      subtitle: "Événement connecté national - Samedi 18 octobre 2025",
      date: "18 octobre 2025",
      allDay: "Toute la journée",
      connected: "100% connecté",
      registered: "Inscrits",
      collected: "Collectés",
      registerNow: "Je m'inscris maintenant",
      concept: "Le Challenge Indoor Connecté",
      conceptItems: {
        flexible: {
          title: "Participation flexible",
          description: "Participez depuis votre club, chez votre kinésithérapeute, ou même depuis chez vous avec votre ergomètre."
        },
        technology: {
          title: "Technologie Time Team",
          description: "Système de chronométrage connecté pour une compétition équitable et des résultats en temps réel."
        },
        rankings: {
          title: "Classements en direct",
          description: "Suivez les performances en temps réel et découvrez les résultats individuels et par équipe instantanément."
        }
      },
      solidaryPrices: "Tarifs Solidaires",
      individual: "Individuel",
      team: "Équipe",
      partReversed: "Une partie des inscriptions est reversée à la Ligue contre le cancer",
      categories: "Catégories de Course",
      categoriesDescription: "Choisissez votre défi et participez à cette aventure solidaire",
      individualRaces: "Courses Individuelles",
      teamRelays: "Relais d'Équipe",
      register: "S'inscrire",
      participationMethods: "Modalités de Participation",
      whereParticipate: "Où participer ?",
      howItWorks: "Comment ça marche ?",
      rewards: "Récompenses",
      liveRanking: "Classement en Direct",
      liveDescription: "Suivez les performances en temps réel le jour J",
      liveDate: "LIVE le 18 octobre",
      topIndividual: "Top Individuel",
      topTeams: "Top Équipes",
      availableOnDay: "Disponible le jour J",
      readyForChallenge: "Prêt pour le défi ?",
      readyDescription: "Inscrivez-vous dès maintenant à la Rowing Care Cup et participez à cet événement solidaire exceptionnel le 18 octobre 2025.",
      teamRegistration: "Inscription équipe"
    },
    
    // Espace participant
    participant: {
      title: "Espace Participant",
      subtitle: "Accédez à votre espace personnel sécurisé",
      email: "Adresse email",
      receiveCode: "Recevoir le code d'accès",
      sending: "Envoi...",
      codeSent: "Un code d'accès a été envoyé à",
      accessCode: "Code d'accès (6 chiffres)",
      connect: "Se connecter",
      connecting: "Connexion...",
      changeEmail: "← Changer d'adresse email",
      disconnect: "Se déconnecter",
      quickActions: "Actions rapides",
      addKm: "Ajouter des km",
      recordSession: "Enregistrer une séance",
      registerEvent: "S'inscrire à l'événement",
      recentActivities: "Mes dernières activités",
      noActivity: "Aucune activité enregistrée",
      addFirstKm: "Ajoutez vos premiers kilomètres !",
      myStats: "Mes statistiques",
      kmCompleted: "km parcourus",
      sessions: "Séances",
      ranking: "Classement",
      myClub: "Mon club",
      activeMember: "Participant actif",
      memberSince: "Membre depuis {{date}}",
      upcoming: "À venir",
      indoor: "Aviron indoor",
      outdoor: "Aviron bateau"
    },
    
    // Administration
    admin: {
      title: "Administration",
      subtitle: "Accès réservé aux administrateurs",
      email: "Adresse email",
      password: "Mot de passe",
      login: "Se connecter",
      connecting: "Connexion...",
      incorrectCredentials: "Email ou mot de passe incorrect"
    },
    
    // Formulaires
    forms: {
      required: "requis",
      optional: "optionnel",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Email",
      phone: "Téléphone",
      club: "Club / Structure",
      date: "Date",
      distance: "Distance (km)",
      duration: "Durée",
      location: "Lieu",
      description: "Description",
      photo: "Photo",
      cancel: "Annuler",
      save: "Enregistrer",
      submit: "Valider",
      close: "Fermer",
      add: "Ajouter",
      remove: "Supprimer",
      edit: "Modifier",
      delete: "Supprimer",
      confirm: "Confirmer",
      loading: "Chargement...",
      saving: "Enregistrement...",
      success: "Succès !",
      error: "Erreur",
      tryAgain: "Réessayer"
    },
    
    // Pied de page
    footer: {
      description: "{{distance}} km pour relier les capitales de l'Union Européenne et lutter ensemble contre le cancer du sein. Rejoignez le mouvement !",
      quickLinks: "Liens rapides",
      contact: "Contact",
      legalNotices: "Mentions légales",
      privacyPolicy: "Politique de confidentialité",
      terms: "CGU",
      allRightsReserved: "© 2025 FFAviron - Octobre Rose. Tous droits réservés."
    },
    
    // Messages
    messages: {
      otpSent: "Code OTP envoyé par email",
      otpError: "Erreur lors de l'envoi du code",
      invalidCode: "Code invalide ou expiré",
      kmSaved: "Kilomètres enregistrés avec succès !",
      registrationSuccess: "Inscription enregistrée avec succès !",
      photoShared: "Photo partagée avec succès !",
      errorOccurred: "Une erreur s'est produite",
      tryAgainLater: "Veuillez réessayer plus tard"
    }
  }
};

// Traductions anglaises
const en = {
  translation: {
    // Navigation
    nav: {
      home: "Home",
      challenge: "The PINK Challenge",
      rowingCareCup: "Rowing Care Cup",
      participantSpace: "Participant Space",
      admin: "Admin"
    },
    
    // Page d'accueil
    home: {
      title: "Pink October 2025",
      subtitle: "x FFAviron",
      description: "{{distance}} km to connect the capitals of the European Union and fight together against breast cancer!",
      participateBtn: "Join the Challenge",
      rowingCareCupBtn: "Rowing Care Cup",
      followRibbon: "Follow the Pink Ribbon across Europe",
      followDescription: "Discover the real-time progress of the challenge on our interactive map. Every kilometer brings us closer to our goal!",
      calendar: "Events Calendar",
      calendarDescription: "Discover the highlights of Pink October 2025",
      readyToMakeDifference: "Ready to make a difference?",
      readyDescription: "Every kilometer counts, every gesture counts. Join thousands of participants in this exceptional solidarity adventure.",
      createSpace: "Create my space",
      donate: "Make a donation"
    },
    
    // Statistiques
    stats: {
      progression: "Challenge Progress",
      accomplished: "{{percent}}% accomplished",
      kilometersCompleted: "Kilometers completed",
      participants: "Participants",
      clubs: "Participating clubs",
      fundsRaised: "Funds raised",
      inProgress: "In progress",
      registered: "Registered",
      active: "Active",
      objective: "Goal: {{amount}}€",
      remaining: "Only {{km}} km left to reach our goal!",
      together: "Together, we can make a difference in the fight against breast cancer.",
      startNow: "The challenge starts now. Every kilometer counts in this solidarity adventure."
    },
    
    // Défi Rose
    challenge: {
      title: "The PINK Challenge",
      description: "From October 1st to 31st, 2025, participate in this exceptional European adventure",
      participate: "Join the Challenge",
      addKm: "Add my km",
      concept: "The Concept",
      conceptItems: {
        distance: {
          title: "{{distance}} kilometers to cover",
          description: "Symbolic distance connecting all European Union capitals, representing unity in the fight against breast cancer."
        },
        participation: {
          title: "Collective participation",
          description: "Clubs, individuals, families... Everyone can contribute with their indoor rowing, outdoor, or AviFit kilometers."
        },
        tracking: {
          title: "Real-time tracking",
          description: "Visualize the pink ribbon's progress on the interactive map and follow the progression towards the common goal."
        }
      },
      objective2025: "2025 Objective",
      toComplete: "To complete together from October 1st to 31st",
      capitals: "Capitals",
      days: "Days",
      animationsCalendar: "Events Calendar",
      animationsDescription: "Special events throughout October",
      gallery: "Participants Gallery",
      galleryDescription: "Discover the highlights shared by our participants",
      sharePhoto: "Share my photo",
      joinAdventure: "Join the adventure!",
      joinDescription: "Every kilometer counts in this beautiful solidarity adventure. Sign up now and contribute to this exceptional cause.",
      participateNow: "Participate now",
      registerClub: "Register my club"
    },
    
    // Rowing Care Cup
    rowingCareCup: {
      title: "Rowing Care Cup",
      subtitle: "National connected event - Saturday October 18th, 2025",
      date: "October 18th, 2025",
      allDay: "All day",
      connected: "100% connected",
      registered: "Registered",
      collected: "Collected",
      registerNow: "Register now",
      concept: "The Connected Indoor Challenge",
      conceptItems: {
        flexible: {
          title: "Flexible participation",
          description: "Participate from your club, at your physiotherapist's, or even from home with your ergometer."
        },
        technology: {
          title: "Time Team Technology",
          description: "Connected timing system for fair competition and real-time results."
        },
        rankings: {
          title: "Live rankings",
          description: "Follow performances in real-time and discover individual and team results instantly."
        }
      },
      solidaryPrices: "Solidarity Prices",
      individual: "Individual",
      team: "Team",
      partReversed: "Part of the registrations is donated to the League against cancer",
      categories: "Race Categories",
      categoriesDescription: "Choose your challenge and participate in this solidarity adventure",
      individualRaces: "Individual Races",
      teamRelays: "Team Relays",
      register: "Register",
      participationMethods: "Participation Methods",
      whereParticipate: "Where to participate?",
      howItWorks: "How does it work?",
      rewards: "Rewards",
      liveRanking: "Live Ranking",
      liveDescription: "Follow performances in real-time on D-Day",
      liveDate: "LIVE on October 18th",
      topIndividual: "Top Individual",
      topTeams: "Top Teams",
      availableOnDay: "Available on D-Day",
      readyForChallenge: "Ready for the challenge?",
      readyDescription: "Register now for the Rowing Care Cup and participate in this exceptional solidarity event on October 18th, 2025.",
      teamRegistration: "Team registration"
    },
    
    // Espace participant
    participant: {
      title: "Participant Space",
      subtitle: "Access your secure personal space",
      email: "Email address",
      receiveCode: "Receive access code",
      sending: "Sending...",
      codeSent: "An access code has been sent to",
      accessCode: "Access code (6 digits)",
      connect: "Connect",
      connecting: "Connecting...",
      changeEmail: "← Change email address",
      disconnect: "Disconnect",
      quickActions: "Quick actions",
      addKm: "Add km",
      recordSession: "Record a session",
      registerEvent: "Register for event",
      recentActivities: "My recent activities",
      noActivity: "No activity recorded",
      addFirstKm: "Add your first kilometers!",
      myStats: "My statistics",
      kmCompleted: "km completed",
      sessions: "Sessions",
      ranking: "Ranking",
      myClub: "My club",
      activeMember: "Active participant",
      memberSince: "Member since {{date}}",
      upcoming: "Upcoming",
      indoor: "Indoor rowing",
      outdoor: "Boat rowing"
    },
    
    // Administration
    admin: {
      title: "Administration",
      subtitle: "Access reserved for administrators",
      email: "Email address",
      password: "Password",
      login: "Login",
      connecting: "Connecting...",
      incorrectCredentials: "Incorrect email or password"
    },
    
    // Formulaires
    forms: {
      required: "required",
      optional: "optional",
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      phone: "Phone",
      club: "Club / Structure",
      date: "Date",
      distance: "Distance (km)",
      duration: "Duration",
      location: "Location",
      description: "Description",
      photo: "Photo",
      cancel: "Cancel",
      save: "Save",
      submit: "Submit",
      close: "Close",
      add: "Add",
      remove: "Remove",
      edit: "Edit",
      delete: "Delete",
      confirm: "Confirm",
      loading: "Loading...",
      saving: "Saving...",
      success: "Success!",
      error: "Error",
      tryAgain: "Try again"
    },
    
    // Défi Rose
    challenge: {
      title: "The PINK Challenge",
      description: "From October 1st to 31st, 2025, participate in this exceptional European adventure",
      participate: "Join the Challenge",
      addKm: "Add my km",
      concept: "The Concept",
      conceptItems: {
        distance: {
          title: "{{distance}} kilometers to cover",
          description: "Symbolic distance connecting all European Union capitals, representing unity in the fight against breast cancer."
        },
        participation: {
          title: "Collective participation",
          description: "Clubs, individuals, families... Everyone can contribute with their indoor rowing, outdoor, or AviFit kilometers."
        },
        tracking: {
          title: "Real-time tracking",
          description: "Visualize the pink ribbon's progress on the interactive map and follow the progression towards the common goal."
        }
      },
      objective2025: "2025 Objective",
      toComplete: "To complete together from October 1st to 31st",
      capitals: "Capitals",
      days: "Days",
      animationsCalendar: "Events Calendar",
      animationsDescription: "Special events throughout October",
      gallery: "Participants Gallery",
      galleryDescription: "Discover the highlights shared by our participants",
      sharePhoto: "Share my photo",
      joinAdventure: "Join the adventure!",
      joinDescription: "Every kilometer counts in this beautiful solidarity adventure. Sign up now and contribute to this exceptional cause.",
      participateNow: "Participate now",
      registerClub: "Register my club"
    },
    
    // Rowing Care Cup
    rowingCareCup: {
      title: "Rowing Care Cup",
      subtitle: "National connected event - Saturday October 18th, 2025",
      date: "October 18th, 2025",
      allDay: "All day",
      connected: "100% connected",
      registered: "Registered",
      collected: "Collected",
      registerNow: "Register now",
      concept: "The Connected Indoor Challenge",
      conceptItems: {
        flexible: {
          title: "Flexible participation",
          description: "Participate from your club, at your physiotherapist's, or even from home with your ergometer."
        },
        technology: {
          title: "Time Team Technology",
          description: "Connected timing system for fair competition and real-time results."
        },
        rankings: {
          title: "Live rankings",
          description: "Follow performances in real-time and discover individual and team results instantly."
        }
      },
      solidaryPrices: "Solidarity Prices",
      individual: "Individual",
      team: "Team",
      partReversed: "Part of the registrations is donated to the League against cancer",
      categories: "Race Categories",
      categoriesDescription: "Choose your challenge and participate in this solidarity adventure",
      individualRaces: "Individual Races",
      teamRelays: "Team Relays",
      register: "Register",
      participationMethods: "Participation Methods",
      whereParticipate: "Where to participate?",
      howItWorks: "How does it work?",
      rewards: "Rewards",
      liveRanking: "Live Ranking",
      liveDescription: "Follow performances in real-time on D-Day",
      liveDate: "LIVE on October 18th",
      topIndividual: "Top Individual",
      topTeams: "Top Teams",
      availableOnDay: "Available on D-Day",
      readyForChallenge: "Ready for the challenge?",
      readyDescription: "Register now for the Rowing Care Cup and participate in this exceptional solidarity event on October 18th, 2025.",
      teamRegistration: "Team registration"
    },
    
    // Espace participant
    participant: {
      title: "Participant Space",
      subtitle: "Access your secure personal space",
      email: "Email address",
      receiveCode: "Receive access code",
      sending: "Sending...",
      codeSent: "An access code has been sent to",
      accessCode: "Access code (6 digits)",
      connect: "Connect",
      connecting: "Connecting...",
      changeEmail: "← Change email address",
      disconnect: "Disconnect",
      quickActions: "Quick actions",
      addKm: "Add km",
      recordSession: "Record a session",
      registerEvent: "Register for event",
      recentActivities: "My recent activities",
      noActivity: "No activity recorded",
      addFirstKm: "Add your first kilometers!",
      myStats: "My statistics",
      kmCompleted: "km completed",
      sessions: "Sessions",
      ranking: "Ranking",
      myClub: "My club",
      activeMember: "Active participant",
      memberSince: "Member since {{date}}",
      upcoming: "Upcoming",
      indoor: "Indoor rowing",
      outdoor: "Boat rowing"
    },
    
    // Administration
    admin: {
      title: "Administration",
      subtitle: "Access reserved for administrators",
      email: "Email address",
      password: "Password",
      login: "Login",
      connecting: "Connecting...",
      incorrectCredentials: "Incorrect email or password"
    },
    
    // Formulaires
    forms: {
      required: "required",
      optional: "optional",
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      phone: "Phone",
      club: "Club / Structure",
      date: "Date",
      distance: "Distance (km)",
      duration: "Duration",
      location: "Location",
      description: "Description",
      photo: "Photo",
      cancel: "Cancel",
      save: "Save",
      submit: "Submit",
      close: "Close",
      add: "Add",
      remove: "Remove",
      edit: "Edit",
      delete: "Delete",
      confirm: "Confirm",
      loading: "Loading...",
      saving: "Saving...",
      success: "Success!",
      error: "Error",
      tryAgain: "Try again"
    },
    
    // Pied de page
    footer: {
      description: "{{distance}} km to connect the capitals of the European Union and fight together against breast cancer. Join the movement!",
      quickLinks: "Quick links",
      contact: "Contact",
      legalNotices: "Legal notices",
      privacyPolicy: "Privacy policy",
      terms: "Terms of use",
      allRightsReserved: "© 2025 FFAviron - Pink October. All rights reserved."
    },
    
    // Messages
    messages: {
      otpSent: "OTP code sent by email",
      otpError: "Error sending code",
      invalidCode: "Invalid or expired code",
      kmSaved: "Kilometers saved successfully!",
      registrationSuccess: "Registration successful!",
      photoShared: "Photo shared successfully!",
      errorOccurred: "An error occurred",
      tryAgainLater: "Please try again later"
    }
  }
};

// Configuration et initialisation
const i18nInstance = i18n
  .use(LanguageDetector)
  .use(initReactI18next)

// Configuration
const config = {
    resources: {
      fr,
      en
    },
    fallbackLng: 'fr',
    debug: import.meta.env.DEV, // Debug uniquement en développement
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    
    interpolation: {
      escapeValue: false
    }
};

// Initialisation avec gestion d'erreur
if (!i18nInstance.isInitialized) {
  i18nInstance.init(config).catch((error) => {
    console.error('Erreur d\'initialisation i18n:', error);
  });
}

export default i18nInstance;