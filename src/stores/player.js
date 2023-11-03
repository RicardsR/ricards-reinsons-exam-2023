import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
    state: () => ({
        playlist   : [],
        now_playing: {}, // SONG OBJECT
    }),
    getters: {
        getNextSong(){
            const index = this.playlist.findIndex(song => song.id === this.now_playing.id);
            if(index === -1) return null;
            return this.playlist[index + 1];
        },
        getPreviousSong() {
            const index = this.playlist.findIndex(song => song.id === this.now_playing.id);
            if(index === -1) return null;
            return this.playlist[index - 1];
        },
        getNowPlayingSongId() {
            return this.now_playing?.id;
        },
        getNowPlaying() {
            return this.now_playing;
        },
        getNowPlayingAlbumID() {
            return this.now_playing?.album?.id ?? null;
        },
        getNowPlayingSongName() {
            return this.now_playing?.name ?? '';
        },
        getNowPlayingSongImage() {
            return this.now_playing?.album?.images[1].url ?? '';
        },
        getNowPlayingArtists() {
            return this.now_playing?.artists?.map(artist => artist.name).join(', ');
        },
        getNowPlayingSongPreview() {
            return this.now_playing?.preview_url;
        },
        toggleFavourite(songid) {
            const index = this.favorite_songs.indexOf(songid);
            if (index === -1) {
                this.favorite_songs.push(songid);
            } else {
                this.favorite_songs.splice(index, 1);
            }
            localStorage.setItem('favorite_songs', JSON.stringify(this.favorite_songs));
        }
    },
    actions: {
        setPlaylist(songs) {
            this.playlist = songs;
        },
        setNowPlaying(song) {
            this.now_playing = song;
        },
        resetNowPlaying() {
            this.now_playing = {};
        },
    }
})
