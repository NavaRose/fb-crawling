<template>
  <div id="body" class="container">
    <div class="alert alert-dismissible fade hide position-fixed" role="alert">
      <p id="alert-content"></p>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="col-12 mt-2">
      <SearchForm></SearchForm>
      <div id="table-block" class="row" style="display: none;">
        <div class="row">
          <div class="col-12 mt-5">
            <div class="col-12">
              <p><strong>Filters:</strong></p>
            </div>
            <div class="form-row align-items-center">
              <div class="col-2 pr-5 my-1">
                <button id="de-dup" class="btn btn-primary">De-Dup</button>
              </div>
              <div class="col-3 pr-5 my-1">
                <button id="fetch-all" class="btn btn-primary">Fetch All</button>
              </div>
              <div class="col-2 pr-5 my-1">
                <label class="mr-sm-2 sr-only" for="select-location">Location</label>
                <select class="custom-select mr-sm-2" id="select-location">
                  <option value="" selected>Location</option>
                  <optgroup label="Tp. Hồ Chí Minh">Tp. Hồ Chí Minh</optgroup>
                  <option value="quận 1">- Quận 1</option>
                  <option value="quận 2">- Quận 2</option>
                  <option value="quận 3">- Quận 3</option>
                  <option value="quận 4">- Quận 4</option>
                  <option value="quận 5">- Quận 5</option>
                  <option value="quận 6">- Quận 6</option>
                  <option value="quận 7">- Quận 7</option>
                  <option value="quận 8">- Quận 8</option>
                  <option value="quận 9">- Quận 9</option>
                  <option value="quận 10">- Quận 10</option>
                  <option value="quận 11">- Quận 11</option>
                  <option value="quận 12">- Quận 12</option>
                  <option value="quận tân bình">- Quận Tân Bình</option>
                  <option value="quận tân phú">- Quận Tân Phú</option>
                  <option value="quận bình tân">- Quận Bình Tân</option>
                  <option value="quận phú nhuận">- Quận Phú Nhuận</option>
                  <option value="quận bình thạnh">- Quận Bình Thạnh</option>
                  <option value="quận thủ đức">- Quận Thủ Đức</option>
                  <option value="quận gò vấp">- Quận Gò Vấp</option>
                  <option value="huyện bình chánh">- Huyện Bình Chánh</option>
                  <option value="huyện hóc môn">- Huyện Hóc Môn</option>
                  <option value="huyện củ chi">- Huyện Củ Chi</option>
                  <option value="huyện nhà bè">- Huyện Nhà Bè</option>
                  <option value="huyện cần giờ">- Huyện Cần Giờ</option>
                </select>
              </div>
              <div class="col-2 my-1">
                <div class="custom-control custom-checkbox mr-sm-2">
                  <input type="checkbox" class="custom-control-input" id="shop-only">
                  <label class="custom-control-label" for="shop-only">Shop only</label>
                </div>
              </div>
              <div class="col-3 my-1">
                <div class="custom-control mr-sm-2">
                  <input type="search" class="form-control" id="search-in-result" placeholder="Search in Results">
                </div>
              </div>
            </div>
            <div class="row">
              <div id="search-result-information" class="col-12 mt-5" style="display: none;">
                <div class="col-12">
                  <p><strong>Total results:</strong> <span id="total-records">0</span></p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 mt-3">
            <div class="m-auto pagination"></div>
          </div>
          <div class="col-12 m-auto">
            <table id="result-table" class="display table">
              <thead>
              <tr>
                <th class="datatable-thead-thumbnail">Thumbnail</th>
                <th class="datatable-thead-info">Information</th>
                <th id="action-column" class="datatable-thead-info">
                </th>
              </tr>
              </thead>
              <tbody id="record-listing">
              </tbody>
            </table>
          </div>
          <div class="col-12 mt-3">
            <div class="m-auto pagination"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchForm from "@/components/SearchForm";

export default {
  name: 'App',
  components: {
    SearchForm
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .datatable-thead-thumbnail {
    width: 120px !important;
  }

  #notification {
    min-height: 36px;
    font-weight: bold;
  }

  .search-input {
    border: 0.5px solid #cce5ff;
  }

  .success-notification {
    color: #28a745;
  }

  .failed-notification {
    color: #ff0000;
  }

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
