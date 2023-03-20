-- alter add column in user
ALTER TABLE face.USER ADD introduction VARCHAR(512) null comment '자기소개 내용';

ALTER TABLE face.USER ADD link VARCHAR(512) null comment '자기소개 링크';

-- alter add column in file
ALTER TABLE face.FILE ADD user_id int unsigned null comment 'user id';

-- add fk constraint
ALTER TABLE face.FILE
ADD FOREIGN KEY (user_id) REFERENCES face.USER(id);