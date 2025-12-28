# ⚡ QUICK START — LIFE DECODER V2

## 🎯 EN 3 ÉTAPES

### 1️⃣ ACTIVER LA V2

```bash
# Remplacer App.tsx par la V2
mv App.tsx App-V1-BACKUP.tsx
mv App-V2.tsx App.tsx
```

### 2️⃣ VÉRIFIER LA CLÉ API

Ouvrir `.env.local` et vérifier :
```
VITE_OPENROUTER_API_KEY=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
```

### 3️⃣ LANCER

```bash
npm run dev
```

Ouvrir http://localhost:5173

---

## ✅ CE QUI DEVRAIT SE PASSER

1. **Page Welcome** avec titre "LIFE DECODER" et bouton "Commencer une décision"
2. **Click** → Formulaire prénom + date de naissance
3. **Submit** → Choix du type de décision (💼 Carrière / 🚀 Projet / 💕 Relation)
4. **Click** → Chat guidé avec 4 questions
5. **Validation** → Loading pendant analyse IA (~10 sec)
6. **Résultat** → Page avec score timing + 3 scénarios + 3 actions

---

## 🐛 SI ÇA NE MARCHE PAS

### Écran blanc ?
```bash
# Ouvrir console navigateur (F12)
# Chercher erreurs d'import
```

**Fix probable** : Vérifier que tous les fichiers sont bien créés :
- `decision-types.ts`
- `decisionEngine.ts`
- `storageUtils.ts`
- `Welcome.tsx`
- `ProfileForm.tsx`
- `DecisionTypeSelector.tsx`
- `DecisionCanvas.tsx`
- `ResultsView.tsx`
- `App-V2.tsx` (renommé en `App.tsx`)

### Erreur "crypto is not defined" ?

Remplacer dans `App-V2.tsx` (ligne ~67) :
```typescript
// Ancien
id: crypto.randomUUID(),

// Nouveau
id: `${Date.now()}-${Math.random().toString(36)}`,
```

### API ne répond pas ?

1. Vérifier `.env.local` existe et contient la clé
2. Restart le serveur dev (`Ctrl+C` puis `npm run dev`)
3. Vérifier la console pour erreurs réseau

---

## 🎨 CUSTOMISATION RAPIDE

### Changer les couleurs

Dans chaque fichier `.tsx`, remplacer :
- `#C5A059` (gold) par votre couleur
- `#050505` (noir) par votre fond

### Modifier le prompt IA

Éditer `decisionEngine.ts` ligne 3-80 (constante `DECISION_ENGINE_PROMPT`)

### Ajouter un type de décision

Dans `DecisionTypeSelector.tsx`, ajouter dans le tableau `types` :
```typescript
{
  id: 'health' as DecisionType,
  icon: '🏃',
  label: 'Santé / Bien-être',
  desc: 'Sport, alimentation, habitudes'
}
```

Puis dans `decision-types.ts` :
```typescript
export type DecisionType = 'career' | 'project' | 'relationship' | 'health';
```

---

## 📊 TESTER LE FLOW COMPLET

Scénario de test :

**Prénom** : Test
**Date** : 15/06/1990
**Type** : Carrière
**Situation** : "Je suis développeur depuis 5 ans dans une grosse boîte"
**Décision** : "Accepter une offre dans une startup ou rester"
**Échéance** : Dans 2 semaines
**Importance** : 5/5

**Résultat attendu** :
- Score timing (Favorable/Neutre/Délicat)
- 3 scénarios détaillés
- 3 actions concrètes à faire cette semaine

---

## 🚀 DÉPLOYER SUR VERCEL

```bash
# 1. Push sur GitHub
git add .
git commit -m "feat: Life Decoder V2 - Decision Engine"
git push

# 2. Sur Vercel
# - Connecter le repo
# - Ajouter VITE_OPENROUTER_API_KEY dans Environment Variables
# - Deploy !
```

---

## 📈 MÉTRIQUES À SURVEILLER

Après lancement :
- **Taux de complétion** : % qui arrive jusqu'au résultat
- **Temps moyen** : Combien de temps sur le DecisionCanvas
- **Feedback positif** : % de "😊 Oui"
- **Retours 7j** : Combien reviennent dans la semaine

---

## 🎯 OBJECTIF MVP

> **Un utilisateur arrive, pose sa question, reçoit 3 actions concrètes, se sent aidé.**

Si ce flow fonctionne = produit viable.

Tout le reste est secondaire.

---

**GO ! 🚀**
