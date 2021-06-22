<template>
    <div class="col-12 mt-3">
        <div class="m-auto pagination"></div>
    </div>
    <!--    Table      -->
    <div class="col-12 m-auto">
        <table id="result-table" class="display table">
            <thead>
            <tr>
                <th class="datatable-thead-thumbnail">Thumbnail</th>
                <th class="datatable-thead-info">Information</th>
                <th id="action-column" class="datatable-thead-info"></th>
            </tr>
            </thead>
            <tbody id="record-listing">
                <tr v-for="item in tableItems" :key="item.id">
                    <td>
                        <img width="120"
                             height="120"
                             :src="item.thumbnail.src"
                             :alt="item.rawTitle">
                    </td>
                    <td>
                        <a :href="item.rawUrl" target="_blank"><p v-html="item.title"></p></a>
                        <p v-html="item.description"></p>
                        <a :href="item.rawUrl" target="_blank"><p v-html="item.url" class="mb-1"></p></a>
                    </td>
                    <td><button type="button" class="btn btn-success">Save</button></td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="col-12 mt-3">
        <div class="m-auto pagination"></div>
    </div>
</template>

<script>
export default {
    name: "RecordTable",
    props: ['tableItems'],
    data() {
        return {
        }
    },
    methods: {
        clickEvent() {
            console.log(this.tableItems)
            console.log(this.items)
        }
    }
}
</script>

<style scoped>
table .fb-link {
    color: dodgerblue !important;
}

table tbody tr td .fb-link b {
    background: yellow;
}

table tbody tr td .page-description b {
    color: red;
    background: yellow;
    font-style: oblique;
}
</style>