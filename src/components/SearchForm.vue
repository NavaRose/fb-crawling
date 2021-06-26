<template>
    <form id="search-form" v-on:submit.prevent="searchSubmit">
        <div class="row">
            <div class="col-7">
                <div class="row">
                    <div class="col-lg-1 col-md-2">
                        <img alt="logo" class="fb-logo mr-2" src="../assets/images/icon-facebook.png"/>
                    </div>
                    <div class="col-lg-11 col-md-10">
                        <input id="search-input" type="text" class="form-control"
                               placeholder="Search Products and Services">
                    </div>
                </div>
            </div>
            <div class="col-2 d-grid">
                <button id="{{ elements.searchButton }}" class="btn btn-block btn-primary float-left" type="submit">
                    {{ label.searchButton }}
                </button>
            </div>
            <div class="col-3 d-grid" id="sheet-config">
                <SheetConfig></SheetConfig>
            </div>
        </div>
    </form>
</template>

<script>
import SheetConfig from "@/components/SheetConfig";
import App from "../App";

export default {
    name: "SearchForm",
    props: ['tableItems'],
    components: {SheetConfig},
    extends: App,
    data: () => {
        return {
            urls: {
                getData: 'http://localhost:3000/api/get-data/'
            },
            label: {
                searchButton: 'Search',
            },
            elements: {
                searchForm: 'search-form',
                searchInput: 'search-input',
                searchButton: 'searching-key-fb',
            }
        }
    },
    methods: {
        searchSubmit() {
            let searchKey = document.getElementById(this.elements.searchInput).value;
            if (!searchKey) {
                return false;
            }
            this.helper.apiGet(this.urls.getData + searchKey, {}, (response) => {
                let data = [];
                const items = response.items.map((item) => {
                    data.push({
                        id: item.cacheId,
                        thumbnail: item.pagemap.cse_thumbnail ? item.pagemap.cse_thumbnail[0] :
                            {src: '../src/assets/images/no-avatar.jpeg'},
                        title: item.htmlTitle,
                        rawTitle: item.title,
                        description: item.htmlSnippet,
                        rawDescription: item.snippet,
                        url: item.htmlFormattedUrl,
                        rawUrl: item.formattedUrl
                    });
                });
                this.$emit('update-data', data, items);
            });
        }
    }
}
</script>

<style scoped>
img.fb-logo {
    width: auto !important;
    height: 38px;
}

#search-input {
    border: 0.5px solid #cce5ff;
}
</style>