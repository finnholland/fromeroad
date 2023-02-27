-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: fromeroad
-- ------------------------------------------------------
-- Server version	8.0.32

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
INSERT INTO `users` VALUES (1,'finn holland','finn.holland@chamonix.com.au',0,'chamonix','/data/user/1/images/profile/carmen.jpg','$2b$10$0jmXWLqRdqpsxKolPKhYQe8/isCRdzszoiA.iC8OPDuFsrZSLg6hO',1),(2,'Alan Turing','alan.turing@chamonix.com.au',0,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(3,'Ada Lovelace','ada.lovelace@chamonix.com.au',0,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(4,'Marie Curie','marie.curie@chamonix.com.au',0,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(5,'Yuan Shuai','yuan.shuai@chamonix.com.au',0,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(6,'Nikola Tesla','nikola.tesla@chamonix.com.au',0,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(7,'Du Lei','du.lei@chamonix.com.au',0,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(8,'David Bowie','david.bowie@chamonix.com.au',0,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(9,'Mike Pound','mike.pound@chamonix.com.au',0,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(10,'Eduardo Saverin','eduardo.saverin@chamonix.com.au',0,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(11,'Elon Musk','elon.musk@chamonix.com.au',0,'chamonix','/data/default/default_profile_image.jpg','$2b$10$d/YpYeFK90/oJf7kSK7Y7uLSqbX4aTPfA/noJJMZt.C.CAMk6JoMW',0),(12,'Mark Zuckerberg','markzuckerberg@facebook.com',0,'facebook','/images/1/carmen.jpg','$2b$10$0m8pXoxQPc5f9SCz.o.d..k4hrN8fd9A2KjBDOJj4JEPT8vVEHdLO',0);
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

-- Dump completed on 2023-02-23 17:00:25
