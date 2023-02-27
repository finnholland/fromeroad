-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: fromeroad
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `interests`
--

DROP TABLE IF EXISTS `interests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interests` (
  `interestID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`interestID`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interests`
--

LOCK TABLES `interests` WRITE;
/*!40000 ALTER TABLE `interests` DISABLE KEYS */;
INSERT INTO `interests` VALUES (2,'interest'),(5,'interest2'),(1,'react/native');
/*!40000 ALTER TABLE `interests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postcomments`
--

DROP TABLE IF EXISTS `postcomments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `postcomments` (
  `commentID` int NOT NULL AUTO_INCREMENT,
  `postID` int NOT NULL,
  `userID` int NOT NULL,
  `body` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`commentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postcomments`
--

LOCK TABLES `postcomments` WRITE;
/*!40000 ALTER TABLE `postcomments` DISABLE KEYS */;
/*!40000 ALTER TABLE `postcomments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `postID` int NOT NULL AUTO_INCREMENT,
  `body` varchar(255) NOT NULL,
  `postImageUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `userID` int NOT NULL,
  `trendPoints` int NOT NULL DEFAULT '0',
  `visible` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`postID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postvotes`
--

DROP TABLE IF EXISTS `postvotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `postvotes` (
  `postID` int NOT NULL,
  `userID` int NOT NULL,
  `vote` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`postID`,`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postvotes`
--

LOCK TABLES `postvotes` WRITE;
/*!40000 ALTER TABLE `postvotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `postvotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topten`
--

DROP TABLE IF EXISTS `topten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topten` (
  `userID` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `trendPoints` int NOT NULL,
  `pos` int NOT NULL AUTO_INCREMENT,
  `difference` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`pos`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topten`
--

LOCK TABLES `topten` WRITE;
/*!40000 ALTER TABLE `topten` DISABLE KEYS */;
/*!40000 ALTER TABLE `topten` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trendingusers`
--

DROP TABLE IF EXISTS `trendingusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trendingusers` (
  `userID` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `trendPoints` int DEFAULT NULL,
  `pos` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`pos`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trendingusers`
--

LOCK TABLES `trendingusers` WRITE;
/*!40000 ALTER TABLE `trendingusers` DISABLE KEYS */;
INSERT INTO `trendingusers` VALUES (1,'finn holland',10192082,1),(2,'Alan Turing',10192082,2),(3,'Ada Lovelace',10192082,3),(4,'Marie Curie',10192082,4),(5,'Yuan Shuai',10192082,5),(6,'Nikola Tesla',10192082,6),(7,'Du Lei',10192082,7),(8,'David Bowie',10192082,8),(9,'Mike Pound',10192082,9),(10,'Eduardo Saverin',10192082,10),(11,'Elon Musk',10192082,11),(12,'Mark Zuckerberg',10192082,12);
/*!40000 ALTER TABLE `trendingusers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userinterests`
--

DROP TABLE IF EXISTS `userinterests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userinterests` (
  `userID` int NOT NULL,
  `interestID` int NOT NULL,
  PRIMARY KEY (`userID`,`interestID`),
  KEY `interestID` (`interestID`),
  CONSTRAINT `userinterests_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userinterests_ibfk_2` FOREIGN KEY (`interestID`) REFERENCES `interests` (`interestID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userinterests`
--

LOCK TABLES `userinterests` WRITE;
/*!40000 ALTER TABLE `userinterests` DISABLE KEYS */;
/*!40000 ALTER TABLE `userinterests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userposts`
--

DROP TABLE IF EXISTS `userposts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userposts` (
  `userID` int NOT NULL,
  `postID` int NOT NULL,
  PRIMARY KEY (`userID`,`postID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userposts`
--

LOCK TABLES `userposts` WRITE;
/*!40000 ALTER TABLE `userposts` DISABLE KEYS */;
INSERT INTO `userposts` VALUES (2,1);
/*!40000 ALTER TABLE `userposts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `trendPoints` int NOT NULL DEFAULT '0',
  `company` varchar(255) DEFAULT NULL,
  `profileImageUrl` varchar(255) DEFAULT '/images/default/default_profile_image.jpg',
  `password` varchar(255) NOT NULL,
  `verified` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'finn holland','finn.holland@chamonix.com.au',10192082,'chamonix','/data/user/1/images/profile/carmen.jpg','$2b$10$0jmXWLqRdqpsxKolPKhYQe8/isCRdzszoiA.iC8OPDuFsrZSLg6hO',1),(2,'Alan Turing','alan.turing@chamonix.com.au',10192082,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(3,'Ada Lovelace','ada.lovelace@chamonix.com.au',10192082,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(4,'Marie Curie','marie.curie@chamonix.com.au',10192082,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(5,'Yuan Shuai','yuan.shuai@chamonix.com.au',10192082,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(6,'Nikola Tesla','nikola.tesla@chamonix.com.au',10192082,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(7,'Du Lei','du.lei@chamonix.com.au',10192082,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(8,'David Bowie','david.bowie@chamonix.com.au',10192082,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(9,'Mike Pound','mike.pound@chamonix.com.au',10192082,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(10,'Eduardo Saverin','eduardo.saverin@chamonix.com.au',10192082,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(11,'Elon Musk','elon.musk@chamonix.com.au',10192082,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(12,'Mark Zuckerberg','markzuckerberg@facebook.com',10192082,'facebook','/images/1/carmen.jpg','$2b$10$0m8pXoxQPc5f9SCz.o.d..k4hrN8fd9A2KjBDOJj4JEPT8vVEHdLO',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-27 15:52:51
