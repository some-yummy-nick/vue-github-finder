<template>
    <div class="wrapper-content wrapper-content--fixed">
        <section>
            <div class="container">
                <div class="wrapper">
                    <Search :search="search" @search="search=$event"/>
                    <button class="btn btnPrimary" @click="getRequests">Search</button>
                    <Preloader v-if="commonLoading && !error"/>
                    <p>{{error}}</p>
                    <div class="user" v-if="user">
                        <img class="user__image" :src="user.avatar_url" :alt="user.name">
                        <p>{{user.name}} has <b>{{user.public_repos}}</b> public repos</p>
                    </div>
                    <div class="repos" v-if="repos.length && !error">
                        <div class="repos__wrapper">
                            <div class="repos__sort">
                                <button class="btn btnWhite" @click="sort('name')">Name
                                    <span class="arrow" v-if="currentSort==='name'"
                                          :class="activeSortClass">↓</span></button>
                                <button class="btn btnWhite" @click="sort('stargazers_count')">Star
                                    <span class="arrow" v-if="currentSort==='stargazers_count'"
                                          :class="activeSortClass">↓</span></button>
                            </div>
                            <div class="repos__item" v-for="repo in repos" :key="repo.id">
                                <div class="repos__info">
                                    <a class="link" target="_blank" :href="repo.html_url">{{repo.name}}</a>
                                    <span>{{repo.stargazers_count}} ⭐</span>
                                </div>
                            </div>
                            <Preloader v-if="smallLoading && !error"/>
                        </div>
                        <div class="button-list">
                            <button class="btn btnPrimary" :disabled="prevDisabled" @click="prevPage">←</button>
                            <button class="btn btnPrimary" :disabled="nextDisabled" @click="nextPage">→</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import axios from 'axios';

    import Preloader from '@/components/Preloader';
    import Search from '@/components/Search';

    export default {
        name: 'Home',
        components: {Preloader, Search},
        data() {
            return {
                error: null,
                user: null,
                search: '',
                currentSort: 'name',
                currentSortDir: 'asc',
                page: {
                    current: 1,
                    length: 100
                },
                nextDisabled: false,
                prevDisabled: true
            }
        },
        computed: {
            repos() {
                return this.$store.getters.getItems.sort((a, b) => {
                    let mod = 1;
                    if (this.currentSortDir === 'desc') mod = -1;
                    if (a[this.currentSort] < b[this.currentSort]) return -1 * mod;
                    if (a[this.currentSort] > b[this.currentSort]) return mod;
                    return 0;
                })
            },
            activeSortClass() {
                return {
                    'desc': this.currentSortDir === 'desc'
                }
            },
            commonLoading() {
                return this.$store.getters.getCommonLoading;
            },
            smallLoading() {
                return this.$store.getters.getSmallLoading;
            },
        },
        methods: {
            getRequests() {
                this.$store.dispatch('setCommonLoading', true);
                Promise.all([this.getUser(), this.getRepos()])
                    .then(results => {
                        this.error = null;
                        this.user = results[0].data;
                        this.$store.dispatch('setItems', results[1].data);
                    })
                    .catch(error => {
                        this.error = error.message;
                    })
                    .finally(() => this.$store.dispatch('setCommonLoading', false))
            },
            getUser() {
                return axios.get(`https://api.github.com/users/${this.search}`)
            },
            getRepos() {
                return axios.get(`https://api.github.com/users/${this.search}/repos?page=${this.page.current}&per_page=${this.page.length}`)
            },

            sort(name) {
                if (name === this.currentSort) {
                    this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
                }
                this.currentSort = name
            },
            buttonClick() {
                this.$store.dispatch('setSmallLoading', true);
                this.getRepos()
                    .then(result => {
                        this.error = null;
                        this.$store.dispatch('setItems', result.data);
                        if (result.data.length < this.page.length) {
                            this.nextDisabled = true;
                            this.prevDisabled = false;
                        }
                    })
                    .catch(error => {
                        this.error = error.message;
                    })
                    .finally(() => this.$store.dispatch('setSmallLoading', false))
            },
            prevPage() {
                this.page.current -= 1;
                this.buttonClick();
                if (this.page.current === 1) {
                    this.prevDisabled = true;
                    this.nextDisabled = false;
                }
            },
            nextPage() {
                this.page.current += 1;
                this.buttonClick()
            }
        }
    }
</script>
<style lang="scss">
    .wrapper {
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .user {
        text-align: center;

        &__image {
            margin-bottom: 10px;
        }
    }

    .repos {
        &__wrapper {
            width: 400px;
            margin: 30px 0;
        }

        &__sort {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        &__info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 10px 0;
            border-bottom: 1px solid #dbdbdb;
        }
    }

    .button-list {
        text-align: center;

        .btn:not(:last-child) {
            margin-right: 10px;
        }
    }
s
    .arrow {
        display: inline-block;

        &.desc {
            transform: rotate(180deg);
        }
    }
</style>
