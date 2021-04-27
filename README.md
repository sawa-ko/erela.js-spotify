<div align = "center">
<a href="https://www.npmjs.com/package/@kaname-png/erela.js-spotify">
<img src="https://img.shields.io/npm/dw/@kaname-png/erela.js-spotify?color=CC3534&logo=npm&style=for-the-badge" alt="Downloads">
</a>

<a href="https://www.npmjs.com/package/@kaname-png/erela.js-spotify">
<img src="https://img.shields.io/npm/v/@kaname-png/erela.js-spotify?color=red&label=Version&logo=npm&style=for-the-badge" alt="Npm version">
</a>

<br>

<a href="https://github.com/kaname-png/erela.js-spotify/stargazers">
<img src="https://img.shields.io/github/stars/kaname-png/erela.js-spotify?color=333&logo=github&style=for-the-badge" alt="Github stars">
</a>

<a href="https://github.com/kaname-png/erela.js-spotify/blob/master/LICENSE">
<img src="https://img.shields.io/github/license/kaname-png/erela.js-spotify?color=6e5494&logo=github&style=for-the-badge" alt="License">
</a>
<hr>
</div>

This a plugin for Erela.JS to allow the use of Spotify URL's, it uses direct URL's being tracks, albums, and playlists and gets the YouTube equivalent.

- https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC
- https://open.spotify.com/album/6N9PS4QXF1D0OWPk0Sxtb4
- https://open.spotify.com/playlist/37i9dQZF1DZ06evO05tE88

## Documentation & Guides

It is recommended to read the documentation to start, and the guides to use the plugin.

- [Documentation](http://projects.solaris.codes/erelajs/docs/gettingstarted.html 'Erela.js Documentation')

- [Guides](http://projects.solaris.codes/erelajs/guides/introduction.html 'Erela.js Guides')

## Installation

**NPM** :

```sh
npm install @kaname-png/erela.js-spotify
```

**Yarn** :

```sh
yarn add @kaname-png/erela.js-spotify
```

## Options

- ### limitTracks
  > Limit length of spotify tracks.

## Example Usage

```javascript
const { Manager } = require('erela.js');
const Spotify = require('@kaname-png/erela.js-spotify');

const manager = new Manager({
  plugins: [
    // Initiate the plugin.
    new Spotify({ options }),
  ],
});

manager.search('https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC');
```
