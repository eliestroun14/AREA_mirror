# Guide Complet Prisma - Documentation Illustrée

## Table des Matières
1. [Introduction](#introduction)
2. [Installation et Configuration](#installation-et-configuration)
3. [Prisma Schema](#prisma-schema)
4. [Modèles de Données](#modèles-de-données)
5. [Relations](#relations)
6. [Prisma Client](#prisma-client)
7. [Migrations](#migrations)
8. [Requêtes CRUD](#requêtes-crud)
9. [Requêtes Avancées](#requêtes-avancées)
10. [Prisma Studio](#prisma-studio)
11. [Optimisations et Performance](#optimisations-et-performance)
12. [Cas d'Usage Pratiques](#cas-dusage-pratiques)

---

## Introduction

**Prisma** est un ORM (Object-Relational Mapping) nouvelle génération pour Node.js et TypeScript. Il offre une approche moderne pour interagir avec votre base de données.

### Avantages de Prisma
- ✅ **Type-safety** complète avec TypeScript
- ✅ **Auto-complétion** intelligente
- ✅ **Migrations** automatisées
- ✅ **Interface graphique** (Prisma Studio)
- ✅ Support multi-bases de données
- ✅ **Performance** optimisée

### Bases de données supportées
- PostgreSQL
- MySQL / MariaDB
- SQLite
- MongoDB
- SQL Server
- CockroachDB

---

## Installation et Configuration

### 1. Installation
```bash
# Initialiser un nouveau projet Prisma
npx prisma init

# Ou installer dans un projet existant
npm install prisma @prisma/client
npx prisma init
```

### 2. Configuration initiale
Après `npx prisma init`, vous obtenez :
```
votre-projet/
  prisma/
    schema.prisma    # Schéma principal
  .env              # Variables d'environnement
```

### 3. Configuration de la base de données
Dans `.env` :
```env
# PostgreSQL
DATABASE_URL="postgresql://utilisateur:motdepasse@localhost:5432/mabase"

# MySQL
DATABASE_URL="mysql://utilisateur:motdepasse@localhost:3306/mabase"

# SQLite
DATABASE_URL="file:./dev.db"
```

---

## Prisma Schema

Le fichier `schema.prisma` est le cœur de Prisma. Il contient trois éléments principaux :

### Structure du Schema
```prisma
// 1. Générateur - Défini comment générer le client
generator client {
  provider = "prisma-client-js"
}

// 2. Source de données - Connection à la DB
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 3. Modèles de données - Vos tables/collections
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}
```

### Options du Générateur
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "./generated/prisma-client-js"  // Dossier de sortie personnalisé
  binaryTargets = ["native", "rhel-openssl-1.0.x"]  // Pour différents OS
}
```

---

## Modèles de Données

### Types de Données de Base
```prisma
model Exemple {
  id          Int      @id @default(autoincrement())
  texte       String   
  texteOptio  String?  // Optionnel avec ?
  nombre      Int
  decimal     Float
  booleen     Boolean
  dateTime    DateTime @default(now())
  date        DateTime @db.Date
  json        Json
  bytes       Bytes
}
```

### Attributs de Champs
```prisma
model User {
  id       Int      @id @default(autoincrement())  // Clé primaire auto-incrémentée
  email    String   @unique                        // Valeur unique
  nom      String   @db.VarChar(255)              // Type DB spécifique
  createdAt DateTime @default(now())              // Valeur par défaut
  updatedAt DateTime @updatedAt                   // Mis à jour automatiquement
  
  @@map("users")      // Nom de table personnalisé
  @@index([email])    // Index sur email
}
```

### Énumérations
```prisma
enum Role {
  USER
  ADMIN
  MODERATOR
}

model User {
  id   Int  @id @default(autoincrement())
  role Role @default(USER)
}
```

---

## Relations

### One-to-Many (Un vers Plusieurs)
```prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[] // Un utilisateur a plusieurs posts
}

model Post {
  id       Int  @id @default(autoincrement())
  title    String
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
```

**Explication** :
- `posts Post[]` : Champ virtuel Prisma (pas de colonne en DB)
- `authorId Int` : Clé étrangère réelle en DB
- `@relation` : Définit la relation entre les modèles

### One-to-One (Un vers Un)
```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  profile Profile? // Un utilisateur a un profil optionnel
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  userId Int    @unique  // Clé étrangère unique
  user   User   @relation(fields: [userId], references: [id])
}
```

### Many-to-Many (Plusieurs vers Plusieurs)
```prisma
model Post {
  id         Int        @id @default(autoincrement())
  title      String
  categories Category[] // Relation many-to-many
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[] // Relation many-to-many
}

// Prisma crée automatiquement une table de liaison :
// _CategoryToPost (id, A, B)
```

### Many-to-Many avec Table de Liaison Explicite
```prisma
model User {
  id            Int            @id @default(autoincrement())
  name          String
  projectUsers  ProjectUser[]
}

model Project {
  id            Int            @id @default(autoincrement())
  name          String
  projectUsers  ProjectUser[]
}

model ProjectUser {
  id        Int     @id @default(autoincrement())
  userId    Int
  projectId Int
  role      String  // Champ supplémentaire
  user      User    @relation(fields: [userId], references: [id])
  project   Project @relation(fields: [projectId], references: [id])
  
  @@unique([userId, projectId])
}
```

---

## Prisma Client

### Génération du Client
```bash
# Génère le client après modification du schema
npx prisma generate
```
> ⚠️ **Important** : Après chaque modification du fichier `schema.prisma`, il est impératif de relancer la commande `npx prisma generate` pour que le client Prisma soit mis à jour. Sinon, votre code risque de ne pas refléter les changements du schéma et d'entraîner des erreurs difficiles à diagnostiquer.

### Utilisation de Base
```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Logs détaillés
})

// Fermer la connexion proprement
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
```

---

## Migrations

### Workflow de Migration
```bash
# 1. Créer et appliquer une migration
npx prisma migrate dev --name init

# 2. Appliquer les migrations en production
npx prisma migrate deploy

# 3. Réinitialiser la base (développement uniquement)
npx prisma migrate reset

# 4. Voir le statut des migrations
npx prisma migrate status
```

### Migration depuis une DB existante
```bash
# 1. Générer le schema depuis la DB
npx prisma db pull

# 2. Baseline pour DB avec données existantes
npx prisma migrate dev --create-only --name baseline
npx prisma migrate resolve --applied baseline
```

---

## Requêtes CRUD

### Create (Créer)
```javascript
// Créer un utilisateur simple
const user = await prisma.user.create({
  data: {
    email: 'alice@exemple.com',
    name: 'Alice',
  }
})

// Créer avec relation
const userWithPost = await prisma.user.create({
  data: {
    email: 'bob@exemple.com',
    name: 'Bob',
    posts: {
      create: [
        { title: 'Mon premier post' },
        { title: 'Mon second post' }
      ]
    }
  },
  include: {
    posts: true // Inclure les posts dans la réponse
  }
})

// Créer plusieurs enregistrements
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@exemple.com', name: 'User 1' },
    { email: 'user2@exemple.com', name: 'User 2' },
  ]
})
```

### Read (Lire)
```javascript
// Trouver un utilisateur unique
const user = await prisma.user.findUnique({
  where: { email: 'alice@exemple.com' }
})

// Trouver le premier correspondant
const firstUser = await prisma.user.findFirst({
  where: { name: { contains: 'Alice' } }
})

// Trouver plusieurs
const users = await prisma.user.findMany({
  where: {
    email: { contains: '@exemple.com' }
  },
  orderBy: { name: 'asc' },
  take: 10, // LIMIT 10
  skip: 20  // OFFSET 20
})

// Avec relations
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    }
  }
})

// Sélection de champs spécifiques
const userNames = await prisma.user.findMany({
  select: {
    name: true,
    email: true
  }
})
```

### Update (Mettre à jour)
```javascript
// Mettre à jour un enregistrement
const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'Alice Dupont' }
})

// Mettre à jour plusieurs
const updateResult = await prisma.user.updateMany({
  where: { email: { contains: '@exemple.com' } },
  data: { updatedAt: new Date() }
})

// Upsert (créer ou mettre à jour)
const user = await prisma.user.upsert({
  where: { email: 'charlie@exemple.com' },
  update: { name: 'Charlie Updated' },
  create: {
    email: 'charlie@exemple.com',
    name: 'Charlie New'
  }
})
```

### Delete (Supprimer)
```javascript
// Supprimer un enregistrement
const deletedUser = await prisma.user.delete({
  where: { id: 1 }
})

// Supprimer plusieurs
const deleteResult = await prisma.user.deleteMany({
  where: { createdAt: { lt: new Date('2023-01-01') } }
})
```

---

## Requêtes Avancées

### Filtres Complexes
```javascript
const complexQuery = await prisma.user.findMany({
  where: {
    AND: [
      { email: { contains: '@exemple.com' } },
      { 
        OR: [
          { name: { startsWith: 'A' } },
          { name: { endsWith: 'son' } }
        ]
      }
    ],
    posts: {
      some: { // Au moins un post correspondant
        published: true,
        createdAt: { gte: new Date('2024-01-01') }
      }
    }
  }
})
```

### Agrégations
```javascript
// Compter
const userCount = await prisma.user.count({
  where: { email: { contains: '@exemple.com' } }
})

// Agrégations avancées
const stats = await prisma.user.aggregate({
  _count: { id: true },
  _avg: { age: true },
  _max: { createdAt: true },
  _min: { createdAt: true }
})

// Group By
const usersByRole = await prisma.user.groupBy({
  by: ['role'],
  _count: { id: true },
  having: {
    id: { _count: { gt: 5 } }
  }
})
```

### Transactions
```javascript
// Transaction simple
await prisma.$transaction([
  prisma.user.create({ data: { email: 'user1@exemple.com' } }),
  prisma.user.create({ data: { email: 'user2@exemple.com' } })
])

// Transaction interactive
await prisma.$transaction(async (prisma) => {
  const user = await prisma.user.create({
    data: { email: 'user@exemple.com', name: 'User' }
  })
  
  await prisma.post.create({
    data: { title: 'Premier post', authorId: user.id }
  })
})
```

### Requêtes SQL Brutes
```javascript
// Requête SELECT brute
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE email LIKE ${'%@exemple.com'}
`

// Requête de modification brute
await prisma.$executeRaw`
  UPDATE users SET last_login = NOW() WHERE id = ${userId}
`
```

---

## Prisma Studio

### Lancement
```bash
npx prisma studio
```

**Prisma Studio** est une interface graphique qui s'ouvre dans votre navigateur (généralement sur `http://localhost:5555`).

### Fonctionnalités
- 📊 **Visualisation** des données
- ✏️ **Édition** directe des enregistrements
- 🔍 **Filtrage** et recherche
- 🔗 **Navigation** dans les relations
- 📈 **Statistiques** de base

---

## Optimisations et Performance

### Connection Pooling
```javascript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `${process.env.DATABASE_URL}?connection_limit=10&pool_timeout=20`
    }
  }
})
```

### Requêtes N+1 - Solutions
```javascript
// ❌ Problème N+1
const users = await prisma.user.findMany()
for (const user of users) {
  const posts = await prisma.post.findMany({
    where: { authorId: user.id }
  })
}

// ✅ Solution avec include
const usersWithPosts = await prisma.user.findMany({
  include: { posts: true }
})

// ✅ Solution avec select optimisé
const usersWithPostTitles = await prisma.user.findMany({
  select: {
    name: true,
    posts: {
      select: { title: true }
    }
  }
})
```

### Indexes Personnalisés
```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  createdAt DateTime @default(now())
  authorId  Int
  
  @@index([authorId, createdAt])  // Index composite
  @@index([title])               // Index simple
  @@fulltext([title, content])   // Index full-text (MySQL)
}
```

---

## Cas d'Usage Pratiques

### 1. Blog avec Commentaires
```prisma
model User {
  id       Int       @id @default(autoincrement())
  email    String    @unique
  name     String
  posts    Post[]
  comments Comment[]
}

model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String
  published Boolean   @default(false)
  authorId  Int
  author    User      @relation(fields: [authorId], references: [id])
  comments  Comment[]
  createdAt DateTime  @default(now())
}

model Comment {
  id      Int    @id @default(autoincrement())
  content String
  postId  Int
  post    Post   @relation(fields: [postId], references: [id])
  authorId Int
  author  User   @relation(fields: [authorId], references: [id])
}
```

```javascript
// Créer un post avec commentaires
const blogPost = await prisma.post.create({
  data: {
    title: 'Mon article de blog',
    content: 'Contenu de l\'article...',
    published: true,
    author: {
      connect: { id: 1 }
    },
    comments: {
      create: [
        {
          content: 'Super article !',
          author: { connect: { id: 2 } }
        }
      ]
    }
  },
  include: {
    author: true,
    comments: {
      include: { author: true }
    }
  }
})
```

### 2. E-commerce avec Commandes
```prisma
model Product {
  id          Int         @id @default(autoincrement())
  name        String
  price       Decimal     @db.Decimal(10,2)
  stock       Int
  orderItems  OrderItem[]
}

model Order {
  id         Int         @id @default(autoincrement())
  total      Decimal     @db.Decimal(10,2)
  status     OrderStatus @default(PENDING)
  customerId Int
  customer   User        @relation(fields: [customerId], references: [id])
  items      OrderItem[]
  createdAt  DateTime    @default(now())
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  quantity  Int
  price     Decimal @db.Decimal(10,2)
  productId Int
  product   Product @relation(fields: [productId], references: [id])
  orderId   Int
  order     Order   @relation(fields: [orderId], references: [id])
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

```javascript
// Créer une commande avec plusieurs articles
const order = await prisma.order.create({
  data: {
    customerId: 1,
    status: 'PENDING',
    items: {
      create: [
        {
          productId: 1,
          quantity: 2,
          price: 29.99
        },
        {
          productId: 2,
          quantity: 1,
          price: 49.99
        }
      ]
    },
    total: 109.97
  },
  include: {
    items: {
      include: { product: true }
    }
  }
})
```

### 3. Système de Permissions
```prisma
model User {
  id          Int           @id @default(autoincrement())
  email       String        @unique
  permissions Permission[]
  userRoles   UserRole[]
}

model Role {
  id          Int           @id @default(autoincrement())
  name        String        @unique
  permissions Permission[]
  userRoles   UserRole[]
}

model Permission {
  id     Int    @id @default(autoincrement())
  name   String @unique
  users  User[]
  roles  Role[]
}

model UserRole {
  userId Int
  roleId Int
  user   User @relation(fields: [userId], references: [id])
  role   Role @relation(fields: [roleId], references: [id])
  
  @@id([userId, roleId])
}
```

---

## Conseils et Bonnes Pratiques

### 1. Gestion des Erreurs
```javascript
try {
  const user = await prisma.user.findUnique({
    where: { id: nonExistentId }
  })
  
  if (!user) {
    throw new Error('Utilisateur introuvable')
  }
} catch (error) {
  if (error.code === 'P2002') {
    // Violation de contrainte unique
    console.error('Email déjà utilisé')
  }
  console.error('Erreur Prisma:', error.message)
}
```

### 2. Variables d'Environnement
```env
# Développement
DATABASE_URL="postgresql://dev:dev@localhost:5432/myapp_dev"

# Production
DATABASE_URL="postgresql://prod:prod@prod-server:5432/myapp_prod"

# Test
DATABASE_URL="postgresql://test:test@localhost:5432/myapp_test"
```

### 3. Scripts Package.json
```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

### 4. Seed Data
```javascript
// prisma/seed.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.createMany({
    data: [
      { email: 'admin@exemple.com', name: 'Admin' },
      { email: 'user@exemple.com', name: 'User' }
    ]
  })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
```

---

## Ressources Supplémentaires

### Documentation Officielle
- 🌐 [Prisma Docs](https://www.prisma.io/docs)
- 📚 [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- 🔧 [Client API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

### Outils Utiles
- **Prisma Studio** : Interface graphique
- **Prisma Migrate** : Gestion des migrations
- **Prisma Studio** : Visualisation des données
- **Extensions VSCode** : Syntax highlighting

### Communauté
- 💬 [Discord Prisma](https://pris.ly/discord)
- 🐙 [GitHub Discussions](https://github.com/prisma/prisma/discussions)
- 📖 [Blog Prisma](https://www.prisma.io/blog)

---

## Conclusion

Prisma révolutionne la façon de travailler avec les bases de données en JavaScript/TypeScript. Avec sa syntaxe déclarative, sa type-safety et ses outils intégrés, il permet de développer des applications robustes rapidement.

**Points clés à retenir** :
- Le schema Prisma est le centre de tout
- Les relations sont définies de manière intuitive
- Le client généré offre une API type-safe
- Les migrations sont gérées automatiquement
- Prisma Studio facilite l'exploration des données

Bonne exploration avec Prisma ! 🚀
