$(document).ready(function(){
	function updatePortfolio(){
		chrome.storage.sync.get({
			apiKey: '',
			refreshInterval: 30
		}, function(items) {
			setTimeout(updatePortfolio, items.refreshInterval * 1000);
			
			var api_url = 'https://api-v0.blockfolio.com/rest/get_all_positions/' + items.apiKey;
			
			$.ajax({
				dataType: "json",
				url: api_url,
				type: 'GET',
				success: function(result){
					var usd_value = result['portfolio']['usdValue'];
					
					if (usd_value >= 10000){
						usd_value =(usd_value/1000).toFixed(2).toString() + 'k'
					}
					else {
						usd_value = usd_value.toString()
					}
					
					chrome.browserAction.setBadgeText({text: usd_value});
					chrome.browserAction.setBadgeBackgroundColor({color: '#000000'});
				},
			});
		})
	}

	setTimeout(updatePortfolio, 0);
});