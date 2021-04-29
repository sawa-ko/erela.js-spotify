import { LoadType, Manager, Plugin, SearchQuery, SearchResult, TrackUtils, UnresolvedTrack } from 'erela.js';
import { getData, getPreview } from 'spotify-url-info';

const buildSearch = (loadType: LoadType, tracks: UnresolvedTrack[], error: string, name: string): SearchResult => ({
  loadType: loadType,
  // @ts-ignore
  tracks: tracks ?? [],
  playlist: name
    ? {
        name,
        duration: tracks.reduce((acc: number, cur: UnresolvedTrack) => acc + (cur.duration || 0), 0),
      }
    : null,
  exception: error
    ? {
        message: error,
        severity: 'COMMON',
      }
    : null,
});

/**
 * Spotify plugin for erela.js without api credentials
 * @author kaname-png (Github)
 */
export class SpotifyPlugin extends Plugin {
  private manager: Manager;
  private _search: (query: string | SearchQuery, requester?: unknown) => Promise<SearchResult>;
  private regexSpotify = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/;
  private options: { limitTracks?: boolean };

  /**
   * Options client
   * @param options Use the convertUnresolved property only on small quantities of items to avoid Rate Limit problems.
   */
  constructor(options: { limitTracks?: number }) {
    super();

    if (options) {
      if (typeof options.limitTracks !== 'number') {
        throw new TypeError('Client option "limitTracks" must be a number.');
      }

      if (options.limitTracks == 0) {
        throw new TypeError('Client option "limitTracks" must be greater than 0.');
      }
    }

    this.options = options;
  }

  public load(manager: Manager): void {
    this.manager = manager;
    this._search = manager.search.bind(manager);
    manager.search = this.search.bind(this);
  }

  private async search(query: string | SearchQuery, requester?: unknown) {
    const finalQuery = (query as SearchQuery).query || (query as string);
    const matchType = finalQuery.match(this.regexSpotify);
    if (matchType) {
      if (matchType[1] == 'track') {
        try {
          const dataSpotify = await getPreview(finalQuery);
          const data = await this.manager.search(`${dataSpotify.title} ${dataSpotify.artist}`, requester);

          // @ts-ignore
          data.tracks[0].title = dataSpotify.title;
          // @ts-ignore
          data.tracks[0].author = dataSpotify.artist;
          // @ts-ignore
          data.tracks[0].thumbnail = dataSpotify.image;
          // @ts-ignore
          data.tracks[0].uri = dataSpotify.link;

          return buildSearch('TRACK_LOADED', data.tracks as UnresolvedTrack[], null, null);
        } catch (error) {
          return buildSearch(error.loadType ?? 'LOAD_FAILED', null, error.message ?? null, null);
        }
      }

      if (matchType[1] == 'playlist' || matchType[1] == 'album') {
        try {
          const dataSpotify = await getData(finalQuery);
          const tracks = dataSpotify.tracks.items
            .slice(0, this.options ? this.options.limitTracks : dataSpotify.tracks.items.length)
            .map((song) => {
              const trackAlbum = (song as unknown) as { name: string; artists: Array<{ name: string }> };
              const info = TrackUtils.buildUnresolved(
                {
                  title: matchType[1] == 'album' ? trackAlbum.name : song.track.name,
                  author: matchType[1] == 'album' ? trackAlbum.artists[0].name : song.track.artists[0].name,
                },
                requester
              );

              return info;
            })
            .filter((track) => !!track);

          return buildSearch('PLAYLIST_LOADED', tracks, null, dataSpotify.name);
        } catch (error) {
          return buildSearch(error.loadType ?? 'LOAD_FAILED', null, error.message ?? null, null);
        }
      }

      return buildSearch('LOAD_FAILED', null, 'INVALID SPOTIFY URL', null);
    }

    return this._search(query, requester);
  }
}
