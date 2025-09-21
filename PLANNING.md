# Planning Document

## 1. Choix des technologies

### Tests

Nous avons testé 3 solutions pour le front-end web, l'application mobile, le back-end et les bases de données. 
Nous avons préféré tester des ORMs pour les bases de données.

| Domaine | Solution n°1 | Solution n°2 | Solution n°3 | Final choice |
|---------|--------------|--------------|--------------|--------------|
| Mobile  | Kotlin       | Flutter      | React Native | React Native |
| Web     | Svelte       | Angular      | NextJS       | NextJS       |
| API     | Fastify      | NestJS       | SpringBoot   | NestJS       |
| ORM     | Prisma       | Drizzle      | MikroORM     | Prisma       |

### Choix final

**Mobile:**
Nous avons choisit React Native car nous avons eu beaucoup de problème lors de l'installation et de la préparation de l'environnement de développement avec Flutter et Kotlin.
Ce qui pourra poser problème si un développeur travaillant sur l'API doit implémenter une fonctionnalité sur le mobile, car il devra lui aussi prendre du temps à préparer l'environnement. 
Nous utilisons également Expo afin de tester l'application. De plus, React Native est très proche de React au niveau de la syntaxe, ce qui renforce notre choix.

**Web:**
Nous avons décidé d'utiliser NextJS car il offre une grande
Nous avons exclus Angular du choix final car tout le groupe sait utiliser React Router + Vite.
Bien que Svelte soit plus rapide que React, nous préférons rester sur React afin de gagner en productivité.
De plus, l'application n'a pas de grosse contrainte technique niveau performances, ce qui renforce notre choix de React + Vite, qui permet de lancer rapidement une application
en plus d'avoir beaucoup de librairies disponibles.

**API:**
Nous avons décidé d'utiliser NestJS pour plusieurs raisons.
- Nous avions déjà utilisé Fastify lors d'un projet précédent et nous nous sommes rapidement rendu compte que pour un gros projet il faut tout faire à la main.
- NestJS a énormément d'outils intégrés, et également une documentation claire.
- NestJS nous force à faire une architecture d'API correcte.
- NestJS a un outil "passport" qui facilite l'implémentation de la librairie passport pour la connexion d'un compte google / spotify / ...
- SprintBoot nécessite l'apprentissage d'un nouveau langage ainsi que l'apprentissage d'un nouveau framework pour certain membre du groupe.

**ORM:**
Nous avons écarté Drizzle et MikroORM de notre choix final. Bien que ces deux solutions puissent être intéressantes dans certains cas spécifiques, elles sont soit moins accessibles, soit plus adaptées à des projets nécessitant des configurations avancées.
Nous avons donc retenu Prisma car il est simple à intégrer, dispose d'une documentation claire et bénéficie d'une communauté active. Pour un projet court où l'apprentissage de nouvelles technologies est déjà un défi, Prisma nous permet de limiter les risques de blocage technique tout en restant productifs. De plus, il facilite la gestion des migrations et du schéma de la base PostgreSQL, offrant un environnement stable et robuste pour le développement.

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
