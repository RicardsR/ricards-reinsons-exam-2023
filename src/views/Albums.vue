<template>
    <div id="album-view">
        <div class="wrapper-header">
            <h1>ALBUMS</h1>
            <div class="settings">
                <button class="btn btn-secondary" :class="{ active: !is_grid }" @click="is_grid = false">
                    <IconList />
                </button>
                <button class="btn btn-secondary" :class="{ active: is_grid }" @click="is_grid = true">
                    <IconGrid />
                </button>
            </div>
        </div>
        <ul id="list-albums" :class="{ grid: is_grid }">
            <li class="album" li v-for="(album, album_id) in albums" :key="album_id" @click="selectAlbum(album)"
                :class="{ active: album.id === playerStore.getNowPlayingAlbumID }">
                <img id="img-album" :src="album.images[0].url" />
                <div class="album-info">
                    <h4 id="txt-album-name">{{ album.name }}</h4>
                    <p id="txt-album-artists">{{ getAlbumArtists(album) }}</p>
                    <div class="album-year">
                        <p id="txt-album-year">{{ getAlbumYear(album) }}</p>
                        <p id="txt-album-tracks">{{ getAlbumTrackCount(album) }} {{ getAlbumTrackCount(album) > 1 ? 'songs' : 'song' }} </p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import IconGrid from '../components/icons/IconGrid.vue'
import IconList from '../components/icons/IconList.vue'
import songsAPI from '../data/songs'
import { usePlayerStore } from '@/stores/player'

export default {
    name: 'Albums',
    components: { IconGrid, IconList },
    data() {
        return {
            is_grid: true,
            playerStore: usePlayerStore(),
            doubleClick: 0,
        }
    },
    methods: {
        selectAlbum(album) {
            if (this.lastClicked !== album) {
                this.doubleClick = 0;
                this.lastClicked = album;
            }
            this.doubleClick++;
            if (this.doubleClick === 1) {
                this.timer = setTimeout(() => {
                    this.doubleClick = 0;
                }, 500);
            } else {
                clearTimeout(this.timer);
                this.playerStore.setPlaylist(album.tracks);
                this.playerStore.setNowPlaying(album.tracks[0]);
                this.doubleClick = 0;
            }
        },
        getAlbumTrackCount(album) {
            return album.tracks.length;
        },
        getAlbumYear(album) {
            return album.release_date.split('-')[0]
        },
        getAlbumArtists(album) {
            return album.artists.map((artist) => artist.name).join(', ')
        },
    },
    computed: {
        albums() {
            const songs = songsAPI || []
            const albums = {}
            songs.forEach((song) => {
                if (!albums[song.album.id]) {
                    albums[song.album.id] = {
                        id: song.album.id,
                        name: song.album.name,
                        images: song.album.images,
                        artists: song.album.artists,
                        release_date: song.album.release_date,
                        tracks: []
                    }
                }
                albums[song.album.id].tracks.push(song)
            })
            return albums
        },
    },
}
</script>