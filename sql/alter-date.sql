# profile
alter table face.PROFILE modify created_at timestamp(6) not null default current_timestamp(6);

alter table face.PROFILE
    modify updated_at timestamp(6) not null on update current_timestamp(6) default current_timestamp(6);

alter table face.PROFILE modify deleted_at timestamp(6) null;

# FILE
alter table face.FILE modify created_at timestamp(6) not null default current_timestamp(6);

alter table face.FILE
    modify updated_at timestamp(6) not null on update current_timestamp(6) default current_timestamp(6);

alter table face.FILE modify deleted_at timestamp(6) null;


# HASHTAG
alter table face.HASHTAG modify created_at timestamp(6) not null default current_timestamp(6);

alter table face.HASHTAG
    modify updated_at timestamp(6) not null on update current_timestamp(6) default current_timestamp(6);

alter table face.HASHTAG modify deleted_at timestamp(6) null;

# LOG_EVALUATION
alter table face.`LOG-EVALUATION` modify created_at timestamp(6) not null default current_timestamp(6);

# PHOTO
alter table face.PHOTO modify created_at timestamp(6) not null default current_timestamp(6);

alter table face.PHOTO
    modify updated_at timestamp(6) not null on update current_timestamp(6) default current_timestamp(6);

alter table face.PHOTO modify deleted_at timestamp(6) null;

# PHOTO-HASHTAG
alter table face.`PHOTO-HASHTAG` modify created_at timestamp(6) not null default current_timestamp(6);

alter table face.`PHOTO-HASHTAG`
    modify updated_at timestamp(6) not null on update current_timestamp(6) default current_timestamp(6);

alter table face.`PHOTO-HASHTAG` modify deleted_at timestamp(6) null;

# PROFILE
alter table face.PROFILE modify created_at timestamp(6) not null default current_timestamp(6);

alter table face.PROFILE
    modify updated_at timestamp(6) not null on update current_timestamp(6) default current_timestamp(6);

alter table face.PROFILE modify deleted_at timestamp(6) null;

# USER
alter table face.USER modify created_at timestamp(6) not null default current_timestamp(6);

alter table face.USER
    modify updated_at timestamp(6) not null on update current_timestamp(6) default current_timestamp(6);

alter table face.USER modify deleted_at timestamp(6) null;