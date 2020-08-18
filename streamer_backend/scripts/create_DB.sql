-- Create a user
-- CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'password';
-- GRANT ALL PRIVILEGES ON * . * TO 'testuser'@'localhost';
-- FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS streamer;
use streamer;
create table IF NOT EXISTS audioserver(
    id INT AUTO_INCREMENT PRIMARY KEY ,
    title VARCHAR(20) NOT NULL,
    artist VARCHAR(20) NOT NULL,
    likes INT,
    label VARCHAR(20) NOT NULL,
    albumart VARCHAR(100) NOT NULL,
    audiofilepath VARCHAR(100) NOT NULL
);
create table IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL UNIQUE,
    usertype VARCHAR(20) NOT NULL,
    passkey VARCHAR(20) NOT NULL,
    email VARCHAR(20) NOT NULL UNIQUE,
    DOB DATE NOT NULL
);
create table IF NOT EXISTS favourites(
    favid INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    audioid INT NOT NULL,
    CONSTRAINT FK_FAV_USERID_USER_ID FOREIGN KEY (userid) references users(id),
    CONSTRAINT FK_FAV_AUDIOID_AUDIOSERVER_ID FOREIGN KEY (audioid) references audioserver(id)
);
create table IF NOT EXISTS comments(
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    audioid INT NOT NULL,
    comment VARCHAR(100) NOT NULL,
    CONSTRAINT FK_COMMENTS_USERID_USER_ID FOREIGN KEY (userid) references users(id),
    CONSTRAINT FK_COMMENTS_AUDIOID_AUDIOSERVER_ID FOREIGN KEY (audioid) references audioserver(id)
);

insert INTO audioserver(
        id,
        title,
        artist,
        rating,
        label,
        albumart,
        audiofilepath
    )
VALUES(
        1,
        "Billie Jean",
        "Michael Jackson",
        5,
        "Epic",
        "/home/aashish/WorkShop/streamer_backend/assets/albumart/billie_jean_cover.jpg",
        "/home/aashish/WorkShop/streamer_backend/assets/audio/michael_jackson_billie_jean.mp3"
    );
insert INTO audioserver(
        id,
        title,
        artist,
        rating,
        label,
        albumart,
        audiofilepath
    )
VALUES(
        2,
        "Smooth Criminal",
        "Michael Jackson",
        5,
        "Epic",
        "/home/aashish/WorkShop/streamer_backend/assets/albumart/smooth_criminal_cover.jpg",
        "/home/aashish/WorkShop/streamer_backend/assets/audio/michael_jackson_smooth_criminal.mp3"
    );
insert INTO audioserver(
        id,
        title,
        artist,
        rating,
        label,
        albumart,
        audiofilepath
    )
VALUES(
        3,
        "I'm Bad",
        "Michael Jackson",
        5,
        "Epic",
        "/home/aashish/WorkShop/streamer_backend/assets/albumart/im_bad_cover.jpg",
        "/home/aashish/WorkShop/streamer_backend/assets/audio/michael_jackson_im_bad.mp3"
    );
insert INTO users (id, username, usertype, passkey, email, DOB)
VALUES(100, "user1", "basic", "testpass", "a@b.com", "1990-12-12");