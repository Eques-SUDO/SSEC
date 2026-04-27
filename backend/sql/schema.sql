-- SSEC schema (MySQL 8+, InnoDB, utf8mb4)

CREATE DATABASE IF NOT EXISTS ssec
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE ssec;

CREATE TABLE IF NOT EXISTS employee (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom           VARCHAR(80)  NOT NULL,
  prenom        VARCHAR(80)  NOT NULL,
  email         VARCHAR(180) NOT NULL,
  password      VARCHAR(255) NOT NULL,
  telephone     VARCHAR(30)  DEFAULT NULL,
  role          ENUM('direction','employe','admin_it') NOT NULL DEFAULT 'employe',
  date_embauche DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  statut        ENUM('actif','inactif','suspendu')     NOT NULL DEFAULT 'actif',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_employee_email (email),
  KEY idx_employee_role_statut (role, statut)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS client (
  id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom       VARCHAR(120) NOT NULL,
  telephone VARCHAR(30)  DEFAULT NULL,
  adresse   VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inventaire (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nom_produit    VARCHAR(150) NOT NULL,
  description    TEXT,
  prix           DECIMAL(10,2) NOT NULL,
  quantite_stock INT NOT NULL DEFAULT 0,
  seuil_alerte   INT NOT NULL DEFAULT 0,
  categorie      VARCHAR(80) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY idx_inventaire_cat (categorie),
  KEY idx_inventaire_stock (quantite_stock)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS commande (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  client_id      INT UNSIGNED NOT NULL,
  employee_id    INT UNSIGNED NOT NULL,
  date_commande  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  statut         ENUM('en_attente','validee','expediee','livree','annulee') NOT NULL DEFAULT 'en_attente',
  total          DECIMAL(12,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_commande_client (client_id),
  KEY idx_commande_employee (employee_id),
  KEY idx_commande_date_statut (date_commande, statut),
  CONSTRAINT fk_commande_client   FOREIGN KEY (client_id)   REFERENCES client(id)   ON DELETE RESTRICT,
  CONSTRAINT fk_commande_employee FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS commande_detail (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  commande_id   INT UNSIGNED NOT NULL,
  inventaire_id INT UNSIGNED NOT NULL,
  quantite      INT NOT NULL,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_cd_commande (commande_id),
  KEY idx_cd_inventaire (inventaire_id),
  CONSTRAINT fk_cd_commande   FOREIGN KEY (commande_id)   REFERENCES commande(id)   ON DELETE CASCADE,
  CONSTRAINT fk_cd_inventaire FOREIGN KEY (inventaire_id) REFERENCES inventaire(id) ON DELETE RESTRICT
) ENGINE=InnoDB;
