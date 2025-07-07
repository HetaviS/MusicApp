import { IAlbum } from "../types";
import { Album } from "../models";

const fs = require('fs');
const path = require('path');
// const { Song } = require('../models/song'); // adjust path

const BASE_URL = 'http://192.168.0.11:3000'; // replace with your actual base URL

async function cleanThumbnails() {
  try {
    const songs = await Album.findAll() as unknown as IAlbum[];

    for (const song of songs) {
      if (!song.thumbnail) continue;

      // 1. Remove base URL
      let relativePath = song.thumbnail.replace(BASE_URL, '');

      // 2. Normalize slashes and remove spaces

      const oldFullPath = path.join(__dirname, '..', '..', relativePath);
      relativePath = relativePath.replace(/\\/g, '/').replace(/\s+/g, '');
      const normalizedPath = path.posix.normalize(relativePath);
      const newFullPath = path.join(__dirname, '..', '..', normalizedPath);

      if (fs.existsSync(oldFullPath)) {
        const newDir = path.dirname(newFullPath);
        if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });

        if (oldFullPath !== newFullPath) {
          fs.renameSync(oldFullPath, newFullPath);
        }
        if (song.thumbnail !== normalizedPath) {
          song.thumbnail = normalizedPath;
          Album.update({ thumbnail: normalizedPath }, { where: { album_id: song.album_id } });
        }

      } else {
        console.warn('File not found:', oldFullPath);
      }
    }

    console.log('Thumbnails cleaned: base URL removed, spaces stripped.');
  } catch (error) {
    console.error('Error cleaning thumbnails:', error);
  }
}

cleanThumbnails();
