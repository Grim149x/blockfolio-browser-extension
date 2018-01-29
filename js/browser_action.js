$(document).ready(function(){
	function updatePortfolio(){
			chrome.storage.sync.get({
				apiKey: '',
				refreshInterval: 30
			}, function(items) {
				var api_url = 'https://api-v0.blockfolio.com/rest/get_all_positions/' + items.apiKey;
				
				$.ajax({
					dataType: "json",
					url: api_url,
					type: 'GET',
					success: function(result){
						$('#table-body').empty();
						$('#total-usd').text(result['portfolio']['usdValue'].toFixed(2));
						$('#total-btc').text(result['portfolio']['btcValue'].toFixed(2));

						$.each(result['positionList'].sort(
						    function(obj1, obj2) {
						        return obj2['holdingValueFiat'] - obj1['holdingValueFiat'];
                            }),
                            function( index, value ) {
							var html_text = ('<tr>' + 
							'<td class="coin">' + '<img src="' + value['coinUrl'] + '">' + '<br/>' + value['coin'] +  '</td>' + 
							'<td class="holdings">'+ value['fiatSymbol'] + value['holdingValueFiat'].toFixed(2) + '<br/>' + value['quantity'] + '</td>' + 
							'<td class="price">' + value['fiatSymbol'] + value['lastPriceFiat'].toFixed(5) + '<br/><span class="' + value['arrow'] +'">' + value['twentyFourHourPercentChange'].toFixed(2) +'%</span></td>' + 
							'</tr>');
							$('#table-body').append(html_text);
						})
					},
				});
			})
		}
		
	updatePortfolio();
})


