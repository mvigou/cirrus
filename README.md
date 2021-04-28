# cirrus

Un cirrus est un type de **nuage** ayant hérité son nom latin de la forme qu'il rappelle, celle d'une boucle de cheveux. Au-delà de l'aspect poétique, cirrus est l'acronyme idéal du projet de **Cloud Intègre, Responsable et Résilient pour Utilisateurs Sagaces** porté par [Awebsome](https://awebsome.fr).

## Pourquoi ?

La démocratisation du cloud soulève certaines interrogations :

* Qui accède aux données que je mets en ligne ?
* Comment surveille-t-on mon utilisation de ces données ?
* Avec quel impact sur l'environnement ?

Il existe des alternatives où le respect de votre vie privée est pris en considération. Leurs applications ont un défaut que cirrus ne partage pas : leur manque de **sobriété numérique**.

## Pour qui ?

L'utilisation d'un cloud est dans tous les cas polluant, donc **si vous pouvez vous en passer, faites-le**. Dans le cas contraire, cirrus est destiné aux **U**tilisateurs **S**agaces souhaitant :
* Disposer d'une solution de **C**loud en adéquation avec leurs convictions. 
* Être seuls concernés par les données qu'ils hébergent et l'utilisation qui en est faite (**I**ntègre).
* Maîtriser la consommation en données et en énergie du service en lui-même (**R**esponsable).
* Rester autonomes et (auto) héberger eux-même un service facilement maintenable, car sans dépendances ni base de données (**R**ésilient).

## Exigences techniques

### Côté serveur

* Un hébergement web (ou local) reposant sur un serveur Apache. **Important** : La plupart des fournisseurs d'hébergements mutualisés plafonnent la taille et le nombre de fichiers qu'il est possible de mettre en ligne simultanément. Orientez vos recherches du côté des valeurs de configuration PHP *upload_max_filesize* et *post_max_size* associées à votre prestataire si vous rencontrez des problèmes pour mettre en ligne vos documents alors qu'aucun message d'erreur n'apparaît à l'écran (note : chez OVH, les limites semblent respectivement être de 128 et 130 MO).
* PHP version 7 ou plus.

### Côté client

* Un navigateur web moderne tel que Mozilla Firefox, Google Chrome où l'un de ses dérivés.
* JavaScript (activé par défaut sur la plupart des navigateurs web modernes).
* L'API LocalStorage (disponible et activée par défaut sur la plupart des navigateurs cités plus haut).

## Installation

Pour installer cirrus :
* Téléchargez et décompressez l'archive sur votre serveur (à la racine, ou ailleurs).
* Atteignez le point d'entrée depuis votre navigateur web. Il vous sera alors proposé de créer le premier compte utilisateur (compte de type Propriétaire).
* C'est tout : identifiez-vous ; vous pouvez désormais utiliser cirrus.

Pour créer des comptes supplémentaires, rendez-vous sur /pages/admin après vous être identifié en tant que propriétaire pour accéder au panneau d'administration. 

## Fonctionnalités

Note: cette liste tient également lieu de feuille de route partielle ; la fonctionnalité décrite est alors précédée de la mention (TODO).

### Explorateur

* (TODO) Afficher plus d'informations sur les fichiers et dossiers (taille, type, nb d'enfants...).
* (TODO) Ordre de tri à préciser.
* Accès rapide aux dossiers parents grâce à un arbre d'arborescence.
* Navigation dans l'arborescence des dossiers.
* Purge la corbeille.
* Recherche en temps réel dans le dossier courant.
* Compteurs d'éléments du dossier courant.
* Sélection du dossier racine (content, recycle).

### Opérations sur les dossiers

* (TODO) Copie.
* (TODO) Mettre en ligne un ou plusieurs dossiers à la fois.
* Accès au contenu.
* Création groupée.
* Création simple.
* Déplacement via drag n drop.
* Renommage.
* Suppression définitive (depuis corbeille).
* Suppression vers corbeille (renommage automatique du contenu si nécessaire pour éviter l'écrasement de dossiers de même nom).
* Téléchargement (format compressé Zip).

### Opérations sur les fichiers

* (TODO) Améliorer le support des documents en prévisualisation.
* Copie via drag n drop.
* Déplacement via drag n drop.
* Mise en ligne groupée.
* Mise en ligne simple.
* Prévisualisation des fichiers de type image et pdf dans l'onglet courant.
* Prévisualisation.
* Renommage automatique à la mise en ligne en cas de doublon pour prévenir les écrasements.
* Renommage.
* Suppression définitive (depuis corbeille).
* Suppression vers corbeille (renommage automatique du contenu si nécessaire pour éviter l'écrasement de fichiers de même nom).
* Téléchargement.

### Opérations d'administration

* (TODO) Suppression de comptes (action propriétaire)
* Création autonome de comptes utilisateur de type "visualiseur" sur invitation.
* Création autonome de comptes utilisateur de type "éditeur" sur invitation.
* Création d'un compte "propriétaire" automatique à l'installation. 
* Création et suppression de liens d'inscription utilisateur the type "visualiseur".
* Création et suppression de liens d'inscription utilisateur the type "éditeur".
* Lister les comptes existants.

### Sécurité

* (TODO) Bloquer l'exécution de certains types de fichiers mis en ligne (PHP, par exemple). 
* Accès direct au contenu via URL impossible (protégé via .htaccess / hors dossier "datas/temp").
* Accès utilisateur authentifié restreint aux dossiers "datas/content" et "datas/recycle". 
* Accès utilisateur soumis à authentification préalable.
* Options d'édition disponibles relatives au rôle utilisateur (limitations côté client et vérifiées côté serveur). 
* Purge automatique du dossier temporaire dès que 10 dossiers temporaires ont été générés.
* Purge automatique du dossier temporaire à chaque authentification réussie.

### Divers

* (TODO) Alerte de nouveau contenu pour rafraichissement chez les différents utilisateurs connectés en même temps ?
* (TODO) Intégrer une gestion de license ? (limitation des fonctionnalité ? Message toutes les X actions ?)
* (TODO) Journaliser les erreurs de connexion.
* (TODO) Mettre en place une purge automatique du journal d'erreur.
* (TODO) Mise en cache à voir / Service worker ?
* Actions dites "dangereuses" gérées de façon novatrice (maintien du clic / de la pression).
* Journalisation des erreurs dans un fichier dédié (à améliorer).
* Suivi de la progression de mise en ligne de fichier(s).
* Thème clair / Thème sombre.