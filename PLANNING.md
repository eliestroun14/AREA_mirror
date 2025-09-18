# Planning Document

## 1. Choix des technologies

### Tests

Nous avons testé 3 solutions pour le front-end web, l'application mobile, le back-end et les bases de données. 
Nous avons préféré tester des ORMs pour les bases de données.

| Domaine | Solution n°1 | Solution n°2 | Solution n°3 | Final choice |
|---------|--------------|--------------|--------------|--------------|
| Mobile  | Kotlin       | Flutter      | React Native | React Native |
| Web     | Svelte       | Angular      | React + Vite | React + Vite |
| API     | Fastify      | NestJS       | SpringBoot   | NestJS       |
| ORM     | Prisma       | Drizzle      | MikroORM     | Prisma       |

### Choix final

**Mobile**
Nous avons choisit React Native car nous avons eu beaucoup de problème lors de l'installation et de la préparation de l'environnement de développement avec Flutter et Kotlin.
Nous utilisons également Expo afin de tester l'application. De plus, React Native est très proche de React au niveau de la syntaxe, ce qui renforce notre choix.

**Web**
Nous avons exclus Angular du choix final car tout le groupe sait utiliser React.
Bien que Svelte soit plus rapide que React, nous préférons rester sur React afin de gagner en productivité.
De plus, l'application n'a pas de grosse contrainte technique niveau performances, ce qui renforce notre choix de React + Vite, qui permet de lancer rapidement une application
en plus d'avoir beaucoup de librairies disponibles.

**API:**
Nous avons décidé d'utiliser NestJS pour deux raisons. 
Tout d'abord, nous avions utilisé Fastify lors d'un projet précédent et nous avons rapidement vu ses limitations : Il faut quasiement tout faire sois-même, contrairement à NestJS qui a énormément d'outils intégrés.
Nous avons également choisi NestJS plutôt que SpringBoot à cause du langage : le groupe sait programmer en TypeScript, mais pas forcément en Java.
C'est pourquoi nous préférons apprendre un nouveau framework au lieu d'avoir à apprendre en plus de cela un nouveau langage.

**ORM:**
Expliquer pourquoi est-ce qu'on a choisit Prisma

### Étude des failles de sécurité

À FAIRE

## 2. Organisation du groupe

Nous avons décidé de travailler avec Notion pour notre organisation de groupe. Nous y avons indiqué la répartition des tâches en fonction des milestones du projet, ainsi que qui travaille sur quelle partie du projet.

**Front-end**
- Aymeric JOUANNET-MIMY *(mobile)*
- Pablo JESUS *(web)*

**Back-end**
- Manech DUBREIL
- Elie STROUN
- Nathan JEANNOT

**DevOps**
- Elie STROUN

## 3. Project planning

Comme dis dans la partie 2, toutes nos tâches se trouvent sur le (notion du projet)[https://www.notion.so/AREA-26f5694c92f6809c8802cb79349dee66?source=copy_link].
