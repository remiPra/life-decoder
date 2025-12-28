# 🔒 SÉCURITÉ — LIFE DECODER

## ⚠️ FAILLE CRITIQUE CORRIGÉE

### ❌ CE QU'IL NE FAUT JAMAIS FAIRE

```typescript
// ⛔ DANGER ! La clé API est exposée dans le navigateur
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

fetch('https://openrouter.ai/api/v1/chat/completions', {
  headers: {
    'Authorization': `Bearer ${apiKey}` // <-- N'importe qui peut voler cette clé !
  }
})
```

**Pourquoi c'est dangereux ?**
- Toutes les variables `VITE_*` sont publiques dans le bundle JavaScript
- N'importe qui peut :
  1. Ouvrir DevTools (F12)
  2. Chercher dans le code source
  3. Trouver la clé API
  4. L'utiliser à TES frais (facture de 500€+ en 24h)

---

## ✅ SOLUTION IMPLÉMENTÉE : Vercel Serverless Function

### Architecture Sécurisée

```
Utilisateur Navigateur
    ↓
    Frontend React (public)
    ↓
    fetch('/api/analyze') ← Pas de clé API ici !
    ↓
    Vercel Function (serveur sécurisé)
    ↓
    OpenRouter API (avec clé secrète)
    ↓
    Retour résultat au Frontend
```

---

## 📁 FICHIERS CRÉÉS

### 1. `/api/analyze.js` (Vercel Serverless Function)

```javascript
// 🔒 S'exécute côté SERVEUR (jamais dans le navigateur)
export default async function handler(req, res) {
  // Clé API stockée dans les variables d'environnement SERVEUR
  const apiKey = process.env.OPENROUTER_API_KEY;

  // Appel sécurisé à OpenRouter
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    headers: {
      'Authorization': `Bearer ${apiKey}` // ← Clé JAMAIS exposée
    }
  });

  return res.json(data);
}
```

### 2. `decisionEngine.ts` (Frontend)

```typescript
// ✅ SÉCURISÉ : Appel via notre proxy
const response = await fetch('/api/analyze', {
  method: 'POST',
  body: JSON.stringify({ prompt })
});
// Pas de clé API ici = Impossible à voler
```

---

## ⚙️ CONFIGURATION VERCEL

### Variables d'Environnement

Dans Vercel Dashboard → Settings → Environment Variables :

| Variable | Valeur | Environnement |
|----------|--------|---------------|
| `OPENROUTER_API_KEY` | `sk-or-v1-...` | Production + Preview + Development |

**⚠️ IMPORTANT** :
- NE PAS préfixer avec `VITE_` (sinon exposé)
- Utiliser `OPENROUTER_API_KEY` directement
- Accessible seulement dans les Serverless Functions

---

## 🧪 TESTER EN LOCAL

### 1. Installer Vercel CLI

```bash
npm install -g vercel
```

### 2. Créer `.env.local` pour les Serverless Functions

```bash
# .env.local (à la racine du projet)
OPENROUTER_API_KEY=sk-or-v1-votre-clé-ici
```

### 3. Lancer avec Vercel Dev

```bash
vercel dev
```

Cela simule l'environnement Vercel en local avec les API routes.

### 4. Tester

```bash
# Test direct de l'API
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test"}'
```

---

## 🔍 VÉRIFIER LA SÉCURITÉ

### Checklist avant déploiement :

- [ ] ✅ Aucune variable `VITE_OPENROUTER_API_KEY` dans le code
- [ ] ✅ Clé API seulement dans `process.env.OPENROUTER_API_KEY`
- [ ] ✅ Fichier `/api/analyze.js` existe
- [ ] ✅ `decisionEngine.ts` appelle `/api/analyze`
- [ ] ✅ Variable d'env configurée sur Vercel
- [ ] ✅ Pas de `.env.local` dans Git (dans `.gitignore`)

### Test de sécurité :

1. Ouvrir l'app en production
2. F12 → Sources → Chercher "sk-or-v1"
3. **Si trouvé = DANGER** → Corriger immédiatement
4. **Si non trouvé = ✅ Sécurisé**

---

## 🚨 EN CAS DE FUITE DE CLÉ

Si jamais tu as exposé ta clé API par erreur :

### 1. RÉVOQUER IMMÉDIATEMENT

1. Aller sur OpenRouter Dashboard
2. Supprimer l'ancienne clé
3. Créer une nouvelle clé

### 2. METTRE À JOUR

1. Vercel → Environment Variables → Remplacer
2. Redéployer l'app

### 3. VÉRIFIER LES USAGES

1. Checker les logs OpenRouter
2. Vérifier qu'il n'y a pas d'usage frauduleux
3. Contacter OpenRouter si nécessaire

---

## 📊 COÛTS ESTIMÉS

Avec le modèle sécurisé :

| Scénario | Coût estimé |
|----------|-------------|
| 100 décisions/jour | ~$5-10/jour |
| 1000 décisions/jour | ~$50-100/jour |
| Si clé volée | **ILLIMITÉ** 💸 |

→ **La sécurité n'est pas optionnelle !**

---

## 🛡️ BONNES PRATIQUES ADDITIONNELLES

### Rate Limiting (V2)

Ajouter dans `/api/analyze.js` :

```javascript
// Limiter à 10 requêtes par IP par heure
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10
});
```

### Validation Input

```javascript
// Valider le prompt avant envoi
if (prompt.length > 5000) {
  return res.status(400).json({ error: 'Prompt too long' });
}
```

### Logging (pour détecter abus)

```javascript
console.log({
  timestamp: new Date(),
  ip: req.headers['x-forwarded-for'],
  promptLength: prompt.length
});
```

---

## ✅ RÉSUMÉ

| Aspect | Avant (DANGEREUX) | Après (SÉCURISÉ) |
|--------|-------------------|------------------|
| Clé API | Dans le navigateur | Sur le serveur |
| Exposition | Publique | Privée |
| Risque | Vol facile | Protégé |
| Coût si hack | Illimité | Impossible |

**Ta clé API est maintenant en sécurité.** 🔒

---

**Créé pour protéger ton budget et ton produit.** 💚
