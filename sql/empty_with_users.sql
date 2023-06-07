-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: fromeroad
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
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `commentId` int NOT NULL AUTO_INCREMENT,
  `postId` int NOT NULL,
  `userId` int NOT NULL,
  `body` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`commentId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `interests`
--

DROP TABLE IF EXISTS `interests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interests` (
  `interestId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`interestId`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `postId` int NOT NULL AUTO_INCREMENT,
  `body` longtext NOT NULL,
  `postImageUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `userId` int NOT NULL,
  `trendPoints` int NOT NULL DEFAULT '0',
  `visible` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `postvotes`
--

DROP TABLE IF EXISTS `postvotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `postvotes` (
  `postId` int NOT NULL,
  `userId` int NOT NULL,
  `vote` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`postId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `resetcodes`
--

DROP TABLE IF EXISTS `resetcodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resetcodes` (
  `codeId` int NOT NULL AUTO_INCREMENT,
  `code` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`codeId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `topten`
--

DROP TABLE IF EXISTS `topten`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topten` (
  `userId` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `trendPoints` int NOT NULL,
  `pos` int NOT NULL AUTO_INCREMENT,
  `difference` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`pos`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trendingusers`
--

DROP TABLE IF EXISTS `trendingusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trendingusers` (
  `userId` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `trendPoints` int DEFAULT NULL,
  `pos` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`pos`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userinterests`
--

DROP TABLE IF EXISTS `userinterests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userinterests` (
  `userId` int NOT NULL,
  `interestId` int NOT NULL,
  PRIMARY KEY (`userId`,`interestId`),
  KEY `interestId` (`interestId`),
  CONSTRAINT `userinterests_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userinterests_ibfk_2` FOREIGN KEY (`interestId`) REFERENCES `interests` (`interestId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `trendPoints` int NOT NULL DEFAULT '0',
  `company` varchar(255) DEFAULT NULL,
  `project` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `profileImageUrl` varchar(255) DEFAULT '/data/default/default_profile_image.jpg',
  `password` varchar(255) NOT NULL,
  `verified` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'finn holland','finn.holland@chamonix.com.au',0,'chamonix',null,null,'/data/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',1),(2,'Alan Turing','alan.turing@chamonix.com.au',0,'chamonix',null,null,'/data/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(3,'Ada Lovelace','ada.lovelace@chamonix.com.au',0,'chamonix',null,null,'/data/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(4,'Marie Curie','marie.curie@chamonix.com.au',0,'chamonix',null,null,'/data/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(5,'Yuan Shuai','yuan.shuai@chamonix.com.au',0,'chamonix',null,null,'/data/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(6,'Nikola Tesla','nikola.tesla@chamonix.com.au',0,'chamonix',null,null,'/data/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(7,'Du Lei','du.lei@chamonix.com.au',0,'chamonix',null,null,'/data/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(8,'David Bowie','david.bowie@chamonix.com.au',0,'chamonix',null,null,'/data/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(9,'Mike Pound','mike.pound@chamonix.com.au',0,'chamonix',null,null,'/data/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(10,'Eduardo Saverin','eduardo.saverin@chamonix.com.au',0,'chamonix',null,null,'/data/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(11,'Elon Musk','elon.musk@chamonix.com.au',0,'chamonix',null,null,'/data/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(12,'Mark Zuckerberg','markzuckerberg@facebook.com',0,'facebook',null,null,'/data/default/default_profile_image.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'fromeroad'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `deletecodes` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`fromeroad_admin_%`@`localhost`*/ /*!50106 EVENT `deletecodes` ON SCHEDULE EVERY 1 HOUR STARTS (concat(curdate(), ' 00:00:00')) ON COMPLETION PRESERVE ENABLE DO call sp_deletecodes */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
/*!50106 DROP EVENT IF EXISTS `updatetopten` */;;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`fromeroad_admin_%`@`localhost`*/ /*!50106 EVENT `updatetopten` ON SCHEDULE EVERY 1 HOUR STARTS (concat(curdate(), ' 00:00:00')) ON COMPLETION PRESERVE ENABLE DO call sp_updatetopten */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'fromeroad'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_deletecodes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`fromeroad_admin_%`@`localhost` PROCEDURE `sp_deletecodes`()
BEGIN
	delete from resetcodes where codeId >= 0 and createdAt < DATE_SUB(NOW(),INTERVAL 30 MINUTE);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_updatetopten` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`fromeroad_admin_%`@`localhost` PROCEDURE `sp_updatetopten`()
BEGIN
	-- start of the hour get topten
	delete from topten where pos >= 0; ALTER TABLE topten AUTO_INCREMENT = 1;
	insert into topten (userId, name, trendPoints)
	select userId, name, trendpoints from users order by trendpoints desc limit 10;

	-- update topten with difference from previous hour
	update topten as tt
	inner join trendingusers as tu on tt.userId = tu.userId
	set difference = tu.pos - tt.pos
	where tt.pos >= 0
	order by tt.pos;

	-- overwrite and store list of current positions for the new hour
	delete from trendingusers where pos >= 0; ALTER TABLE trendingusers AUTO_INCREMENT = 1;
	insert into trendingusers (userId, name, trendPoints)
	select userId, name, trendpoints from users order by trendpoints desc;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_weeklyreset` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`fromeroad_admin_%`@`localhost` PROCEDURE `sp_weeklyreset`()
BEGIN
	UPDATE users
	SET trendPoints = 0
	where userId >= 0;
    
    update posts
    set visible = 0
    where TIMESTAMPDIFF(day, createdAt, NOW()) < 7 and posts.postId > 0;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-01 12:04:06
