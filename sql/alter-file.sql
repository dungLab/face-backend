ALTER TABLE face.FILE DROP user_id;

ALTER TABLE face.PROFILE ADD file_id int UNSIGNED null AFTER user_id;
