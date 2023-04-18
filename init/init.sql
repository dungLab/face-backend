-- ddls
create table face.HASHTAG
(
    id         int unsigned auto_increment
        primary key,
    name       varchar(255)                             not null comment 'name',
    created_at datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    deleted_at datetime(6)                              null
);

create index idx_name
    on face.HASHTAG (name);

create index idx_name_deletedAt
    on face.HASHTAG (name, deleted_at);

create table face.`LOG-EVALUATION`
(
    id         int unsigned auto_increment
        primary key,
    user_id    int unsigned                             not null comment '평가한 유저 아이디',
    photo_id   int unsigned                             not null comment '포토 아이디',
    is_good    tinyint unsigned                         null comment '좋아요 여부',
    is_get     tinyint unsigned                         not null comment '조회 받음 여부',
    created_at datetime(6) default CURRENT_TIMESTAMP(6) not null
);

create table face.USER
(
    id            int unsigned auto_increment
        primary key,
    email         varchar(255)                             not null comment '이메일',
    nickname      varchar(255)                             not null comment '회원가입 시, 랜덤하게 생성',
    type          varchar(255)                             not null comment '유저 타입 (kakao, naver, google, apple)',
    refresh_token varchar(255)                             null,
    created_at    datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at    datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    deleted_at    datetime(6)                              null,
    introduction  varchar(512)                             null comment '자기소개 내용',
    link          varchar(512)                             null comment '자기소개 링크',
    constraint uk_email_type
        unique (email, type)
);

create table face.FILE
(
    id         int unsigned auto_increment
        primary key,
    type       varchar(255)                             not null comment '파일 타입 (image, docs, ..)',
    url        varchar(255)                             not null comment 'obj url',
    created_at datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    deleted_at datetime(6)                              null,
    user_id    int unsigned                             null comment 'user id',
    constraint FILE_ibfk_1
        foreign key (user_id) references face.USER (id)
);

create index user_id
    on face.FILE (user_id);

create table face.PHOTO
(
    id          int unsigned auto_increment
        primary key,
    user_id     int unsigned                             not null comment '유저 아이디',
    file_id     int unsigned                             not null comment '파일 아이디',
    description varchar(255)                             not null comment 'description',
    expired_at  datetime                                 not null comment '사진 평가 만료 날짜',
    created_at  datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at  datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    deleted_at  datetime(6)                              null,
    constraint REL_3ced53ec33521377c7da4e835c
        unique (file_id),
    constraint fk_file_id
        foreign key (file_id) references face.FILE (id),
    constraint fk_user_id
        foreign key (user_id) references face.USER (id)
);

create table face.EVALUATION
(
    id         int unsigned auto_increment
        primary key,
    user_id    int unsigned                             not null comment '평가한 유저 아이디',
    photo_id   int unsigned                             not null comment '포토 아이디',
    is_good    tinyint unsigned                         not null comment '좋아요 여부',
    created_at datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    deleted_at datetime(6)                              null,
    constraint uk_user_id_photo_id
        unique (user_id, photo_id),
    constraint fk_photo_id_tmp
        foreign key (photo_id) references face.PHOTO (id),
    constraint fk_user_id_tmp
        foreign key (user_id) references face.USER (id)
);

create table face.`PHOTO-HASHTAG`
(
    id         int unsigned auto_increment
        primary key,
    hashtag_id int unsigned                             not null comment 'hashtag fk',
    photo_id   int unsigned                             not null comment 'photo fk',
    created_at datetime(6) default CURRENT_TIMESTAMP(6) not null,
    updated_at datetime(6) default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6),
    deleted_at datetime(6)                              null,
    constraint fk_hashtag_id
        foreign key (hashtag_id) references face.HASHTAG (id),
    constraint fk_photo_id
        foreign key (photo_id) references face.PHOTO (id)
);

create index idx_email_deleted_at
    on face.USER (email, deleted_at);

create index idx_email_type_deleted_at
    on face.USER (email, type, deleted_at);



-- dmls
-- users
insert into face.USER (id, email, nickname, type, refresh_token, created_at, updated_at, deleted_at, introduction, link)
values  (1, 'shkorea1004@gmail.com', '부드러운참돔887', 'kakao', null, '2023-02-24 22:47:09.542046', '2023-02-24 22:47:09.542046', null, null, null),
        (2, 'yjs3819@naver.com', '멋진호랑이132', 'kakao', null, '2023-02-24 23:00:10.302156', '2023-02-24 23:00:10.302156', null, null, null),
        (3, 'test1@naver.com', '귀여운어드민111', 'kakao', null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null, null, null),
        (4, 'test2@naver.com', '귀여운어드민112', 'kakao', null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null, null, null),
        (5, 'test3@naver.com', '귀여운어드민113', 'kakao', null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null, null, null),
        (6, 'test4@naver.com', '귀여운어드민114', 'kakao', null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null, null, null),
        (7, 'test5@naver.com', '귀여운어드민115', 'kakao', null, '2023-03-19 15:28:01.408093', '2023-04-15 16:30:46.488457', null, null, 'www.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.comwww.naver.com'),
        (8, 'test6@naver.com', '귀여운어드민116', 'kakao', null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null, null, null),
        (9, 'test7@naver.com', '귀여운어드민117', 'kakao', null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null, null, null),
        (10, 'test8@naver.com', '귀여운어드민118', 'kakao', null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null, null, null),
        (11, 'test9@naver.com', '귀여운어드민119', 'kakao', null, '2023-03-19 15:28:01.408093', '2023-03-19 15:28:01.408093', null, null, null);