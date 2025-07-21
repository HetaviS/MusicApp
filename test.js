async function mySongs(
  artistId: number,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedMySongsResult> {
  try {
    const offset = (page - 1) * pageSize;

    const { rows, count: total } = await MusicSinger.findAndCountAll({
      where: { user_id: artistId },
      limit: pageSize,
      offset,
      include: [
        {
          model: Song,
          as: 'song',
          include: [
            {
              model: Genre,
              as: 'genre',
              attributes: ['genre_id', 'name']
            },
          ],
          attributes: ['song_id', 'title', 'audio', 'thumbnail', 'genre_id', 'duration'],
        },
         {
              model: User,
              as: 'singer',
              attributes: ['user_id', 'full_name', 'profile_pic'],
            },
      ],
    });
    // add artist data to song
    // add is_favorites to song

    const data = await Promise.all(
      rows.map(async (record) => {
        const songData = record.get({ plain: true });
        const is_favorite = await isfavorite(songData.song.song_id, artistId);
        const artists = await MusicSinger.findAll({ where: { song_id: songData.song.song_id }, include: [
            {
                model: User,
                as: 'singer',
                attributes: ['user_id', 'full_name', 'profile_pic'],
            }
        ] });
        return { 
          ...songData.song, 
          singer: artists.flatMap(artist => {
            const artistPlain = artist.get({ plain: true });
            return artistPlain.singer ? [artistPlain.singer] : [];
          }), 
          is_favorite 
        };
      })
    );

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (err) {
    throw err;
  }
}