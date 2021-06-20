<template>
  <form id="search-form" v-on:submit.prevent="searchSubmit">
    <div class="row">
      <div class="col-8">
        <div class="row">
          <div class="col-1">
            <img alt="logo" class="fb-logo mr-2" src="../assets/images/icon-facebook.png"/>
          </div>
          <div class="col-11">
            <input id="search-input" type="text" class="form-control" placeholder="Search Products and Services">
          </div>
        </div>
      </div>
      <div class="col-2 d-grid">
        <button id="{{ elements.searchButton }}" class="btn btn-block btn-primary float-left" type="submit">{{ label.searchButton }}</button>
      </div>
      <div class="col-2" id="sheet-config">
        <SheetConfig></SheetConfig>
      </div>
    </div>
  </form>
</template>

<script>
import SheetConfig from "@/components/SheetConfig";

export default {
  name: "SearchForm",
  components: {SheetConfig},
  data: () => {
    return {
      bootstrap: require('bootstrap'),
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
  }
}
</script>

<style scoped>
  img.fb-logo {
    width: auto !important;
    height: 38px;
  }
</style>