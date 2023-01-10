SET @row_number = 0;
SELECT 
    (@row_number:=@row_number + 1) AS pos, userID, trendPoints
FROM
    trendingusers
ORDER BY trendPoints DESC;

SET @row_number = 0;
insert into trendingusers
select userID, name, trendpoints, (SELECT (@row_number:=@row_number + 1)) AS pos from users order by trendPoints desc;

---------------- random trendpoints ----------------
    alter event sp_updatetopten DISABLE
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

    UPDATE users
    SET trendPoints = FLOOR(RAND()*100)
    where userID >= 0;


start of each hour update topten with current standings of limit 10 from users order by points desc
