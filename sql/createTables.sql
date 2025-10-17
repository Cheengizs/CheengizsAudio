USE CheengizsAudio;

DROP TABLE IF EXISTS [dbo].[music_user_like];
DROP TABLE IF EXISTS [dbo].[music_user_create];
DROP TABLE IF EXISTS [dbo].[music_playlist];
DROP TABLE IF EXISTS dbo.playlist;
DROP TABLE IF EXISTS dbo.music;
DROP TABLE IF EXISTS dbo.app_user;

GO
CREATE TABLE dbo.app_user (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(16) NOT NULL UNIQUE,
    HashPassword NVARCHAR(MAX) NOT NULL,
	Email NVARCHAR(100) NOT NULL UNIQUE
);

GO
CREATE TABLE dbo.playlist (
    Id INT IDENTITY(1,1) PRIMARY KEY,
	Title NVARCHAR(50) NOT NULL,
    UserId INT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES dbo.app_user(Id)
);
GO

CREATE TABLE dbo.music (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(50) NOT NULL,
    Author NVARCHAR(50) NOT NULL,
	Path NVARCHAR(MAX)
);

CREATE TABLE music_user_create(
	user_id int NOT NULL,
	music_id int NOT NULL, 
	PRIMARY KEY (user_id, music_id),
	FOREIGN KEY (user_id) REFERENCES dbo.app_user(Id),
	FOREIGN KEY (music_id) REFERENCES dbo.music(Id)
);

CREATE TABLE music_user_like(
	user_id int NOT NULL,
	music_id int NOT NULL, 
	PRIMARY KEY (user_id, music_id),
	FOREIGN KEY (user_id) REFERENCES dbo.app_user(Id),
	FOREIGN KEY (music_id) REFERENCES dbo.music(Id)
);

CREATE TABLE music_playlist(
	music_id int NOT NULL,
	playlist_id int NOT NULL, 
	PRIMARY KEY (music_id, playlist_id),
	FOREIGN KEY (music_id) REFERENCES dbo.music(Id),
	FOREIGN KEY (playlist_id) REFERENCES dbo.playlist(Id)
);


