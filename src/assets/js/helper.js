const helper = {
    loadingOverlay: function (action, element = null) {
        let el = element;
        if (element == null) {
            el = document.getElementById('app');
        }
        if (action === 'show') {
            el.classList.add("overlay");
        } else if (action === 'hide') {
            el.classList.remove("overlay");
        }
    },
    apiGet: function (url, params, success = null, error = null) {
        this.loadingOverlay('show');
        params.method = 'get';
        const api = fetch(url, params);
        api.then((res) => res.json())
            .then((data) => {
                this.loadingOverlay('hide');
                if (success !== null && typeof success === "function") {
                    success(data);
                }
                return data;
            })
            .catch((err) => {
                console.log(err);
                this.loadingOverlay('hide');
                if (error !==  null && typeof error === "function") {
                    error(err);
                }
            });
    }
}
export default helper;