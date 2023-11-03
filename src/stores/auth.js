import { defineStore } from 'pinia'
import router from '@/router'

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        user: {
            name: 'Ričards',
            surname: 'Reinsons',
            code: 'IT21016',
            favorite_songs: [],
        },
        authenticated: localStorage.getItem('is_authenticated') || false,
    }),
    actions: {
        setUserData(name, surname, code) {
            this.user.name = name;
            this.user.surname = surname;
            this.user.code = code;
        },
        authenticate(email, password) {
            if (email === 'ricards.reinsons@va.lv' && password === '123456') {
                localStorage.setItem('is_authenticated', true);
                this.authenticated = true;
                router.push({ name: 'Songs' });
            } else {
                alert('Wrong email or password!');
            }
        },
        logout() {
            localStorage.clear()
            this.authenticated = false;
            location.reload();
        },
        //Since there are duplicate ids in the songs.json file it would be better off saving it as a name instead of id where this command gets used.
        //Due to requirements though, I end up using ids. To use names instead, everywhere where the command is used, replace song.id with song.name.
        //Since this command simply saves just an array of something, doesnt matter if its ids or names, it will work.
        toggleFavorite(songID) {
            const index = this.user.favorite_songs.indexOf(songID)
            if (index === -1) {
                this.user.favorite_songs.push(songID);
            } else {
                this.user.favorite_songs.splice(index, 1);
            }
            localStorage.setItem('favorite_songs', JSON.stringify(this.user.favorite_songs));
        },
        getFavoriteSongs() {
            const favorite_songs = localStorage.getItem('favorite_songs');
            if (favorite_songs) {
                this.user.favorite_songs = JSON.parse(favorite_songs);
            }
            return this.user.favorite_songs;
        },
        getUserData() {
            return this.user;
        }
    },
    getters: {
        is_authenticated() {
            return localStorage.getItem('is_authenticated') || this.authenticated;
        },
    },
})