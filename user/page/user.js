document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('name-placeholder').innerText = 'user hilarious';

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', '/user/dataFiles.json', true);
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    var app = document.getElementById('app');
    xhr.onload = function () {
        if (this.status != 200) {
            app.innerText = 'XMLHTTPRequest status ' + this.status;
            return;
        }
        app.appendChild(createMatCollection(this.response));
    }
    xhr.onerror = function() {
        app.innerText = 'XMLHTTPRequest.onerror';
    }
    xhr.send();
});

/**
 * 
 * @param {string[]} list 
 */
function createMatCollection(list) {
    var collection = document.createElement('div');
    collection.className = 'collection';
    list.forEach(fileName => {
        let item = document.createElement('a');
        item.className = `collection-item`;
        item.href = '/user/data/' + fileName;
        item.innerText = fileName;
        item.setAttribute('download', '');
        collection.appendChild(item);
    });
    return collection;
}
