class TranslationsController < ApplicationController

  def index
    if params[:lang] == 'fr'
      translation = {
        VIEW_AS: "Voir comme",
        NEW_NODE_LABEL: "Nouveau",
        SEVERE_ERROR: "Nous avons detectés un problème avec votre application. Contactez-nous s'il vous plait.",
        DRAG_NODE_F: 'Il est interdit de glisser un noeud sur un noeud qui contient des chapitres',
        DRAG_NODE: 'Impossible de glisser ce noeud',
        TITLE: "Unisphere - Echange de documents pour les établissements d'éducation supérieur",
        DESCRIPTION: "Unisphere est une application web d'échange de documents pour les établissements d'enseignement supérieur. Elle vous fournit les outils necessaire pour améliorer les méthodes d'éducation collaboratives.",
        KEYWORDS: "Unisphere,unisphere,file sharing,university",
        HELP: 'Aide',
        DROP: 'Déposez vos fichiers',
        ERROR: 'Erreur',
        ADMINISTRATOR: 'Administrateur',
        VALIDATE: 'Valider',
        ADMIN_LOGIN: 'Connection administrateur',
        NEW_SUBJECT: "Aucun document n'a été mis en ligne",
        LEFT_TREE_EXPLANATION: 'Vous pouvez importer directement vos fichiers et les organiser dans des chapitres.',
        UPLOAD: 'Nouveau fichier',
        CHAPTER: 'Nouveau chapitre',
        DROP_ZONE: 'DROP ZONE',
        DROP_EXPLANATION: "Vous pouvez importer des dossiers contenants d'autres dossiers.",
        DROP_COMMENT: "Vous pouvez glisser des fichiers dans cette zone ",
        COLLAPSE: 'Réduire',
        DASHBOARD: 'Statistiques',
        HOME: 'Home',
        ACCOUNT: 'Compte',
        SIGNOUT: 'Déconnexion',
        LEFT_STATISTICS: 'Vos statistiques: consultations dans',
        RIGHT_STATISTICS: 'statistiques',
        NEW_NODE: " est un nouveau noeud",
        NO_DOWNLOADS: "Il n'y a pas encore de documents",
        NEW_ORGA: ' est une nouvelle organisation',
        WAIT: 'Attendez une semaine pour visualiser des données',
        PROFIL: 'Profil',
        NAME: 'Nom Prénom',
        EMAIL: 'Email',
        UPDATE_PROFIL: 'Modifier profil',
        ORGANIZATION: 'Organisation',
        NEW_LECTURER: 'Nouvel enseignant (email)',
        INVITE: 'Inviter un enseignant',
        PASSWORD: 'Mot de passe',
        OLD_PSW: 'Ancien mot de passe',
        NEW_PSW: 'Nouveau mot de passe',
        CONFIRM_PSW: 'Confirmation du mot de passe',
        UPDATE_PSW: 'Modifier mot de passe',
        USERS_INVITED: 'Utilisateurs ajoutés',
        TIP_CHROME: 'Cliquez glissez vos documents ou dossiers!',
        TIP: 'Cliquez glissez des documents! (dossiers sous Chrome)',
        LENGTH: 'Au minimum 6 charactères',
        SECURITY: 'Sécurité',
        SHORT: 'trop court',
        LECTURERS: 'Enseignants',
        SELECT_LEAF: "Sélectionnez une extrémité de l'arbre",
        DROP_FILE: "Importez vos données",
        WHERE_DROP: "Où souhaitez-vous les importer?",
        ROOT: "0. Racine",
        CANCEL: "Annuler",
        NODE_LOCKED: "Ce noeud est verrouillé. Le téléchargement des fichiers est protégé par un mot de passe.",
        NODE_UNLOCKED: "Ce noeud est déverrouillé. N'importe quel étudiant peut télécharger ses fichiers.",
        POPUP_VIEW_FILE: 'Ouvrir un fichier',
        POPUP_VIEW_FILE_CHOICES: 'Vous pouvez télécharger ou ouvrir un aperçu du fichier',
        POPUP_VIEW_DL: 'Télécharger fichier',
        POPUP_VIEW_PW: 'Aperçu fichier',
        POPUP_DELETE_NODE: 'Détruit le noeud ',
        POPUP_DELETE_CHAPTER: 'Détruit le chapitre',
        POPUP_DELETE_CHAPTER_CONTENT: 'Détruit son contenu',
        POPUP_DELETE_CHAPTER_TRANSFER: 'Transferer son contenu au noeud précédent',
        PSW_FORGOTTEN: 'Mot de passe oublié',
        SIGN_UP: 'Inscription',
        SIGN_UP_U: 'Inscription à Unisphere',
        SEND_EMAIL: 'Envoyer',
        LEFT_STATISTICS_MSG: 'Vos statistiques',
        NEW_NODE_MSG: "Vous n'avez pas de noeuds",
        EDIT_PSW: "Modifier mot de passe",
        POPUP_DELETE_0: 'Supprimer ',
        POPUP_DELETE_1: 'Supprimer le noeud et son contenu.',
        POPUP_DELETE_2: 'Supprimer le noeud et son contenu ou le supprimer',
        POPUP_DELETE_3: 'et transférer son contenu dans le noeud précédent.',
        POPUP_DELETE_4: 'Supprimer le noeud',
        POPUP_DELETE_5: 'Supprimer & transférer',
        SET_PSW_FOR: 'Nouveau mot de passe pour ',
        SET_PSW: 'Nouveau mot de passe',
        POPUP_LOCK: 'Noeud sécurisé. Entrez le mot de passe pour y accéder.',
        ACCESS: 'Accéder',
        RENAME_SPACE: 'Renommer ',
        RENAME: 'Renommer',
        HINT: 'Le nom du noeud doit contenir moins de 20 charactères',
        SHARE: 'Partager ',
        COPY: 'Astuce: Copier ',
        WEB_WELCOME_COMMENT: "Un outil de travail collaboratif pour les établissements d'enseignement supérieur",
        WEB_SEPARATION_BANNER: "Unisphere propose des outils de travail collaboratif et d'échange de documents",
        WEB_FEATURE_1: 'Collaborez',
        WEB_FEATURE_2: 'La navigation entre les classes et les matières est simple et efficace.',
        WEB_FEATURE_3: 'Tous les étudiants et tous les enseignants partagent le même arbre des matières.',
        WEB_FEATURE_4: 'Partagez',
        WEB_FEATURE_5: 'Importez vos documents, organisez-les dans des chapitres, partagez vos connaissances.',
        WEB_FEATURE_6: 'Analysez',
        WEB_FEATURE_7: "Suivez l'utilisation de vos documents par vos étudiants. Analysez et adaptez vos cours.",
        WEB_FEATURE_8: 'http://votre-universite.unisphere.eu',
        WEB_FEATURE_9: 'Installation simple',
        WEB_FEATURE_10: "Vous souhaitez changer de plateforme pédagogique ou avoir plus d'informations?",
        WEB_FEATURE_11: "Contactez-nous, nous trouverons ensemble la solution adaptée à vos besoins.",
        WEB_UNIVERSITY_BANNER_1: "Des centaines d'étudiants et d'enseignants utilisent déjà Unisphere",
        WEB_CONTACT_1: 'Contactez-nous',
        WEB_CONTACT_2: 'Envoyez',
        NS_CONTACT_REQUEST: "Thanks for contacting us. We will answer you soon.",
        NE_CONTACT_REQUEST: "Can you please refresh the page, there was an error",
        NE_DOWNLOAD: "Une erreur est survenue, recharger la page, merci.",
        NS_UPLOAD: " importé",
        NE_UPLOAD: " n'a pas pu être importé. Recharger la page, merci.",
        NW_UPLOAD: " n'a pas pu être importé. Un de vos collègues a supprimer le noeud sélectionné.",
        NS_CHAPTER: "Chapitre créé",
        NE_CHAPTER: "Erreur lors de la création du chapitre ",
        NW_CHAPTER: 'Création du chapitre annulée. Un de vos collègues a supprimer le noeud sélectionné.',
        TUTO_1: "Ce menu vous permet d'accéder à l'espace d'échange, vos statistiques et vos réglages.",
        TUTO_2: "Vous pouvez protéger vos documents à l'aide d'un mot de passe",
        TUTO_3: "Cette zone contient les données du noeud sélectionné. Vous pouvez importer des fichiers, créer des chapitres, partager des contenus à l'aide d'un lien et cliquer glisser des documents (dossier sur Google Chrome!).",
        TUTO_4: "Ces boutons vous permettent de créer des sous-chapitres et d'importer des documents dans le chapitre séléctionné.",
        TUTO_5: "Cette zone représente votre établissement sous la forme d'un arbre. C'est un espace commun à tous les enseignants. A chaque extrémité de l'arbre est associée un gestionnaire de données.",
        NE_EMAIL: "Cette adresse n'est pas référencée dans votre établissement",
        NW_RENAME: "Ce nom est trop long",
        PSW_UPDATE: "Ce mot de passe est trop court",
        PSW_INPUTS_ERROR: 'Les mots de passe ne coincident pas',
        NE_PSW: "Votre mot de passe est incorrect",
        REQUEST_SUCCESS: "Merci de nous avoir contacté. Nous allons vous répondre rapidement",
        CHROME_ERROR: "Vous ne pouvez importer des dossiers que sur Google Chrome",
        NW_CANCEL: 'Action annulée. Un de vos collègues vient de supprimer ce noeud',
        ERROR: "Merci de recharger la page, une erreur est survenue",
        SUCCESS: "Action réalisée avec succès",
        NE_SIZE: "Les données ne doivent pas excéder 20MB",
        FORBIDDEN: "Vous n'avez pas accès à cette action",
        PSW_RESETED: "Mot de passe réinitialiser, vérifiez vos emails",
        SIGNUP_REQUEST: "Demandez à un de vos collègues de vous inviter",
        EMAIL_ERROR_SIGNIN: 'Notre adresse email est incorrect',
        VALID_BOTH: 'Entrez une adresse ou un nom valide',
        VALID_EMAIL: 'Entrez une adresse valide',
        VALID_NAME: 'Entrez un nom valide',
        REGISTERED_USER: " utilise déjà Unisphere",
        DD_SHARE: 'Partager',
        DD_PSW: 'Editer mot de passe',
        DD_RENAME: 'Renommer',
        DD_DESTROY: 'Supprimer',
        DD_DOWNLOAD: 'Télécharger',
        NEW_CHAPTER_NAME: 'Nouveau chapitre',
        WEB_TEST_VERSION: 'Ceci est une version test, essayez-la!',
        MOVE: 'Impossible de déplacer cet item.'
      }
    else
      translation = {
        VIEW_AS: "View as",
        NEW_NODE_LABEL: "New",
        SEVERE_ERROR: "We detected a severe error, please contact us!",
        DRAG_NODE_F: 'It is forbidden to drop a node on a node containing chapters',
        DRAG_NODE: 'Impossible to drag this node',
        TITLE: 'Unisphere - File sharing for educational institutions',
        DESCRIPTION: 'Unisphere is a file sharing solution within educational institutions. We provide you with the tools to bring collaborative teaching methods to the next level.',
        KEYWORDS: "Unisphere,unisphere,lycée,école,universitée,échange de documents,collaboration",
        HELP: 'Help',
        DROP: 'Drop zone',
        ERROR: 'Error',
        ADMINISTRATOR: 'Administrator',
        VALIDATE: 'Validate',
        ADMIN_LOGIN: 'Log in as administrator',
        NEW_SUBJECT: 'No document has been uploaded',
        LEFT_TREE_EXPLANATION: 'You can directy upload your files and organise them into chapters.',
        UPLOAD: 'New file upload',
        CHAPTER: 'New course folder',
        DROP_ZONE: 'DROP ZONE',
        DROP_EXPLANATION: 'Tip:  You can even drop folders containing folders',
        DROP_COMMENT: "You can drag & drop files ",
        COLLAPSE: 'Collapse',
        DASHBOARD: 'Dashboard',
        HOME: 'Home',
        ACCOUNT: 'Account',
        SIGNOUT: 'Sign out',
        LEFT_STATISTICS: 'Your statistics: downloads in',
        RIGHT_STATISTICS: 'statistics',
        NEW_NODE: ' is a new node',
        NO_DOWNLOADS: 'There is no downloads yet',
        NEW_ORGA: ' is a new organization',
        WAIT: 'Wait one week for statistics',
        PROFIL: 'Profile',
        NAME: 'Name',
        EMAIL: 'Email',
        UPDATE_PROFIL: 'Update profil',
        ORGANIZATION: 'Organization',
        NEW_LECTURER: 'New lecturer',
        INVITE: 'Invite',
        PASSWORD: 'Password',
        OLD_PSW: 'Old Password',
        NEW_PSW: 'New Password',
        CONFIRM_PSW: 'Confirm password',
        UPDATE_PSW: 'Update password',
        USERS_INVITED: 'Lecturers to add',
        TIP_CHROME: 'Tip: You can drag & drop files and folders!',
        TIP: 'Tip: You can drag & drop files! (folder on Chrome)',
        LENGTH: 'At least 6 characters',
        SECURITY: 'Security',
        SHORT: 'too short',
        LECTURERS: 'Lecturers',
        SELECT_LEAF: 'Select a leaf node',
        DROP_FILE: "Upload data",
        WHERE_DROP: "Where do you want to drop your data?",
        ROOT: "0. Root",
        CANCEL: "Cancel",
        NODE_LOCKED: "This node is locked. File downloads is protected by a password.",
        NODE_UNLOCKED: "This node is unlocked. Anyone can download its content.",
        POPUP_VIEW_FILE: 'View a file',
        POPUP_VIEW_FILE_CHOICES: 'You can choose to download the file or to preview it.',
        POPUP_VIEW_DL: 'Download the file',
        POPUP_VIEW_PW: 'Preview the file',
        POPUP_DELETE_NODE: 'Delete the node ',
        POPUP_DELETE_CHAPTER: 'Delete the chapter',
        POPUP_DELETE_CHAPTER_CONTENT: 'Delete all its content',
        POPUP_DELETE_CHAPTER_TRANSFER: 'Transfer content to previous node',
        PSW_FORGOTTEN: 'Password forgotten',
        SIGN_UP: 'Sign up',
        SIGN_UP_U: 'Sign up to Unisphere',
        SEND_EMAIL: 'Send',
        LEFT_STATISTICS_MSG: 'Your statistics',
        NEW_NODE_MSG: "You don't have any nodes",
        EDIT_PSW: "Edit password",
        POPUP_DELETE_0: 'Delete ',
        POPUP_DELETE_1: 'Delete the node and all its content.',
        POPUP_DELETE_2: 'You can either completly delete the node or delete it',
        POPUP_DELETE_3: 'and transfer its content to the previous node.',
        POPUP_DELETE_4: 'Delete the node',
        POPUP_DELETE_5: 'Delete & transfer',
        SET_PSW_FOR: 'Set password for ',
        SET_PSW: 'Set password',
        POPUP_LOCK: 'This node is protected. Enter your password to unlock it',
        ACCESS: 'Access',
        RENAME_SPACE: 'Rename ',
        RENAME: 'Rename',
        HINT: 'Hint: Your node name most be less than 20 caracters',
        SHARE: 'Share ',
        COPY: 'Hint: Copy ',
        WEB_WELCOME_COMMENT: 'A collaborative workspace for educational institutions',
        WEB_SEPARATION_BANNER: 'Unisphere provides tools for collaborative work and files sharing',
        WEB_FEATURE_1: 'Collaborate',
        WEB_FEATURE_2: 'Navigation between subjects is simple and efficient.',
        WEB_FEATURE_3: 'Everyone and everything is gathered on the subject tree.',
        WEB_FEATURE_4: 'Share',
        WEB_FEATURE_5: 'Upload files. Organise them into chapters. Share your knwoledge.',
        WEB_FEATURE_6: 'Analyse',
        WEB_FEATURE_7: "Keep track of your files usage. Analyse yours students behaviour. Adapt your lessons.",
        WEB_FEATURE_8: 'http://your-university.unisphere.eu',
        WEB_FEATURE_9: 'Deploy',
        WEB_FEATURE_10: 'You want a new learning management system, but you are afraid it might be hard to change.',
        WEB_FEATURE_11: 'Contact us, together we will find a solution to fit your needs.',
        WEB_UNIVERSITY_BANNER_1: 'Hundreds of students and teachers are already using Unisphere.',
        WEB_CONTACT_1: 'Contact us',
        WEB_CONTACT_2: 'Send',
        NS_CONTACT_REQUEST: "Thanks for contacting us. We will answer you soon.",
        NE_CONTACT_REQUEST: "Can you please refresh the page, there was an error",
        NE_DOWNLOAD: "Error while getting download link, please refresh.",
        NS_UPLOAD: " uploaded",
        NE_UPLOAD: " has not been uploaded. Please refresh.",
        NW_UPLOAD: " has not been uploaded. One of your colleague deleted this node",
        NS_CHAPTER: "Chapter created",
        NE_CHAPTER: "Error while creating the chapter ",
        NW_CHAPTER: 'The chapter creation has been cancelled. One of your colleague deleted this node',
        TUTO_1: 'This menu enables you to reach your workspace, your dashboard and your account settings.',
        TUTO_2: "You can protect your data with a password.",
        TUTO_3: "This area contains the data contained in the selected node. You can upload files, create chapters, share specific contents, and drag&drop files (folder on Google Chrome!).",
        TUTO_4: "Those buttons enable you to create subchapters and upload files in the selected chapter.",
        TUTO_5: "This area represents your institution as a tree. It is a common worspace for each teachers. A file manager is associated to each end of this tree.",
        NE_EMAIL: "This email is not registered on this organization",
        NW_RENAME: "This name is too long",
        PSW_UPDATE: "This password is too short",
        PSW_INPUTS_ERROR: 'The passwords you typed are not the same',
        NE_PSW: "Your password is incorrect",
        REQUEST_SUCCESS: "Thanks for contacting us. We will answer you soon.",
        CHROME_ERROR: "You can only upload fodlers on Google Chrome",
        NW_CANCEL: 'This action has been cancelled. One of you colleague deleted this node.',
        ERROR: "Can you please refresh the page, there was an error",
        SUCCESS: "Action successfuly realized",
        NE_SIZE: "You cannot upload files larger than 20MB",
        FORBIDDEN: "You don't have access to this action",
        PSW_RESETED: "Password reseted, check your emails",
        SIGNUP_REQUEST: "This function is not yet available. Ask one of your colleage to invite you!",
        EMAIL_ERROR_SIGNIN: 'Your email is incorrect',
        VALID_BOTH: 'Enter either a valid new name or email',
        VALID_EMAIL: 'Enter a valid mail',
        VALID_NAME: 'Enter a valid name',
        REGISTERED_USER: " already uses Unisphere",
        DD_SHARE: 'Share',
        DD_PSW: 'Edit password',
        DD_RENAME: 'Rename',
        DD_DESTROY: 'Remove',
        DD_DOWNLOAD: 'Download',
        NEW_CHAPTER_NAME: 'New chapter',
        WEB_TEST_VERSION: 'This is a live test version, try it!',
        MOVE: 'There was an error while moving this item'
      }
    end
    render json: translation.to_json, status: 200
  end

end
