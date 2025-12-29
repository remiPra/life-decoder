# 📋 Personnaliser les informations légales

## 🎯 Fichier à modifier

Ouvre le fichier: **`content/terms.tsx`**

## ✏️ Informations À COMPLÉTER OBLIGATOIREMENT

En haut du fichier, tu trouveras ces variables:

```typescript
// 🔧 VARIABLES À PERSONNALISER
editorName: "[Nom / Dénomination sociale à compléter]",
editorAddress: "[Adresse complète à compléter]",
contactEmail: "contact@lifedecoder.app",
privacyPolicyUrl: "/privacy",
jurisdiction: "français",
competentCourt: "[Ville à compléter, ex: Paris]",
```

### 1. Nom de l'éditeur
**Remplace:**
```typescript
editorName: "[Nom / Dénomination sociale à compléter]",
```

**Par (exemple):**
```typescript
editorName: "Life Decoder SARL",
// OU
editorName: "Jean Dupont - Auto-entrepreneur",
```

---

### 2. Adresse complète
**Remplace:**
```typescript
editorAddress: "[Adresse complète à compléter]",
```

**Par (exemple):**
```typescript
editorAddress: "12 rue de la République, 75001 Paris, France",
```

---

### 3. Email de contact
**Remplace (si besoin):**
```typescript
contactEmail: "contact@lifedecoder.app",
```

**Par (exemple):**
```typescript
contactEmail: "support@tondomaine.com",
```

---

### 4. Tribunal compétent
**Remplace:**
```typescript
competentCourt: "[Ville à compléter, ex: Paris]",
```

**Par (exemple):**
```typescript
competentCourt: "Paris",
// OU
competentCourt: "Lyon",
```

💡 **Note:** Choisis généralement la ville où est située ton entreprise.

---

## 📌 Sections du texte

Le texte des CGU est dans la section `sections`. Il est **déjà complet et juridiquement solide**.

Tu **n'as PAS besoin de modifier le texte**, sauf si tu veux ajuster quelque chose de spécifique.

### Structure d'une section:

```typescript
{
  title: "1. Titre de la section",
  content: `Texte de la section...`
}
```

### Section avec sous-sections:

```typescript
{
  title: "4. Nature du Service",
  subsections: [
    {
      subtitle: "4.1 Sous-titre",
      content: `Texte...`
    },
    {
      subtitle: "4.2 Autre sous-titre",
      content: `Texte...`
    }
  ]
}
```

---

## ⚖️ Ce que couvre ce texte juridique

✅ **Protection maximale** pour toi en tant qu'éditeur
✅ **Conformité RGPD** (données personnelles)
✅ **Disclaimer béton** sur:
- Pas de conseil médical/juridique/financier
- Pas de garantie de résultat
- Responsabilité limitée
- Contenu à titre informatif uniquement

✅ **Niveau "cabinet d'avocats"** - Texte rédigé de manière professionnelle

---

## 🚀 Après modification

1. Sauvegarde le fichier `content/terms.tsx`
2. Les changements apparaissent **automatiquement** dans l'app
3. Pas besoin de redémarrer!

---

## 🔍 Où apparaissent les CGU?

Les CGU sont affichées:
- ✅ **Page de connexion** - Checkbox obligatoire
- ✅ **Popup modale** quand l'utilisateur clique sur "Conditions Générales d'Utilisation"
- ✅ **Bloque l'accès** tant que l'utilisateur n'a pas coché la case

---

## 📧 Besoin d'aide?

Si tu as des questions ou besoin d'aide pour compléter ces informations, contacte-moi!

---

## ⚠️ Important

**Tu DOIS compléter ces informations avant de mettre l'app en production:**

- [ ] Nom de l'éditeur
- [ ] Adresse complète
- [ ] Email de contact (vérifie qu'il est correct)
- [ ] Tribunal compétent

Ces informations sont **obligatoires légalement** en France/Europe.
