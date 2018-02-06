function updatePortfolio() {
    chrome.storage.sync.get({
        apiKey: '',
        refreshInterval: 30,
        fiatMode: false
    }, function(items) {
        var api_url = 'https://api-v0.blockfolio.com/rest/get_all_positions/' + items.apiKey;

        if (items.apiKey == '') {
            $('#error-message').html('Blockfolio token is not specified<br>Please visit extension options to change it');
            $('#error-message').fadeIn(200);
            return;
        }

        $('#spinner').show();

        $.ajax({
            dataType: "json",
            url: api_url,
            type: 'GET',
            success: function(result) {
                $('#table-body').empty();
                $('#total-usd').text(result['portfolio']['usdValue'].toFixed(2));
                $('#total-btc').text(result['portfolio']['btcValue'].toFixed(2));
                $('#ChangeFiat').text(result['portfolio']['twentyFourHourPercentChangeFiat'].toFixed(2));
                $('#ChangeBtc').text(result['portfolio']['twentyFourHourPercentChangeBtc'].toFixed(2));

                $.each(result['positionList'].sort(
                    function(obj1, obj2) {
                        return obj2['holdingValueFiat'] - obj1['holdingValueFiat'];
                    }),
                    function( index, value ) {
                        var price_html;
                        var holdings_html;

                        if (items.fiatMode){
                            price_html = (
                                value['fiatSymbol'] + Number(value['lastPriceFiat'].toFixed(2)) + '<br/>' +
                                '<span class="' + (value['twentyFourHourPercentChangeFiat'] > 0 ? 'up' : 'down') + '">' + value['twentyFourHourPercentChangeFiat'].toFixed(2) + '%</span>'
                            );

                            holdings_html = (
                                value['fiatSymbol'] + value['holdingValueFiat'].toFixed(2) + '<br/>' +
                                Number(value['quantity'].toFixed(10))
                            );
                        }
                        else {
                            price_html = (
                                value['symbol'] + Number(value['lastPrice'].toFixed(7)) + '<br/>' +
                                '<span class="' + (value['twentyFourHourPercentChange'] > 0 ? 'up' : 'down') + '">' + value['twentyFourHourPercentChange'].toFixed(2) + '%</span>'
                            );

                            holdings_html = (
                                value['symbol'] + Number(value['holdingValueBtc'].toFixed(7)) + '<br/>' +
                                Number(value['quantity'].toFixed(10))
                            );
                        }

                        var html_text = (
                            '<tr>' +
                            '<td class="coin">' + '<img src="' + value['coinUrl'] + '">' + '<br/>' + value['coin'] +  '</td>' +
                            '<td class="holdings">'+ holdings_html + '</td>' +
                            '<td class="price">' + price_html +'</td>' +
                            '</tr>'
                        );

                        $('#table-body').append(html_text);

                        //$('#mainPopup').css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1}, 200);
                        $('#mainPopup').fadeIn(200);
                })
            },
        });

        $('#spinner').hide();
    })
}

function toggleFiat(){
    // TODO better to load all the data only once and then only switch representation
    chrome.storage.sync.get({fiatMode:false}, function(items) {
        chrome.storage.sync.set({
            fiatMode: !items.fiatMode
        }, function (){
            updatePortfolio()
        })
    })
}

$(document).ready(function() {
    var ps = new PerfectScrollbar('#scroll');

    $('#total-usd').click(toggleFiat);
    $('#total-btc').click(toggleFiat);
    updatePortfolio();
})