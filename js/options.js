function save_options() {
    var refresh_interval = document.getElementById('refresh-interval').value.trim();
    var api_key = document.getElementById('api-key').value.trim();
  
    chrome.storage.sync.set({
        apiKey: api_key,
        refreshInterval: refresh_interval
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
  });
}

function restore_options() {
    chrome.storage.sync.get({
        apiKey: '',
        refreshInterval: 30
    }, function(items) {
        document.getElementById('refresh-interval').value = items.refreshInterval;
        document.getElementById('api-key').value = items.apiKey;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);