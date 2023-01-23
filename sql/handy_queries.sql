DELETE FROM posts WHERE postID >= 0;
DELETE FROM postcomments where commentID >= 0;
ALTER TABLE posts AUTO_INCREMENT = 0;
ALTER TABLE postcomments AUTO_INCREMENT = 0;
DELETE FROM postvotes WHERE postID >= 0;


UPDATE users
SET trendPoints = FLOOR(RAND()*100)
where userID >= 0;
call sp_updatetopten;