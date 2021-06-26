<template>
    <div id="body" class="container">
        <div class="alert alert-dismissible fade hide position-fixed" role="alert">
            <p id="alert-content"></p>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="col-12 mt-2">
            <SearchForm @update-data="updateData"></SearchForm>
            <div id="table-block" class="row">
                <ToolBar></ToolBar>
                <RecordTable :table-items="items"></RecordTable>
            </div>
        </div>
    </div>
</template>

<script>
import SearchForm from "@/components/SearchForm";
import RecordTable from "@/components/RecordTable";
import ToolBar from "@/components/ToolBar";

export default {
    name: 'App',
    components: {
        ToolBar,
        RecordTable,
        SearchForm
    },
    data() {
        return {
            items: []
        }
    },
    methods: {
        updateData(data) {
            this.items = data;
        }
    }
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
}

.overlay {
    opacity: 0.8;
    z-index: 9999999999999 !important;
    height: 100%;
}

.overlay::before {
    background: #fff;
    opacity: 0.7;
    content: url("./assets/images/overlay.svg");
    text-align: center;
    position: absolute;
    //top: ;
    //left: 0;
    width: 100%;
    height: 100%;
}

.datatable-thead-thumbnail {
    width: 120px !important;
}

#notification {
    min-height: 36px;
    font-weight: bold;
}


.success-notification {
    color: #28a745;
}

.failed-notification {
    color: #ff0000;
}

#result-table_filter {
    display: none !important;
}

.alert {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 9999;
}
</style>
