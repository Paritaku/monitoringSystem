-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: 1_ms
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bloc`
--

DROP TABLE IF EXISTS `bloc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bloc` (
  `bloc_id` bigint NOT NULL AUTO_INCREMENT,
  `bloc_date` date DEFAULT NULL,
  `bloc_name` varchar(255) NOT NULL,
  `bloc_statut` varchar(255) DEFAULT NULL,
  `genre_id` bigint DEFAULT NULL,
  PRIMARY KEY (`bloc_id`),
  UNIQUE KEY `UKdo7vyahl6jl0v3eilxcj67qvf` (`bloc_name`),
  KEY `FKjs7r06c3jx5yoyx04wmaddabs` (`genre_id`),
  CONSTRAINT `FKjs7r06c3jx5yoyx04wmaddabs` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`genre_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bloc`
--

LOCK TABLES `bloc` WRITE;
/*!40000 ALTER TABLE `bloc` DISABLE KEYS */;
INSERT INTO `bloc` VALUES (13,'2024-06-12','BLOC001','TERMINE',7),(14,'2024-06-12','BLOC002','EN-COURS',8),(15,'2024-06-12','BLOC003','INITIALISE',1),(16,'2024-06-12','TRANSITION','TERMINE',9);
/*!40000 ALTER TABLE `bloc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genre`
--

DROP TABLE IF EXISTS `genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genre` (
  `genre_id` bigint NOT NULL AUTO_INCREMENT,
  `intitule` varchar(255) NOT NULL,
  PRIMARY KEY (`genre_id`),
  UNIQUE KEY `UKkdktdnm7ybuqy35p581mj1wyk` (`intitule`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genre`
--

LOCK TABLES `genre` WRITE;
/*!40000 ALTER TABLE `genre` DISABLE KEYS */;
INSERT INTO `genre` VALUES (7,'33D'),(8,'ABS'),(1,'DIANA'),(5,'NASSIM'),(2,'OXFORD'),(4,'SOUPER'),(6,'SOUPLEX'),(3,'SPECIAL'),(9,'TRANSITION');
/*!40000 ALTER TABLE `genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produit`
--

DROP TABLE IF EXISTS `produit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produit` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `densite` double NOT NULL,
  `hauteur` double NOT NULL,
  `heure_enregistrement` time DEFAULT NULL,
  `largeur` double NOT NULL,
  `longueur` double NOT NULL,
  `poids` double NOT NULL,
  `bloc_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1sghebcmhmb2b0cwqsef358bq` (`bloc_id`),
  CONSTRAINT `FK1sghebcmhmb2b0cwqsef358bq` FOREIGN KEY (`bloc_id`) REFERENCES `bloc` (`bloc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produit`
--

LOCK TABLES `produit` WRITE;
/*!40000 ALTER TABLE `produit` DISABLE KEYS */;
INSERT INTO `produit` VALUES (26,47.96,47.96,'16:36:18',47.96,47.96,47.96,13),(27,47.96,47.96,'16:36:28',47.96,47.96,47.96,13),(28,47.96,47.96,'16:36:57',47.96,47.96,47.96,16),(29,47.96,47.96,'16:37:16',47.96,47.96,47.96,14),(30,20,20,'16:38:59',20,20,20,14),(31,96,96,'16:42:18',96,96,96,14),(32,65,65,'16:42:36',65,65,65,14),(33,63,63,'16:44:50',63,63,63,14),(34,45,45,'16:45:08',45,45,45,14);
/*!40000 ALTER TABLE `produit` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-27  9:54:28
