var geth = store.get('geth');
var btc = store.get('btc');
var ltc = store.get('ltc');
if(store.get("saved_tokens") == undefined) {
    configs.savedTokens = [];
} else {
    configs.savedTokens = $.parseJSON(store.get("saved_tokens"));
}
$(".about").html("CoinApp " + store.get('version'));
$("#settings_version").html("v"+store.get('version'));
LoadSettings();

function LoadSettings() {
    var geth = store.get('geth');
    var btc = store.get('btc');
    var ltc = store.get('ltc');
    $("#setting_geth_server").val(geth);
    $("#setting_btc_server").val(btc);
    $("#setting_ltc_server").val(ltc);
    CheckLTCServer();
    CheckETHServer();
    CheckBTCServer();
}

function SaveSettings() {
    ResetServerChecks();
    var gethurl = $("#setting_geth_server").val();
    var btcurl = $("#setting_btc_server").val();
    var ltcurl = $("#setting_ltc_server").val();
    store.set('geth', gethurl);
    store.set('btc', btcurl);
    store.set('ltc', ltcurl);
    configs.provider = new providers.JsonRpcProvider(gethurl);
    $("#save_settings_btn").html("Saved");
    CheckLTCServer();
    CheckETHServer();
    CheckBTCServer();
    ShowNotification("Settings Saved");
}

function ResetServerChecks() {
    $("#eth_server_conn").html("X");
    $("#eth_server_conn").attr("class", "input-group-text bg-danger text-white");
    $("#ltc_server_conn").html("X");
    $("#ltc_server_conn").attr("class", "input-group-text bg-danger text-white");
    $("#btc_server_conn").html("X");
    $("#btc_server_conn").attr("class", "input-group-text bg-danger text-white");
}

function CheckETHServer() {
    var api = store.get('geth');
    var data = JSON.stringify({
        "method": "web3_clientVersion",
        "params": [],
        "id": 1,
        "jsonrpc": "2.0"
    });
    $.ajax({
        type: 'POST',
        url: api,
        contentType: 'application/json',
        dataType: 'json',
        data: data,
        success: function(hh) {
            if(hh.result != "") {
                $("#eth_server_conn").html("✓");
                $("#eth_server_conn").attr("class", "input-group-text bg-success text-white");
            } else {
                $("#eth_server_conn").html("X");
                $("#eth_server_conn").attr("class", "input-group-text bg-danger text-white");
            }
        }
    });
}

function CheckLTCServer() {
    var api = store.get('ltc');
    try {
        $.get(api + "/peer", function(data, status) {
            var connected = data.connected;
            if(connected) {
                $("#ltc_server_conn").html("✓");
                $("#ltc_server_conn").attr("class", "input-group-text bg-success text-white");
            } else {
                $("#ltc_server_conn").html("X");
                $("#ltc_server_conn").attr("class", "input-group-text bg-danger text-white");
            }
        });
    } catch(e) {
        console.error(e);
    }
}

function CheckBTCServer() {
    var api = store.get('btc');
    try {
        $.get(api + "/peer", function(data, status) {
            var connected = data.connected;
            if(connected) {
                $("#btc_server_conn").html("✓");
                $("#btc_server_conn").attr("class", "input-group-text bg-success text-white");
            } else {
                $("#btc_server_conn").html("X");
                $("#btc_server_conn").attr("class", "input-group-text bg-danger text-white");
            }
        });
    } catch(e) {
        console.error(e);
    }
}

function BroadcastTransaction(rawtx) {
    return new Promise(function(resolve, reject) {
        var data = JSON.stringify({
            "rawtx": rawtx
        });
        $.ajax({
            type: 'POST',
            url: configs.api + "/tx/send",
            contentType: 'application/json',
            dataType: 'json',
            data: data,
            success: function(hh) {
                console.log(hh);
                resolve(hh);
            },
            error: function(e) {
                reject(e.responseText)
            }
        });
    });
}