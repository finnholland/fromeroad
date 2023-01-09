-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: fromeroad
-- ------------------------------------------------------
-- Server version	8.0.31

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
  `trendPoints` varchar(255) NOT NULL DEFAULT '0',
  `company` varchar(255) DEFAULT NULL,
  `profileImageUrl` varchar(255) DEFAULT '/images/default/default_profile_image.jpg',
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'finn holland','finnholland@chamonix.com.au','1','chamonix','/images/1/carmen.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6'),(2,'finn holland','finn.holland@chamonix.com.au','0','chamonix','/images/user/2/Belle.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6'),(3,'Ada Lovelace','ada.lovelace@chamonix.com.au','33','chamonix','/images/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6'),(4,'Marie Curie','marie.curie@chamonix.com.au','3','chamonix','/images/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6'),(5,'Yuan Shuai','yuan.shuai@chamonix.com.au','55','chamonix','/images/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6'),(6,'Nikola Tesla','nikola.tesla@chamonix.com.au','78','chamonix','/images/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6'),(7,'Du Lei','du.lei@chamonix.com.au','54','chamonix','/images/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6'),(8,'David Bowie','david.bowie@chamonix.com.au','27','chamonix','/images/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6'),(9,'Mike Pound','mike.pound@chamonix.com.au','29','chamonix','/images/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6'),(10,'Eduardo Saverin','eduardo.saverin@chamonix.com.au','17','chamonix','/images/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6'),(11,'Elon Musk','elon.musk@chamonix.com.au','26','chamonix','/images/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6'),(12,'Alan Turing','alan.turing@chamonix.com.au','10','chamonix','/images/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6');
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

-- Dump completed on 2023-01-09 21:50:44
