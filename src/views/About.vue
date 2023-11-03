<template>
    <div id="about-view">
        <div class="wrapper-header">
            <h1>ABOUT ME</h1>
            <div class="settings">
                <button id="btn-edit" @click="toggleEdit">{{ editMode ? 'Cancel' : 'Edit Form' }}</button>
                <button id="btn-save" v-if="editMode" @click="saveForm">Save Form</button>
            </div>
        </div>
        <form>
            <div class="wrapper-input">
                <label>NAME</label>
                <input id="input-name" :disabled="!editMode" v-if="editMode" :value="authStore.getUserData().name">
                <p id="txt-name" v-if="!editMode">{{ authStore.getUserData().name }}</p>
            </div>
            <div class="wrapper-input">
                <label>SURNAME</label>
                <input id="input-surname" :disabled="!editMode" v-if="editMode" :value="authStore.getUserData().surname">
                <p id="txt-surname" v-if="!editMode">{{ authStore.getUserData().surname }}</p>
            </div>
            <div class="wrapper-input">
                <label>STUDENT CODE</label>
                <input id="input-code" :disabled="!editMode" v-if="editMode" :value="authStore.getUserData().code">
                <p id="txt-code" v-if="!editMode">{{ authStore.getUserData().code }}</p>
            </div>
            <div class="wrapper-songs">
                <label>FAVORITE SONGS</label>
                <ul v-if="favSongs.length > 0">
                    <li v-for="song in favSongs" :key="song.id">
                        <img id="img-album" :src="song.album.images[0].url" />
                        <div class="song-info">
                            <p id="txt-song" class="song-name">{{ song.name }}</p>
                            <p id="txt-artist" class="song-artists">{{ song.artists[0].name }}</p>
                        </div>
                    </li>
                </ul>
                <div id="txt-empty" class="empty" v-else>NO SONGS FOUND</div>
            </div>
        </form>
    </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import songsAPI from '../data/songs'
import IconEdit from '../components/icons/IconEdit.vue'

export default {
    name: 'About',
    components: {
        IconEdit,
    },
    data() {
        return {
            authStore: useAuthStore(),
            editMode: false,
        };
    },
    methods: {
        toggleEdit() {
            this.editMode = !this.editMode;
            const btnEdit = document.getElementById('btn-edit');
            if (this.editMode) {
                btnEdit.classList.add('active');
            } else {
                btnEdit.classList.remove('active');
            }
        },
        saveForm() {
            const inputName = document.getElementById('input-name');
            const inputSurname = document.getElementById('input-surname');
            const inputCode = document.getElementById('input-code');

            this.authStore.setUserData(inputName.value, inputSurname.value, inputCode.value);
            this.toggleEdit();
        },
    },
    computed: {
        favSongs() {
            const favoriteSongs = this.authStore.getFavoriteSongs();
            return songsAPI.filter((song) => favoriteSongs.includes(song.id));
        },
    },
};
</script>