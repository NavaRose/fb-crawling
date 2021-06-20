<template>
  <button id="{{ elements.sheetConfigModal }}" class="btn btn-block btn-info float-right" type="button"
          v-on:click="toggleModal">{{ label.sheetConfig }}</button>
  <!-- Modal -->
  <div class="modal fade" id="sheet-config-modal" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ label.modalHeaderText }}</h5>
          <button type="button" class="btn-close" v-on:click="toggleModal"></button>
        </div>
        <div class="modal-body">
          <input name="sheet_url" id="sheet-url" class="form-control" v-model="userConfigs.sheetUrl">
          <div id="sheet-url-feedback" class="invalid-feedback"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" v-on:click="toggleModal"><i class=""></i>Close</button>
          <button type="button" class="btn btn-primary" id="{{ elements.saveBtn }}"
                  v-on:click="saveUrl"
          >{{ label.saveBtn }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SearchForm from '@/components/SearchForm'
export default {
  name: "SheetConfig",
  extends: SearchForm,
  data() {
    return {
      el: '#sheet-config',
      urls: {
        saveUrl: 'https://jsonplaceholder.typicode.com/users'
      },
      label: {
        modalHeaderText: 'Please enter google sheet url',
        sheetConfig: 'Sheet ID',
        saveBtn: 'Save changes'
      },
      elements: {
        sheetConfigModal: 'sheet-config-modal',
        urlInput: 'sheet-url',
        saveBtn: 'save-sheet-url'
      },
      instances: {
        sheetConfigModal: ''
      },
      userConfigs: {
        sheetUrl: ''
      }
    }
  },
  methods: {
    toggleModal() {
      this.instances.sheetConfigModal.toggle();
    },
    saveUrl() {
      // let searchKey = document.getElementById(this.elements.searchInput).value;
      let response = axios.get(this.urls.saveUrl);
      response.then((response) => {
        console.log(response);
      });
    }
  },
  mounted() {
    this.instances.sheetConfigModal = new this.bootstrap.Modal(document.getElementById(this.elements.sheetConfigModal));
  }
}
</script>

<style scoped>

</style>