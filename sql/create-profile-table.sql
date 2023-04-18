CREATE TABLE `PROFILE`
(
    `id`           int UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id`      int UNSIGNED NOT NULL COMMENT 'user id',
    `nickname`     varchar(255) NOT NULL COMMENT '회원가입 시, 랜덤하게 생성',
    `introduction` varchar(512) NULL COMMENT '자기소개 내용',
    `link`         varchar(512) NULL COMMENT '자기 소개 링크',
    `created_at`   datetime(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at`   datetime(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at`   datetime(6)  NULL,
    UNIQUE INDEX `uk_user_id` (`user_id`),
    FOREIGN KEY(user_id) REFERENCES USER(id),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- insert profiles
INSERT INTO face.PROFILE (user_id, nickname, introduction, link, created_at, updated_at, deleted_at) VALUES (1, '부드러운참돔887', null, null, '2023-02-24 22:47:09.542046', '2023-02-24 22:47:09.542046', null);
INSERT INTO face.PROFILE (user_id, nickname, introduction, link, created_at, updated_at, deleted_at) VALUES (2, '멋진호랑이132', null, null, '2023-02-24 23:00:10.302156', '2023-02-24 23:00:10.302156', null);
INSERT INTO face.PROFILE (user_id, nickname, introduction, link, created_at, updated_at, deleted_at) VALUES (3, '귀여운어드민111', null, null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null);
INSERT INTO face.PROFILE (user_id, nickname, introduction, link, created_at, updated_at, deleted_at) VALUES (4, '귀여운어드민112', null, null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null);
INSERT INTO face.PROFILE (user_id, nickname, introduction, link, created_at, updated_at, deleted_at) VALUES (5, '귀여운어드민113', null, null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null);
INSERT INTO face.PROFILE (user_id, nickname, introduction, link, created_at, updated_at, deleted_at) VALUES (6, '귀여운어드민114', null, null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null);
INSERT INTO face.PROFILE (user_id, nickname, introduction, link, created_at, updated_at, deleted_at) VALUES (7, '귀여운어드민115', null, 'www.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.com', '2023-03-19 15:28:01.408093', '2023-04-15 16:30:46.488457', null);
INSERT INTO face.PROFILE (user_id, nickname, introduction, link, created_at, updated_at, deleted_at) VALUES (8, '귀여운어드민116', null, null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null);
INSERT INTO face.PROFILE (user_id, nickname, introduction, link, created_at, updated_at, deleted_at) VALUES (9, '귀여운어드민117', null, null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null);
INSERT INTO face.PROFILE (user_id, nickname, introduction, link, created_at, updated_at, deleted_at) VALUES (10, '귀여운어드민118', null, null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null);
INSERT INTO face.PROFILE (user_id, nickname, introduction, link, created_at, updated_at, deleted_at) VALUES (11, '귀여운어드민119', null, null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null);

-- remove USER columns
ALTER TABLE face.USER DROP nickname;
ALTER TABLE face.USER DROP introduction;
ALTER TABLE face.USER DROP link;