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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interests`
--

LOCK TABLES `interests` WRITE;
/*!40000 ALTER TABLE `interests` DISABLE KEYS */;
INSERT INTO `interests` VALUES (6,'angular'),(9,'AWS'),(11,'azure'),(16,'blockchain'),(10,'Cloud'),(2,'interest'),(5,'interest2'),(7,'js'),(14,'linux'),(17,'python'),(15,'raspberry pi'),(18,'react'),(1,'react/native'),(12,'scrum'),(8,'server'),(13,'white hat hacking');
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postcomments`
--

LOCK TABLES `postcomments` WRITE;
/*!40000 ALTER TABLE `postcomments` DISABLE KEYS */;
INSERT INTO `postcomments` VALUES (16,6,1,'hey billy boy','2023-03-03 15:00:31'),(17,8,1,'ah yes i speak latin','2023-03-03 15:00:57'),(18,8,1,'2nd comment!','2023-03-03 15:01:31'),(19,8,1,'3rd comment','2023-03-03 16:43:12');
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'new post!',NULL,'2023-02-27 19:39:46',1,0,1),(2,'small posts are small',NULL,'2023-03-01 11:10:57',2,0,1),(5,'hi im david bowie',NULL,'2023-03-02 19:39:03',8,0,1),(6,'bil','/data/user/1/images/posts/Billy_Russo.jpg','2023-03-02 20:04:48',1,0,1),(7,'nms','/data/user/1/images/posts/nms.jpg','2023-03-03 14:07:32',1,0,1),(8,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin purus felis, maximus vitae suscipit sit amet, sollicitudin a nisl. Integer nunc libero, porta',NULL,'2023-03-03 14:16:41',1,0,1);
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
INSERT INTO `postvotes` VALUES (1,1,0),(2,1,0),(3,1,0),(4,1,0),(5,1,0),(6,1,0),(7,1,0),(8,1,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topten`
--

LOCK TABLES `topten` WRITE;
/*!40000 ALTER TABLE `topten` DISABLE KEYS */;
INSERT INTO `topten` VALUES (7,'Du Lei',9932,1,0),(1,'finn holland',9399,2,0),(9,'Mike Pound',8736,3,0),(4,'Marie Curie',8296,4,0),(8,'David Bowie',7706,5,0),(11,'Elon Musk',6595,6,0),(2,'Alan Turing',6331,7,0),(3,'Ada Lovelace',3458,8,0),(12,'Mark Zuckerberg',1297,9,0),(5,'Yuan Shuai',1108,10,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trendingusers`
--

LOCK TABLES `trendingusers` WRITE;
/*!40000 ALTER TABLE `trendingusers` DISABLE KEYS */;
INSERT INTO `trendingusers` VALUES (7,'Du Lei',9932,1),(1,'finn holland',9399,2),(9,'Mike Pound',8736,3),(4,'Marie Curie',8296,4),(8,'David Bowie',7706,5),(11,'Elon Musk',6595,6),(2,'Alan Turing',6331,7),(3,'Ada Lovelace',3458,8),(12,'Mark Zuckerberg',1297,9),(5,'Yuan Shuai',1108,10),(6,'Nikola Tesla',651,11),(10,'Eduardo Saverin',560,12);
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
INSERT INTO `userinterests` VALUES (1,1),(2,1),(1,2),(2,2),(1,6),(1,8),(1,9),(1,11),(1,12),(1,13),(1,15),(1,16),(1,18);
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
  `project` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
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
INSERT INTO `users` VALUES (1,'finn holland','finn.holland@chamonix.com.au',9399,'chamonix','National Pharmacies','0451107339','/data/user/1/images/profile/carmen.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',1),(2,'Alan Turing','alan.turing@chamonix.com.au',6331,'chamonix',NULL,NULL,'/data/user/2/images/profile/mort.png','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(3,'Ada Lovelace','ada.lovelace@chamonix.com.au',3458,'chamonix',NULL,NULL,'/data/user/3/images/profile/bearded.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(4,'Marie Curie','marie.curie@chamonix.com.au',8296,'chamonix',NULL,NULL,'/data/user/4/images/profile/eggman.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(5,'Yuan Shuai','yuan.shuai@chamonix.com.au',1108,'chamonix',NULL,NULL,'/data/user/5/images/profile/dog.PNG','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(6,'Nikola Tesla','nikola.tesla@chamonix.com.au',651,'chamonix',NULL,NULL,'/data/user/6/images/profile/frog.png','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(7,'Du Lei','du.lei@chamonix.com.au',9932,'chamonix',NULL,NULL,'/data/user/7/images/profile/cat.PNG','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(8,'David Bowie','david.bowie@chamonix.com.au',7706,'chamonix',NULL,NULL,'/data/user/8/images/profile/Duk.png','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(9,'Mike Pound','mike.pound@chamonix.com.au',8736,'chamonix',NULL,NULL,'/data/user/9/images/profile/Dutch.png','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(10,'Eduardo Saverin','eduardo.saverin@chamonix.com.au',560,'chamonix',NULL,NULL,'/data/user/10/images/profile/quigon.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(11,'Elon Musk','elon.musk@chamonix.com.au',6595,'chamonix',NULL,NULL,'/data/user/11/images/profile/elon.PNG','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0),(12,'Mark Zuckerberg','markzuckerberg@facebook.com',1297,'facebook',NULL,NULL,'/data/user/12/images/profile/zucc2.jpg','$2b$10$C7QZ0iZGElOuOF0cGcIZ8eb55wcmZzWntJae7WgsuntT.174VPRR6',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'fromeroad'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `updatetopten` */;
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
/*!50106 CREATE*/ /*!50117 DEFINER=`admin`@`%`*/ /*!50106 EVENT `updatetopten` ON SCHEDULE EVERY 1 HOUR STARTS '2023-01-11 10:00:00' ON COMPLETION PRESERVE ENABLE DO call sp_updatetopten */ ;;
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
CREATE DEFINER=`admin`@`%` PROCEDURE `sp_updatetopten`()
BEGIN
	-- start of the hour get topten
	delete from topten where pos >= 0; ALTER TABLE topten AUTO_INCREMENT = 1;
	insert into topten (userID, name, trendPoints)
	select userID, name, trendpoints from users order by trendpoints desc limit 10;

	-- update topten with difference from previous hour
	update topten as tt
	inner join trendingusers as tu on tt.userID = tu.userID
	set difference = tu.pos - tt.pos
	where tt.pos >= 0
	order by tt.pos;

	-- overwrite and store list of current positions for the new hour
	delete from trendingusers where pos >= 0; ALTER TABLE trendingusers AUTO_INCREMENT = 1;
	insert into trendingusers (userID, name, trendPoints)
	select userID, name, trendpoints from users order by trendpoints desc;
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
CREATE DEFINER=`admin`@`%` PROCEDURE `sp_weeklyreset`()
BEGIN
	UPDATE users
	SET trendPoints = 0
	where userID >= 0;
    
    update posts
    set visible = 0
    where TIMESTAMPDIFF(day, createdAt, NOW()) < 7 and posts.postID > 0;
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

-- Dump completed on 2023-03-03 17:24:18
