<template>
    <div class="col-12 mt-5">
        <div class="col-12">
            <p><strong>Filters:</strong></p>
        </div>
        <div class="row">
            <div class="col-2 d-grid pr-2 my-1">
                <button class="btn btn-primary">{{ label.deDupBtn }}</button>
            </div>
            <div class="col-3 d-grid pr-2 my-1">
                <button class="btn btn-primary">{{ label.saveAllBtn }}</button>
            </div>
            <div class="col-7 d-grid my-1">
                <div class="custom-control">
                    <input type="search" class="form-control" v-bind:placeholder="label.searchPlaceHolder" v-on:keyup="search">
                </div>
            </div>
        </div>
        <div class="row" v-if="data.totalResult > 0">
            <div class="row mt-5">
                <div class="col-12">
                    <p><strong>{{ label.totalResult }}:</strong> <span id="total-records">{{ data.totalResult }}</span></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ToolBar",
    data() {
        return {
            label: {
                deDupBtn: "De-Dup",
                saveAllBtn: "Save All",
                searchPlaceHolder: "Search in Results",
                totalResult: "Total results"
            },
            data: {
                totalResult: 0
            }
        }
    },
    methods: {
        search(e) {
            let searchValue = e.target.value;
            console.log(searchValue);
        }
    }
}
</script>

<style scoped>

</style>