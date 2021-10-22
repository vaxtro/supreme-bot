chrome.storage.local.get('sizeID', function(data) {
    function clickAdd() {
        document.querySelector('input[name="commit"]').click();
    }

    function select(id, value) {
        let element = document.getElementById(id);
        element.value = value;
        clickAdd();
    }

    select("s", data.sizeID);

    setTimeout(function() {
        window.location.href = "https://supremenewyork.com/checkout";
    }, 1500);
});