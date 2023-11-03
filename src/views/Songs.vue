<template>
<div id="songs-view" @scroll="handleScroll">
    <div class="wrapper-header">
        <h1>SONGS</h1>
        <div class="wrapper-search">
            <input id="input-search" placeholder="Search by title..." v-model="search" @input="searchSongs">
        </div>
        <div class="wrapper-settings">
            <button id="btn-show-favorites" :class="{ active: show_favorites }" @click="toggleFavorites">Show
                Favorites</button>
        </div>
    </div>
    <div class="wrapper-songs">
        <table cellspacing="0" cellpadding="0">
            <tr ref="header" style="background: var(--c-dark);">
                <th id="th-id" >#</th>
                <th id="th-title" :class="{ active: sort.by === 'title' }" @click="sortBy('title')">
                    Title
                    <IconCaretUp v-if="sort.by === 'title' && sort.order !== ''" color="var(--c-accent-secondary)"
                        :class="{ 'flip-vertical': sort.order === 'desc' }" />
                </th>
                <th id="th-artist">Artist</th>
                <th id="th-album">Album</th>
                <th id="th-duration" :class="{ active: sort.by === 'duration' }" @click="sortBy('duration')">
                    Duration
                    <IconCaretUp v-if="sort.by === 'duration' && sort.order !== ''" color="var(--c-accent-secondary)"
                        :class="{ 'flip-vertical': sort.order === 'desc' }" />
                </th>
            </tr>
            <!-- Loop goes on this <tr> element -->
            <!-- Im not sure why but the style never gets aplied when the song is being played. Same for all icons too. I just did a hack around so it works-->
            <tr class="song" v-for="(song, index) in filteredSongs" :key="song.name" @click="playSong(song)" :class="{ active: playerStore.getNowPlaying === song }">
                <td id="td-index">
                    <IconPlay v-if="playerStore.getNowPlaying === song" color="var(--c-accent-secondary)" />
                    <span id="txt-index" v-else>{{ index + 1 }}</span>
                </td>
                <td id="td-title">
                    <img :src="song.album.images[0].url" />
                    {{ song.name }}
                </td>
                <td id="td-artist">
                    {{ getArtistNames(song.artists) }}
                </td>
                <td id="td-album">
                    {{ song.album.name }}
                </td>
                <td id="td-duration">
                    {{ formatDuration(song.duration_ms) }}
                    <IconHeart :class="{ active: authStore.getFavoriteSongs().includes(song.id) }" @click="authStore.toggleFavorite(song.id)" style="opacity: 1; color: white;" />
                </td>
            </tr>
        </table>
    </div>
</div>
</template>

<script>
import IconCaretUp from '@/components/icons/IconCaretUp.vue';
import IconPlay from '@/components/icons/IconPlay.vue';
import IconHeart from '@/components/icons/IconHeart.vue';
import songsAPI from '../data/songs';
import { usePlayerStore } from '@/stores/player';
import { useAuthStore } from '../stores/auth'

export default {
    name: 'Songs',
    components: {
        IconCaretUp,
        IconPlay,
        IconHeart
    },
    data() {
        return {
            search: '',
            show_favorites: false,
            sort: {
                by: '',
                order: 'asc'
            },
            doubleClick: 0,
            lastClicked: null,
            songs: [...songsAPI],
            authStore: useAuthStore(),
            playerStore: usePlayerStore()
        }
    },
    methods: {
        searchSongs() {
            if (this.search === '') {
                this.songs = [...songsAPI];
                return;
            }
            const searchRegex = new RegExp(this.search, 'i');
            this.songs = songsAPI.filter(song => searchRegex.test(song.name));
        },
        toggleFavorites() {
            this.show_favorites = !this.show_favorites;
        },
        formatDuration(duration_ms) {
            const minutes = Math.floor(duration_ms / 60000);
            const seconds = ((duration_ms % 60000) / 1000).toFixed(0);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        },
        playSong(song) {
            if (this.lastClicked !== song) {
                this.doubleClick = 0;
                this.lastClicked = song;
            }
            this.doubleClick++;
            if (this.doubleClick === 1) {
                this.timer = setTimeout(() => {
                    this.doubleClick = 0;
                }, 500);
            } else {
                clearTimeout(this.timer);
                this.playerStore.setNowPlaying(song);
                this.doubleClick = 0;
            }
        },
        toggleFavorite(song) {
            song.favorite = !song.favorite;
        },
        parseDuration(duration) {
            if (typeof duration !== 'string') {
                return '';
            }
            const [minutes, seconds] = duration.split(':').map(str => parseInt(str));
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        },
        getArtistNames(artists) {
            if (!artists || !Array.isArray(artists)) {
                return '';
            }
            return artists.map(artist => artist.name).join(', ');
        },
        sortBy(by) {
            if (by === this.sort.by) {
                if (this.sort.order === 'asc') {
                    this.sort.order = 'desc';
                } else if (this.sort.order === 'desc') {
                    this.sort.order = '';
                    this.sort.by = '';
                } else {
                    this.sort.order = 'asc';
                }
            } else {
                this.sort.by = by;
                this.sort.order = 'asc';
            }
            const filteredSongs = this.songs.filter(song => song.name.toLowerCase().includes(this.search.toLowerCase()));
            const uniqueSongIds = new Set();
            let sortedSongs;
            if (this.sort.by === 'title') {
                sortedSongs = filteredSongs.sort((a, b) => {
                    const aValue = a.name.toLowerCase();
                    const bValue = b.name.toLowerCase();
                    return this.sort.order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                });
            } else if (this.sort.by === 'duration') {
                sortedSongs = filteredSongs.sort((a, b) => {
                    const aValue = a.duration_ms;
                    const bValue = b.duration_ms;
                    return this.sort.order === 'asc' ? aValue - bValue : bValue - aValue;
                });
            } else {
                sortedSongs = [...songsAPI];
            }
            const uniqueSortedSongs = sortedSongs.filter(song => {
                if (uniqueSongIds.has(song.id)) {
                    return false;
                } else {
                    uniqueSongIds.add(song.id);
                    return true;
                }
            });
            this.songs = uniqueSortedSongs;
        }
    },
    mounted() {
        this.playerStore.setPlaylist(this.songs);
    },
    computed: {
        filteredSongs() {
            const favoriteSongs = this.authStore.getFavoriteSongs();
            return this.songs.filter(song => {
                let valid = song.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
                if (valid && this.show_favorites) {
                    valid = favoriteSongs.includes(song.id);
                }
                return valid;
            });
        }
    }
}
</script>