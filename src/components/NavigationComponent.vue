<template>
    <nav id="nav-main" class="wrapper-navigation">
        <ol>
            <li>
                <router-link to="/">SONGS</router-link>
            </li>
            <li>
                <router-link to="/albums">ALBUMS</router-link>
            </li>
            <li>
                <router-link to="/about">ABOUT</router-link>
            </li>
        </ol>
    </nav>
</template>

<script>
export default {
    name: 'NavigationComponent',
};
</script>