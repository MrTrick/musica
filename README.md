# musica
Simple cloud music Library / music Player  

[DEMO HERE](https://mrtrick.github.io/musica/)

![Musica Logo](https://github.com/MrTrick/musica/blob/master/docs/logo.png?raw=true)
----

## Overview
**musica** is a simple cloud-compatible music library and player.
- Stateless express.js server to handle metadata and (tbd) social listening functionality.
- Media storage and delivery delegated to an S3 (or S3-like) CDN.
- Media upload and application management implemented in a separate command-line tool.

- Front-end built using React, Material-UI, Redux, Howler.

## Future Improvements
The basic music player functionality is in place, but needs further work to reach
parity with other players.

### Backend

The backend could be improved in several areas:
- Using the 'notification' feature in S3/Minio to capture any changes to the stored audio files or metadata.  
  _(eg updating the index incrementally for each new or changed file)_
- Choosing a different location for metadata, to better support user interaction like searching.
- Caching the index rather than fetching it anew for each request.
- Including the upload/management features in the same API, rather than with a separate tool.
- More tests.

### Frontend

Missing features:
- Session support - keep the current track (and position) open across reloads
- Shuffle feature
- Search / filtering feature
- Sort by columns
- Seek within a song
- Volume control
- VU meter or visualisation
- Playlists, different track views
- Support for thumbnails
- Automatically reload if new songs are added to the backend
- More tests!

## Installation
### 1. Downloading
```
git clone https://github.com/MrTrick/musica.git
cd musica
npm install
```
### 2. Configuration ###
**musica** uses environment variables for configuration, particularly for connecting to the S3 storage.  
At minimum, you need to set the following storage server configuration:
_(with the appropriate values for your setup)_
```
MUSICA_STORAGE_SERVER=localhost
MUSICA_STORAGE_PORT=9000
MUSICA_ACCESS_KEY=SOMETHINGSOMETHINGEXAMPLE
MUSICA_SECRET_KEY=SOMETHINGSOMETHIGNSOMETHINGSECRETEXAMPLE
MUSICA_BUCKET_NAME=musica
```
These values could alternatively be written in an `.env` file within the top-level `musica/` directory.

You can configure **musica** to use AWS S3, or run your own storage server.
See the **Minio** section further ahead.

### 3. Other Dependencies
**musica** requires ffmpeg >2.8.1 for media transcoding.  
```
node musica check-ffmpeg
```

**musica** requires an AWS S3-compatible storage server. _(for one option, see **Minio**)_

### 3a. Minio
**Minio** is an S3-compatible object storage server.
It can be built and run using **Docker**:
```
docker pull minio/minio
docker run -p 9000:9000 --name minio1 -e "MINIO_ACCESS_KEY=SOMETHINGSOMETHINGEXAMPLE" -e "MINIO_SECRET_KEY=SOMETHINGSOMETHIGNSOMETHINGSECRETEXAMPLE" minio/minio server /data
```
Ensure that the details passed to the Docker instance match those configured in your **musica** environmental variables.

_(For more information see https://docs.minio.io/ )_

### 4. Initialising
The **musica** bucket needs to be created and the access policies set to allow public read access.  
This can be done automatically with:
```
node musica init
```

### 5. Add Music
Audio files can be uploaded into **musica** using the command-line tool:
```
node musica insert file1.mp3 file2.aac file3.ogg file4.opus...
```
_(Any format supported by both ffmpeg and the npm 'music-metadata' package can be used)_

### 6. Run
```
npm start
```
The integrated react.js client will auto-launch in your browser.
![Musica Client](https://github.com/MrTrick/musica/blob/master/docs/screenshot.jpg?raw=true)
