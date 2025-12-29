# Comment modifier les Conditions Générales d'Utilisation

## 📄 Fichier à modifier

Pour changer le texte des CGU, ouvre le fichier suivant:

**`content/terms.tsx`**

## ✏️ Comment modifier

### 1. Modifier le titre
```typescript
title: "Ton nouveau titre",
subtitle: "Ton sous-titre",
```

### 2. Ajouter une section
```typescript
{
  title: "9. Nouvelle Section",
  content: `Ton texte ici...
    Tu peux faire des sauts de ligne.`
}
```

### 3. Modifier une section existante
Change simplement le texte dans `content`:

```typescript
{
  title: "1. Objet",
  content: `Ton nouveau texte pour cette section`
}
```

### 4. Ajouter une adresse email cliquable
```typescript
{
  title: "Contact",
  content: `Pour nous contacter :`,
  contactEmail: "ton-email@exemple.com"
}
```

## 🎨 Exemple complet

```typescript
export const TERMS_CONTENT = {
  title: "Mes CGU Personnalisées",
  subtitle: "Life Decoder",
  lastUpdated: new Date().toLocaleDateString('fr-FR'),

  sections: [
    {
      title: "1. Introduction",
      content: `Bienvenue sur Life Decoder.
        En utilisant cette app, tu acceptes les conditions suivantes.`
    },
    {
      title: "2. Contact",
      content: `Pour toute question :`,
      contactEmail: "support@lifedecoder.app"
    }
  ]
};
```

## 💾 Après modification

1. Sauvegarde le fichier `content/terms.tsx`
2. Les changements apparaîtront automatiquement sur la page de connexion
3. Pas besoin de redémarrer l'app!

## 🔍 Où ça apparaît?

Les CGU apparaissent:
- ✅ Sur la page de connexion (checkbox obligatoire)
- ✅ Dans une popup modale quand on clique sur le lien
- ✅ L'utilisateur DOIT cocher la case pour voir le formulaire de connexion

## 📌 Notes importantes

- Les sections sont numérotées automatiquement dans le titre
- Le texte supporte les sauts de ligne avec les backticks \`\`
- La date de mise à jour se met automatiquement à la date du jour
- Le style (couleurs, fonts) est géré automatiquement
