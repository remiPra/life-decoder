// Ce fichier contient le texte des Conditions Générales d'Utilisation
// Version juridiquement sécurisée - Rédigée au niveau cabinet d'avocats

export const TERMS_CONTENT = {
  title: "Conditions Générales d'Utilisation",
  subtitle: "Life Decoder",
  lastUpdated: new Date().toLocaleDateString('fr-FR'),

  // 🔧 VARIABLES À PERSONNALISER
  editorName: "[Nom / Dénomination sociale à compléter]",
  editorAddress: "[Adresse complète à compléter]",
  contactEmail: "contact@lifedecoder.app",
  privacyPolicyUrl: "/privacy", // Lien vers la politique de confidentialité
  jurisdiction: "français",
  competentCourt: "[Ville à compléter, ex: Paris]",

  sections: [
    {
      title: "1. Objet",
      content: `Les présentes Conditions Générales d'Utilisation (ci-après les « CGU ») ont pour objet de définir les modalités et conditions dans lesquelles les utilisateurs accèdent et utilisent le service Life Decoder (ci-après le « Service »).

Toute utilisation du Service implique l'acceptation pleine, entière et sans réserve des présentes CGU.`
    },
    {
      title: "2. Éditeur du Service",
      content: `Le Service est édité par :
[Nom / Dénomination sociale à compléter]
Adresse : [Adresse complète à compléter]
Adresse électronique : contact@lifedecoder.app`,
      showAsPreformatted: true
    },
    {
      title: "3. Description du Service",
      content: `Life Decoder est une plateforme numérique proposant des contenus personnalisés à vocation informationnelle, réflexive et de développement personnel, reposant notamment sur :

• des méthodes inspirées de la numérologie,
• des systèmes traditionnels de sélection de dates favorables (notamment issus du calendrier luni-solaire chinois),
• des outils d'analyse structurée destinés à la clarification d'une situation ou d'une décision.

Les contenus sont générés automatiquement à partir des informations fournies par l'utilisateur.`
    },
    {
      title: "4. Nature du Service – Absence de conseil réglementé",
      subsections: [
        {
          subtitle: "4.1 Contenu à visée non médicale, non juridique et non financière",
          content: `Le Service ne constitue en aucun cas :

• un conseil médical ou psychologique,
• un diagnostic ou un traitement de santé,
• un conseil juridique, fiscal ou financier,
• une consultation professionnelle réglementée.

Les contenus proposés relèvent exclusivement de la guidance personnelle, de la réflexion subjective et du divertissement intellectuel.`
        },
        {
          subtitle: "4.2 Absence de garantie de résultat",
          content: `Le Service ne garantit aucun résultat, aucune exactitude absolue, ni aucune réalisation d'événement futur.

Les interprétations proposées ne reposent sur aucune validation scientifique reconnue et ne sauraient être considérées comme des faits établis.`
        }
      ]
    },
    {
      title: "5. Responsabilité de l'utilisateur",
      content: `L'utilisateur reconnaît expressément que :

• il demeure seul responsable de ses décisions, actes et comportements,
• les contenus fournis par Life Decoder ne constituent qu'un outil d'aide à la réflexion,
• toute décision prise sur la base du Service l'est sous sa responsabilité exclusive.

L'utilisateur s'engage à ne pas utiliser le Service comme fondement unique pour des décisions majeures ou sensibles.`
    },
    {
      title: "6. Données saisies par l'utilisateur",
      content: `Pour le fonctionnement du Service, l'utilisateur peut être amené à fournir notamment :

• un prénom ou pseudonyme,
• une date de naissance,
• des informations descriptives facultatives.

L'utilisateur s'engage à :

• fournir des informations exactes,
• ne pas transmettre de données sensibles inutiles,
• ne pas communiquer de données appartenant à des tiers sans autorisation.`
    },
    {
      title: "7. Données personnelles et conformité RGPD",
      content: `Le traitement des données personnelles est réalisé conformément à la réglementation applicable, notamment le Règlement (UE) 2016/679 (RGPD).

Les modalités relatives aux données personnelles (nature, finalité, durée de conservation, droits des utilisateurs) sont détaillées dans la Politique de Confidentialité.`
    },
    {
      title: "8. Propriété intellectuelle",
      content: `L'ensemble du Service, incluant notamment :

• l'architecture,
• le design,
• les textes,
• les algorithmes,
• les contenus générés (hors données utilisateur),

est protégé par les dispositions relatives à la propriété intellectuelle.

Toute reproduction, diffusion ou exploitation non autorisée est strictement interdite.

Les rapports générés sont concédés à l'utilisateur pour un usage strictement personnel et non commercial, sauf autorisation expresse.`
    },
    {
      title: "9. Disponibilité du Service",
      content: `Le Service est fourni « en l'état » et selon la disponibilité des infrastructures techniques.

L'éditeur ne garantit ni une disponibilité continue, ni l'absence d'erreurs, interruptions ou anomalies.

Le Service peut être modifié, suspendu ou interrompu sans préavis.`
    },
    {
      title: "10. Tarification",
      content: `Certaines fonctionnalités peuvent être payantes. Les conditions tarifaires sont précisées avant toute souscription ou paiement.

Sauf indication contraire, les contenus numériques sont réputés fournis immédiatement après validation du paiement.`
    },
    {
      title: "11. Limitation de responsabilité",
      content: `Dans les limites autorisées par la loi, la responsabilité de l'éditeur ne saurait être engagée notamment en cas :

• d'utilisation du Service contraire à sa finalité,
• d'interprétation erronée des contenus générés,
• de décision prise sur la base du Service,
• de dommages indirects ou immatériels.

En tout état de cause, la responsabilité éventuelle de l'éditeur est strictement limitée au montant effectivement payé par l'utilisateur au cours des trente (30) derniers jours précédant le fait générateur.`
    },
    {
      title: "12. Suspension ou résiliation",
      content: `L'éditeur se réserve le droit de suspendre ou résilier l'accès au Service en cas :

• de violation des présentes CGU,
• d'usage abusif ou frauduleux,
• d'obligation légale ou réglementaire.`
    },
    {
      title: "13. Droit applicable et juridiction compétente",
      content: `Les présentes CGU sont régies par le droit français.

Tout litige relatif à leur interprétation ou exécution relève de la compétence exclusive des tribunaux de [Ville à compléter], sauf disposition impérative contraire.`
    },
    {
      title: "14. Contact",
      content: `Pour toute question relative au Service ou aux présentes CGU :`,
      contactEmail: "contact@lifedecoder.app"
    }
  ]
};
