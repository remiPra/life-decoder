# 🧭 LIFE DECODER

> Architecture de la Destinée - Analyse tes décisions avec la numérologie et l'astrologie chinoise

## 🎯 Qu'est-ce que Life Decoder ?

Life Decoder est une plateforme d'analyse décisionnelle combinant **numérologie**, **astrologie chinoise** (择日) et **analyse rationnelle** pour t'aider à prendre des décisions importantes.

### 3 Modes d'Analyse

1. **🔮 Mode Mystique** : Numérologie & Oracle
   - Thème natal numérologique complet
   - Analyse des cycles personnels (année, mois, jour)
   - Consultation oracle pour tes décisions
   - Timeline future basée sur ta numérologie

2. **🌙 Mode 择日 (Zé Rì)** : Sélection de Dates Favorables
   - Calendrier lunaire chinois
   - Dates favorables pour événements importants
   - Analyse Wu Xing (5 éléments)
   - Recommandations par type d'événement (mariage, business, déménagement, etc.)

3. **✨ Mode Rationnel** : Analyse de Décision
   - Structuration de ta réflexion
   - Analyse du timing de ta décision
   - 3 scénarios possibles détaillés
   - 3 actions concrètes à faire cette semaine

## ✨ Comment ça marche ?

### Flow simple en 5 étapes :
1. **Profil** : Entre ton prénom et ta date de naissance
2. **Type** : Choisis le domaine (Carrière, Projet, Relation)
3. **Canvas** : Réponds à 4 questions sur ta situation
4. **Validation** : Vérifie que tout est clair
5. **Résultat** : Reçois ton analyse complète

### Ce que tu reçois :
- ✅ Une reformulation claire de ta situation
- ✅ Une analyse du timing (Favorable / Neutre / Délicat)
- ✅ 3 scénarios détaillés (avantages + vigilances)
- ✅ 3 actions concrètes réalisables en 7 jours

## 🚀 Stack Technique

- **Frontend** : React 19 + TypeScript + Vite
- **Styling** : Tailwind CSS
- **IA** : Claude Opus 4.5 via OpenRouter API
- **Authentication** : Clerk (Google OAuth)
- **Database** : Firebase Firestore
- **Storage** : localStorage + Firebase
- **PDF Export** : jsPDF
- **Sécurité** : Vercel Serverless Function (clé API protégée)
- **Déploiement** : Vercel

## 🤖 APIs Utilisées

### OpenRouter API (Claude Opus 4.5)
- **Endpoint** : `/api/analyze-mystical` (Mode Mystique & 择日)
- **Endpoint** : `/api/analyze-decision` (Mode Rationnel)
- **Coût estimé** : ~$0.04-0.08 par analyse
- **Tokens moyens** : ~2000 tokens (input + output)

### Clerk Authentication API
- **Service** : Google OAuth
- **Gratuit** : Jusqu'à 10,000 MAU (Monthly Active Users)

### Firebase Firestore
- **Collection** : `analyses`
- **Données sauvegardées** : Historique des analyses par utilisateur
- **Gratuit** : Jusqu'à 50,000 reads/day + 20,000 writes/day

## 🎁 Système Freemium

### Utilisateurs Non-Connectés
- ✅ **2 analyses gratuites** (tous modes confondus)
- ❌ Pas d'historique sauvegardé
- ❌ Pas de téléchargement PDF

### Utilisateurs Connectés
- ✅ **Analyses illimitées**
- ✅ Historique sauvegardé dans Firebase
- ✅ Téléchargement PDF
- ✅ Accès à tous les modes

**Compteur partagé** : `localStorage.getItem('life-decoder-free-count')`

## 🔒 Sécurité

La clé API OpenRouter est **protégée côté serveur** via une Vercel Serverless Function.
Voir [SECURITY.md](SECURITY.md) pour les détails.

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Configurer la clé API (voir SECURITY.md)
# Créer .env.local avec OPENROUTER_API_KEY

# Lancer en local avec Vercel Dev
vercel dev

# Ou lancer sans API (interface uniquement)
npm run dev
```

## 🧪 Déploiement

1. Push sur GitHub
2. Connecter le repo sur Vercel
3. Ajouter la variable d'environnement `OPENROUTER_API_KEY`
4. Deploy

## 📖 Documentation

- [SPECS_COMPLETE.md](SPECS_COMPLETE.md) - Spécifications complètes
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - Guide d'implémentation
- [SECURITY.md](SECURITY.md) - Guide sécurité
- [QUICK_START.md](QUICK_START.md) - Démarrage rapide

## 🎯 Produit

### Valeur
**Avant** : "Je ne sais pas quoi faire"
**Après** : "J'ai 3 scénarios clairs et 3 actions à faire cette semaine"

### Positionnement
Un assistant IA de clarification décisionnelle, pas un oracle.

### Public cible
- Entrepreneurs en phase de décision
- Créatifs hésitant sur un projet
- Personnes en transition (carrière, relation)

## ✅ Fonctionnalités Implémentées

- ✅ 3 modes d'analyse (Mystique, 择日, Rationnel)
- ✅ Export PDF des analyses
- ✅ Historique complet (utilisateurs connectés)
- ✅ Authentication Google via Clerk
- ✅ Sauvegarde Firebase
- ✅ Système freemium (2 analyses gratuites)
- ✅ CGU juridiquement sécurisées
- ✅ Interface responsive avec animations
- ✅ Dark mode design

## 💡 Améliorations futures

### Monétisation
- [ ] Stripe Payment Links pour accès premium
- [ ] Page Pricing
- [ ] Plans d'abonnement (mensuel/annuel)

### Analytics
- [ ] Posthog / Mixpanel
- [ ] Events tracking
- [ ] Conversion funnel
- [ ] Heatmaps

### Features
- [ ] Partage social des résultats
- [ ] Notifications par email
- [ ] Widget calendrier pour 择日
- [ ] Comparaison de dates favorables

## 📄 Licence

MIT

---

**Life Decoder** - Clarifie tes décisions importantes.
