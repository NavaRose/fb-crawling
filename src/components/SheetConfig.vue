<template>
  <button id="{{ elements.sheetConfigModal }}" class="btn btn-block float-right"
          type="button"
          v-bind:class="userConfigs.sheetUrl ? 'btn-info' : 'btn-warning'"
          v-on:click="toggleModal">
      {{ label.sheetConfig }}
  </button>
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
          <button type="button" class="btn btn-secondary" v-on:click="toggleModal">Close</button>
          <button type="button" class="btn btn-primary" id="{{ elements.saveBtn }}"
                  v-on:click="saveUrl"
          >{{ label.saveBtn }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
        const days = 2;
        const d = new Date();
        d.setTime(d.getTime() + (days*24*60*60*1000));
        document.cookie = `sheetUrl=${this.userConfigs.sheetUrl};expires=${d.toUTCString()};path=/`;
    },
    getUrl() {
        let name = "sheetUrl=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');

        for (const c of ca) {
            let cookie = c;
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, c.length);
            }
        }
        return "";
    }
  },
  mounted() {
    this.instances.sheetConfigModal = new this.bootstrap.Modal(document.getElementById(this.elements.sheetConfigModal));
    this.userConfigs.sheetUrl = this.getUrl();
  }
}
</script>

<style scoped>

</style>