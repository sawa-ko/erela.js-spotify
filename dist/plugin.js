"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotifyPlugin = void 0;
const erela_js_1 = require("erela.js");
const spotify_url_info_1 = require("spotify-url-info");
const buildSearch = (loadType, tracks, error, name) => ({
    loadType: loadType,
    // @ts-ignore
    tracks: tracks !== null && tracks !== void 0 ? tracks : [],
    playlist: name
        ? {
            name,
            duration: tracks.reduce((acc, cur) => acc + (cur.duration || 0), 0),
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
class SpotifyPlugin extends erela_js_1.Plugin {
    /**
     * Options client
     * @param options Use the convertUnresolved property only on small quantities of items to avoid Rate Limit problems.
     */
    constructor(options) {
        super();
        this.regexSpotify = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/;
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
    load(manager) {
        this.manager = manager;
        this._search = manager.search.bind(manager);
        manager.search = this.search.bind(this);
    }
    search(query, requester) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const finalQuery = query.query || query;
            const matchType = finalQuery.match(this.regexSpotify);
            if (matchType) {
                if (matchType[1] == 'track') {
                    try {
                        const dataSpotify = yield spotify_url_info_1.getPreview(finalQuery);
                        const data = yield this.manager.search(`${dataSpotify.title} ${dataSpotify.artist}`, requester);
                        // @ts-ignore
                        data.tracks[0].title = dataSpotify.title;
                        // @ts-ignore
                        data.tracks[0].author = dataSpotify.artist;
                        // @ts-ignore
                        data.tracks[0].thumbnail = dataSpotify.image;
                        // @ts-ignore
                        data.tracks[0].uri = dataSpotify.link;
                        return buildSearch('TRACK_LOADED', data.tracks, null, null);
                    }
                    catch (error) {
                        return buildSearch((_a = error.loadType) !== null && _a !== void 0 ? _a : 'LOAD_FAILED', null, (_b = error.message) !== null && _b !== void 0 ? _b : null, null);
                    }
                }
                if (matchType[1] == 'playlist' || matchType[1] == 'album') {
                    try {
                        const dataSpotify = yield spotify_url_info_1.getData(finalQuery);
                        const tracks = dataSpotify.tracks.items
                            .slice(0, this.options ? this.options.limitTracks : dataSpotify.tracks.items.length)
                            .map((song) => {
                            const trackAlbum = song;
                            const info = erela_js_1.TrackUtils.buildUnresolved({
                                title: matchType[1] == 'album' ? trackAlbum.name : song.track.name,
                                author: matchType[1] == 'album' ? trackAlbum.artists[0].name : song.track.artists[0].name,
                            }, requester);
                            return info;
                        })
                            .filter((track) => !!track);
                        return buildSearch('PLAYLIST_LOADED', tracks, null, dataSpotify.name);
                    }
                    catch (error) {
                        return buildSearch((_c = error.loadType) !== null && _c !== void 0 ? _c : 'LOAD_FAILED', null, (_d = error.message) !== null && _d !== void 0 ? _d : null, null);
                    }
                }
                return buildSearch('LOAD_FAILED', null, 'INVALID SPOTIFY URL', null);
            }
            return this._search(query, requester);
        });
    }
}
exports.SpotifyPlugin = SpotifyPlugin;
