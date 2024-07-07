create table
    users (
        id int (16) not null auto_increment,
        name varchar(255) null default null,
        email varchar(255) null default null,
        email_verified_at timestamp default null,
        password varchar(255) null default null,
        status varchar(16) null default null,
        created_at timestamp null default null,
        updated_at timestamp null default null,
        primary key (id)
    );

create table
    face_recognitions (
        id int (16) not null auto_increment,
        user_id int (16) not null,
        img varchar(255) null default null,
        status varchar(16) null default null,
        created_at timestamp null default null,
        updated_at timestamp null default null,
        primary key (id)
    );

create table
    finger_prints (
        id int (16) not null auto_increment,
        user_id int (16) not null,
        finger varchar(255) null default null,
        status varchar(16) null default null,
        created_at timestamp null default null,
        updated_at timestamp null default null,
        primary key (id)
    );