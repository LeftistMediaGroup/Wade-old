# Extract the image of an m4a file and store it as jpg
for f in *.mp3; do ffmpeg -i "$f" -an -vcodec copy "./AlbumArt/${f%}.jpeg"; done
