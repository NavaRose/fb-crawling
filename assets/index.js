var $ = jQuery;
var page = 1;
var dataTable = {
    table_id: '#result-table',
    table_element: $('#result-table'),
    data_table: null
};
var notification_timeout = null;
var is_fetch_all = false;
var all_ready_add_all = false;
var pagination_display = 'block';

var constant = {
    sheet_url: 'sheet_url'
}

var dom_element = {
    alert: '.alert',
    sheet_id_btn: '#sheet-id-button',
    search_form: '#search-form',
    search_btn: '#searching-key-fb'
}
var api_config = null;

getApiConfig().then(function (config) {
    api_config = config;
}, function (message) {
    $(dom_element.search_form).find('input').attr('disabled', true);
    $(dom_element.search_form).find('button').attr('disabled', true);
    displayErrorMessage(message);
});

function initEvents() {
    $(dom_element.alert).alert();

    if (getCookie(constant.sheet_url) === '') {
        let inner_text = $(dom_element.sheet_id_btn).html();
        $(dom_element.sheet_id_btn).html('<i class="fa fa-exclamation-circle"></i>' + inner_text);
    }

    $(document).on('click', dom_element.search_btn, function (e) {
        e.preventDefault();
        is_fetch_all = false;
        pagination_display = 'block';
        reInitButtons();
        initDataTable();

    });

    $(document).on('click', dom_element.sheet_id_btn, function (e) {
        e.preventDefault();
        let that = $(this);
        that.html('<span class="add-button-spinner" style="display: inline"><i class="fa fa-spinner fa-pulse fa-fw"></i></span> Sheet ID');
        $.ajax({
            url: 'index.php',
            method: 'get',
            data: {
                action: 'check_authorized',
                location_url: window.location.origin
            }
        }).done(function (response) {
            if (response.code !== 200) {
                location.href = response.message;
                return;
            }
            let process_icon = '';
            if (getCookie(constant.sheet_url) === '') {
                process_icon = `<i class="fa fa-exclamation-circle"></i>`;
            }
            $(dom_element.sheet_id_btn).html(process_icon + ' Sheet ID');
            $('#enter-sheet-url').modal('toggle');
        });
    });

    $(document).on('click', '.add-row-to-sheet', function () {
        let that = $(this);
        if (getCookie(constant.sheet_url) === '') {
            displayErrorMessage('Please input the url of Google Sheet');
            return;
        }
        addingButtonAnimation(that);
        let rows = dataTable.data_table.rows().data().toArray()[that.attr('data-item')];
        let outputData = [];
        outputData.push([rows.title, rows.link, rows.snippet, rows.likesIncludedContent]);
        $.ajax({
            url: 'index.php',
            method: 'post',
            data: {
                action: 'add_single_record',
                item: outputData
            }
        }).done(function (response) {
            if (response.code === 200) {
                addingDoneButtonAnimation(that);
                displaySuccessMessage(response.message);
            } else {
                displayErrorMessage(response.message);
            }
            addingDoneButtonAnimation(that);
        });
    });

    $(document).on('click', '#button-add-all', function () {
        if (getCookie(constant.sheet_url) === '') {
            displayErrorMessage('Please input the url of Google Sheet');
            return;
        }
        addAllButtonAnimation();
        addAllNormal();
    });

    $(document).on('click', '#save-sheet-url', function () {
        let that = $(this);
        $(dom_element.sheet_id_btn).removeClass('is-invalid');
        $('#sheet-url-feedback').text('');
        let sheet_url_input_element = $('#sheet-url')
        if (sheet_url_input_element.val() === '') {
            sheet_url_input_element.addClass('is-invalid');
            $('#sheet-url-feedback').text('Sheet url is empty.');
            return;
        } else {
            sheet_url_input_element.removeClass('is-invalid');
            $('#sheet-url-feedback').text('');
        }
        addingButtonAnimation(that, 'Saving');
        setCookie(constant.sheet_url, sheet_url_input_element.val(), 7);
        $.ajax({
            url: 'index.php',
            method: 'post',
            data: {
                action: 'validate_sheet_url'
            }
        }).done(function (response) {
            if (response.code === 200) {
                $('#enter-sheet-url').modal('hide');
                displaySuccessMessage(response.message);
                $(dom_element.sheet_id_btn).html('Sheet ID');
            } else {
                sheet_url_input_element.addClass('is-invalid');
                $('#sheet-url-feedback').text('Invalid sheet url.');
                setCookie(constant.sheet_url, '', 7);
            }
            savingDoneSheetUrlAnimation(that);
        });

    });

    $(document).on('click', '#shop-only', function () {
        is_fetch_all = false;
        pagination_display = 'block';
        initDataTable();
    });

    $(document).on('click', '#have-likes-only', function () {
        is_fetch_all = false;
        pagination_display = 'block';
        initDataTable();
    });

    $(document).on('change', '#select-location', function () {
        pagination_display = 'block';
        is_fetch_all = false;
        reInitDataTable(api_config.config_data.q);
    });

    $(document).on('click', '#fetch-all', function () {
        if (dataTable.data_table === null) {
            displayErrorMessage('Search input is empty.');
            return;
        }
        pagination_display = 'none';
        disableButton($(dom_element.search_btn));
        disableButton($('#button-add-all'));
        disableButton($('.add-row-to-sheet'));
        fetchAllButtonAnimation();
        dataTable.data_table.clear();
        is_fetch_all = true;
        let fetch_all = new Promise(function (resolve, reject) {
            getDataFoFetchAll(1, [], resolve, reject);
        });
        fetch_all.then(
            function () {
                reInitButtons();
                fetchAllDoneButtonAnimation();
                enableButton($(dom_element.search_btn));
                enableButton($('#button-add-all'));
                dataTable.data_table.draw();
            },
            function (i) {
                console.log(i);
            }).catch(function (reason) {
            console.log(reason);
        });
    })

    $(document).ready(function (e) {
        let sheet_url = getCookie(constant.sheet_url);
        if (sheet_url !== '') {
            $('#sheet-url').val(sheet_url);
        }
    })

    $(document).on('click', '#de-dup', function (e) {
        let that = $(this);
        addingButtonAnimation(that, 'Processing');
        $.ajax({
            url: 'index.php',
            method: 'post',
            data: {
                action: 'de_dup'
            }
        }).done(function (response) {
            if (response.code === 200) {
                displaySuccessMessage(response.message);
            } else {
                displayErrorMessage(response.message);
            }
            addingDoneButtonAnimation(that);
        });
    });
}

function getApiConfig() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: '/config/config.json',
            method: 'get'
        }).done(function (config, xhr, response) {
            if (response.getResponseHeader('content-type') !== 'application/json') {
                reject('Not found or invalid config file. Cannot get API config.');
                return false;
            }
            resolve(config);
        }).fail(function (res) {
            console.log(res)
        });
    });
}

function addAllNormal(data = null) {
    let outputData = [];
    let rows = data;
    if (data === null) {
        rows = dataTable.data_table.rows().data().toArray();
    }
    console.log(rows);
    for (var i = 0; i < rows.length; i++) {
        let input = rows[i];
        outputData.push([input.title, input.link, input.snippet, input.likesIncludedContent]);
    }
    $.ajax({
        url: 'index.php',
        method: 'post',
        data: {
            action: 'add_all_record',
            item: outputData
        }
    }).done(function (response) {
        if (response.code === 200) {
            let add_buttons = $(document).find('.add-row-to-sheet');
            add_buttons.each(function (index, item) {
                addingDoneButtonAnimation($(item));
            });
            displaySuccessMessage(response.message);
        } else {
            displayErrorMessage(response.message);
        }
        addAllDoneButtonAnimation();
    });
}

function generateQueryString() {
    let query_string = $('#search').val();
    if (query_string === '') {
        return false;
    }
    if ($('#have-likes-only:checked').length) {
        query_string += ' + "0..1000000000 likes"';
    }
    let is_checked = $('#shop-only:checked').length;
    if (is_checked) {
        query_string += ' + "shop"';
    }
    if ($('#select-location').val() !== '') {
        query_string += ' + "' + $('#select-location').val() + '"';
    }
    return query_string;
}

function processApiData(items) {
    let return_data = [];
    for (var i = 0; i < items.length; i++) {
        let row = items[i];
        let thumbnail = {
            src: '/assets/image/no-avatar.jpeg',
            height: 150,
            width: 150,
        };
        if (typeof row.pagemap.cse_thumbnail !== "undefined") {
            thumbnail.src = row.pagemap.cse_thumbnail[0].src;
        }

        let title = row.title;
        if (typeof row.pagemap.metatags[0]['og:title'] !== "undefined") {
            title = row.pagemap.metatags[0]['og:title'];
        }

        let likeIncluded = '';
        if (typeof row.pagemap.metatags[0]['og:description'] !== "undefined") {
            likeIncluded = row.pagemap.metatags[0]['og:description'];
        }

        let link = `<a class="fb-link" target="_blank" href="${row.link}">${row.htmlFormattedUrl}</a>`;

        // let htmlSnippet = row.htmlSnippet;
        // htmlSnippet = htmlSnippet.replace(new RegExp('<b>số điện thoại</b>', 'g'), 'số điện thoại');
        // htmlSnippet = htmlSnippet.replace(new RegExp('<b>Số điện thoại</b>', 'g'), 'Số điện thoại');
        // htmlSnippet = htmlSnippet.replace(new RegExp('<b>Số Điện Thoại</b>', 'g'), 'Số Điện Thoại');
        // htmlSnippet = htmlSnippet.replace(new RegExp('<b>SỐ ĐIỆN THOẠI</b>', 'g'), 'SỐ ĐIỆN THOẠI');
        // htmlSnippet = htmlSnippet.replace(new RegExp('<b>sdt</b>', 'g'), 'sdt');
        // htmlSnippet = htmlSnippet.replace(new RegExp('<b>Sdt</b>', 'g'), 'Sdt');
        // htmlSnippet = htmlSnippet.replace(new RegExp('<b>SDT</b>', 'g'), 'SDT');
        // htmlSnippet = htmlSnippet.replace(new RegExp('<b>sđt</b>', 'g'), 'sđt');
        // htmlSnippet = htmlSnippet.replace(new RegExp('<b>Sđt</b>', 'g'), 'Sđt');
        // htmlSnippet = htmlSnippet.replace(new RegExp('<b>SĐT</b>', 'g'), 'SĐT');
        let processedHtmlSnippet = `<p class="mt-2 page-description">${row.htmlSnippet}</p>`;


        let item_data = items.indexOf(row);
        let action = `<button class="btn btn-success btn-block add-row-to-sheet" data-item="${item_data}">Add</button>`;
        if (all_ready_add_all) {
            action = `<button class="btn btn-dark btn-block add-row-to-sheet" data-item="${item_data}" disabled>Done !!!</button>`;
        }
        return_data.push({
            'image': `<img src="${thumbnail.src}" width="${thumbnail.width}" height="${thumbnail.height}">`,
            'description': `<b>${title}</b><br />${link}<br />${processedHtmlSnippet}`,
            'action': action,
            'displayLink': row.displayLink,
            'formattedUrl': row.formattedUrl,
            'title': row.title,
            'link': row.link,
            'snippet': row.snippet,
            'likesIncludedContent': likeIncluded
        });
    }
    return return_data;
}

function drawPagination() {
    if (dataTable.data_table === null || dataTable.data_table.rows().data().length < 1) {
        $('.pagination').css('display', 'none');
        return;
    }

    let prev_button_class = '';
    let next_button_class = '';

    if (page <= 1) {
        prev_button_class = 'disabled';
    } else if (page >= 10) {
        next_button_class = 'disabled';
    }

    let html = `<nav style="display: table;margin: 0 auto;">
                    <ul class="pagination">
                        <li class="page-item ${prev_button_class}" data-value="${page - 1}">
                            <a class="page-link" href="javascript:void();">Previous</a>
                        </li>`;
    for (let i = 1; i <= 10; i++) {
        let disable_class = '';
        if (i === page) {
            disable_class = 'disabled';
        }
        html += `<li class="page-item ${disable_class}" data-value="${i}">
                    <a class="page-link" href="javascript:void();">${i}</a>
                </li>`;
    }
    html += `<li class="page-item ${next_button_class}" data-value="${page + 1}">
                <a class="page-link" href="javascript:void();">Next</a>
            </li></ul></nav>`;
    $('.pagination').html(html).css('display', pagination_display);
    initPaginationEvents();
}

function initDataTable() {
    is_fetch_all = false;
    if ($('#search').val() === '') {
        displayErrorMessage('Search input is empty.')
        return;
    }
    page = 1;
    if (dataTable.data_table !== null) {
        api_config.config_data.start = 1;
        api_config.config_data.q = $('#search').val();
        reInitDataTable($('#search').val());
        return;
    }

    api_config.config_data.q = generateQueryString();
    dataTable.data_table = dataTable.table_element.DataTable({
        "ordering": false,
        "processing": true,
        "searching": true,
        "info": false,
        "filter": true,
        "drawCallback": drawPagination,
        "initComplete": function (settings, json) {
            if (typeof json.searchInformation !== "undefined") {
                $('#total-records').text(json.searchInformation.formattedTotalResults);
                $('#search-result-information').css('display', 'block');
            }
        },
        "paging": false,
        "ajax": {
            "url": api_config.get_data_url,
            "dataSrc": function (json) {
                if (typeof json.items === "undefined") {
                    json.items = [];
                }
                return processApiData(json.items);
            },
            "data": api_config.config_data
        },
        "deferRender": true,
        "columns": [
            {data: "image"},
            {data: "description"},
            {data: "action"}
        ]
    });

    $('#search-in-result').on('keyup change', function () {
        let search_key = $(this).val();
        pagination_display = 'block';
        if ($(this).val() !== '') {
            pagination_display = 'none';
        } else {
            if (is_fetch_all === true) {
                pagination_display = 'none';
            }
        }
        dataTable.data_table.columns(1).search(search_key);
        dataTable.data_table.draw();
    });
    $('#table-block').css('display', 'block');
}

function reInitDataTable(current_query_string = '') {
    let query_string = generateQueryString();
    if (query_string !== false) {
        api_config.config_data.q = query_string;
    }
    $.get(api_config.get_data_url, api_config.config_data, function (data) {
        if (typeof data['items'] === "undefined" || data['items'].length < 1) {
            data['items'] = [];
        }
        $('#total-records').text(data['searchInformation']['formattedTotalResults']);
        let processed_data = processApiData(data['items']);
        dataTable.data_table.clear();
        dataTable.data_table.rows.add(processed_data);
        dataTable.data_table.draw();
        if (current_query_string !== '') {
            api_config.config_data.q = current_query_string;
            $('#search').val(current_query_string);
        }
    });
}

function initPaginationEvents() {
    $('.pagination .page-item').on('click', function (e) {
        if ($(this).hasClass('disabled') || $(this).attr('disabled') === true) {
            return;
        }
        $('.page-item').addClass('disabled');
        e.preventDefault();
        let value = $(this).attr("data-value");
        api_config.config_data.start = 1 + ((10 * value) - 10);
        page = parseInt(value);
        reInitDataTable(api_config.config_data.q);
    })
}

function getDataFoFetchAll(i, data_collection, resolve, reject) {
    api_config.config_data.start = i;
    $.get(api_config.get_data_url, api_config.config_data, function (data) {
        if (typeof data.items === "undefined" || data.items.length <= 0) {
            enableButton($(dom_element.search_btn));
            fetchAllDoneButtonAnimation();
            reject('Not found any items');
        }
        dataTable.data_table.rows.add(processApiData(data.items));
        if (i >= 91) {
            resolve(data_collection);
            return;
        }
        getDataFoFetchAll(i + 10, data_collection, resolve, reject);
    });
}

function setCookie(key, value, expiry) {
    let expires = new Date();
    expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 7));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function fetchAllButtonAnimation() {
    let button_element = $('#fetch-all');
    let button_html = button_element.html();

    button_element.html(`<i class="fa fa-spinner fa-pulse fa-fw"></i> ${button_html}`);
    button_element.attr('disabled', true);
}

function fetchAllDoneButtonAnimation() {
    let button_element = $('#fetch-all');
    button_element.html('Fetch All');
    button_element.attr('disabled', false);
}

function savingDoneSheetUrlAnimation(element) {
    element.html('Save changes');
    element.removeClass('btn-info');
    element.addClass('btn-primary');
    element.attr('disabled', false);
}

function addingButtonAnimation(element, text = '') {
    if (text === '') {
        text = 'Adding';
    }
    element.html(`<span class="add-button-spinner" style="display: inline"><i class="fa fa-spinner fa-pulse fa-fw"></i></span> ${text}...`);
    element.removeClass('btn-success');
    element.addClass('btn-info');
    element.attr('disabled', true);
}

function addingDoneButtonAnimation(element) {
    element.html('Done !!!');
    element.removeClass('btn-info');
    element.addClass('btn-dark');
    element.attr('disabled', true);
}

function addAllButtonAnimation() {
    let add_all_element = $('#button-add-all');
    add_all_element.html('<span class="add-button-spinner" style="display: inline"><i class="fa fa-spinner fa-pulse fa-fw"></i></span> Adding...');
    add_all_element.removeClass('btn-primary');
    add_all_element.addClass('btn-info');
    add_all_element.attr('disabled', true);
    addingButtonAnimation($('.add-row-to-sheet'));
}

function addAllDoneButtonAnimation() {
    let add_all_element = $('#button-add-all');
    add_all_element.html('Done !!!');
    add_all_element.removeClass('btn-info');
    add_all_element.addClass('btn-dark');
    add_all_element.attr('disabled', true);
    addingDoneButtonAnimation($('.add-row-to-sheet'));

}

function displayErrorMessage(message) {
    let alert_element = $('.alert');
    $('#alert-content').html(message);
    alert_element.addClass('alert-danger');
    alert_element.addClass('show');
    notification_timeout = setTimeout(function () {
        if (notification_timeout == null) {
            return;
        }
        clearTimeout(notification_timeout);
        notification_timeout = null;
        $('#alert-content').html('');
        alert_element.removeClass('alert-danger');
        alert_element.removeClass('show');
    }, 5000);
}

function displaySuccessMessage(message) {
    let alert_element = $('.alert');
    $('#alert-content').html(message);
    alert_element.addClass('alert-success');
    alert_element.addClass('show');
    notification_timeout = setTimeout(function () {
        if (notification_timeout == null) {
            return;
        }
        clearTimeout(notification_timeout);
        notification_timeout = null;
        $('#alert-content').html('');
        alert_element.removeClass('alert-success');
        alert_element.removeClass('show');
    }, 5000);
}

function reInitButtons() {
    all_ready_add_all = false;
    let button_add_all_element = $('#button-add-all');
    let button_de_dup_element = $('#de-dup');
    let button_add_row_element = $('.add-row-to-sheet')
    if (button_add_all_element.hasClass('btn-dark')) {
        button_add_all_element.text('Add All');
        button_add_all_element.addClass('btn-primary');
        button_add_all_element.removeClass('btn-dark');
        button_add_all_element.attr('disabled', false);
    }
    if (button_de_dup_element.hasClass('btn-dark')) {
        button_de_dup_element.text('De-Dup');
        button_de_dup_element.removeClass('btn-dark');
        button_de_dup_element.attr('disabled', false);
    }
    if (button_add_row_element.hasClass('btn-dark')) {
        button_add_row_element.text('Add');
        button_add_row_element.removeClass('btn-dark');
        button_add_row_element.addClass('btn-success');
        button_add_row_element.attr('disabled', false);
    }

}

function disableButton(element) {
    element.attr('disabled', true);
    element.addClass('btn-disable');
}

function enableButton(element) {
    element.attr('disabled', false);
    element.removeClass('btn-disable');
}

initEvents();