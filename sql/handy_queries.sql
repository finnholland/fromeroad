DELETE FROM posts WHERE postID >= 0;
DELETE FROM postcomments where commentID >= 0;
ALTER TABLE posts AUTO_INCREMENT = 0;
ALTER TABLE postcomments AUTO_INCREMENT = 0;
DELETE FROM postvotes WHERE postID >= 0;


UPDATE users
SET trendPoints = FLOOR(RAND()*100)
where userID >= 0;
call sp_updatetopten;

USE mysql;
CREATE USER 'nam'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'name'@'%';
FLUSH PRIVILEGES;

-- clear all posts
delete from posts where postID >= 0;
delete from postvotes where postID >= 0;
delete from comments where commentID >= 0;
ALTER TABLE posts AUTO_INCREMENT = 0;
ALTER TABLE comments AUTO_INCREMENT = 0;
select * from posts

delete from interests where interestID >= 0;
delete from userinterests where interestID >= 0;
ALTER TABLE interests AUTO_INCREMENT = 0;
select * from interests