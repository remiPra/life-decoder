# 🧭 LIFE DECODER

> Clarifie tes décisions importantes.

## 🎯 Qu'est-ce que Life Decoder ?

Life Decoder est un assistant IA qui t'aide à clarifier tes décisions importantes grâce à une analyse personnalisée et des actions concrètes.

### Le Concept

Tu as une décision difficile à prendre ? Life Decoder t'aide à :
- Structurer ta réflexion
- Analyser le timing de ta décision
- Visualiser 3 scénarios possibles
- Recevoir 3 actions concrètes à faire cette semaine

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
- **Sécurité** : Vercel Serverless Function (clé API protégée)
- **Déploiement** : Vercel

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

## 💡 Améliorations futures

### Quick Wins
- [ ] Export PDF des résultats
- [ ] Partage social
- [ ] Mode sombre
- [ ] Historique (si compte user)

### Monétisation
- [ ] Paywall après 1ère décision gratuite
- [ ] Stripe Payment Links
- [ ] Page Pricing

### Analytics
- [ ] Posthog / Mixpanel
- [ ] Events tracking
- [ ] Heatmaps

## 📄 Licence

MIT

---

**Life Decoder** - Clarifie tes décisions importantes.
