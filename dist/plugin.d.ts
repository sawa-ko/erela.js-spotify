import { Manager, Plugin } from 'erela.js';
/**
 * Spotify plugin for erela.js without api credentials
 * @author kaname-png (Github)
 */
export declare class SpotifyPlugin extends Plugin {
    private manager;
    private _search;
    private regexSpotify;
    private options;
    /**
     * Options client
     * @param options Use the convertUnresolved property only on small quantities of items to avoid Rate Limit problems.
     */
    constructor(options: {
        limitTracks?: boolean;
    });
    load(manager: Manager): void;
    private search;
}
