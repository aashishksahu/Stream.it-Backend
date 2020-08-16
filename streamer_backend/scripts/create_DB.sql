-- Create a user
-- CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'password';
-- GRANT ALL PRIVILEGES ON * . * TO 'testuser'@'localhost';
-- FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS streamer;
use streamer;
create table IF NOT EXISTS audioserver(
    id INT PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    rating INT,
    likes INT,
    label TEXT NOT NULL,
    albumart TEXT NOT NULL,
    audiofilepath TEXT NOT NULL
);
create table IF NOT EXISTS users(
    id INT PRIMARY KEY,
    username TEXT NOT NULL,
    usertype TEXT NOT NULL,
    passkey TEXT NOT NULL,
    email TEXT NOT NULL,
    DOB DATE NOT NULL
);
create table IF NOT EXISTS favourites(
    favid INT PRIMARY KEY,
    userid INT NOT NULL,
    audioid INT NOT NULL,
    FOREIGN KEY (userid) references users(id),
    FOREIGN KEY (audioid) references audioserver(id)
);
create table IF NOT EXISTS comments(
    id INT PRIMARY KEY,
    userid INT NOT NULL,
    audioid INT NOT NULL,
    comment TEXT NOT NULL,
    FOREIGN KEY (userid) references users(id),
    FOREIGN KEY (audioid) references audioserver(id)
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