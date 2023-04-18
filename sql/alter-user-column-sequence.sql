ALTER TABLE face.USER MODIFY COLUMN introduction varchar(512) AFTER nickname;
ALTER TABLE face.USER MODIFY COLUMN link varchar(512) AFTER introduction;
