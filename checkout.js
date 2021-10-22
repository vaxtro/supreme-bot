var billingArray = "";
var chkDelay = "";

chrome.storage.local.get('user_bill_array', function(data) {
    billingArray = data.user_bill_array;

    document.getElementById('order_billing_name').value=billingArray[0]
    document.getElementById('order_email').value=billingArray[1]
    document.getElementById('order_tel').value=billingArray[2]
    document.getElementById('order_billing_zip').value=billingArray[5]
    document.getElementById('order_billing_city').value=billingArray[6]

    $('*[placeholder$="address"]').val(billingArray[3]);
    $('*[placeholder$="apt, unit, etc"]').val(billingArray[4]); /* this is apt address btw */
    $('*[placeholder$="number"]').val(billingArray[9]);
    $('*[placeholder$="CVV"]').val(billingArray[10]);

    function select(id, value) {
        let element = document.getElementById(id);
        element.value = value;
    }

    select("order_billing_state", billingArray[7]);

    select("order_billing_country", billingArray[8]);

    select("credit_card_month", billingArray[11]);

    select("credit_card_year", billingArray[12]);

    document.querySelector('input[name="order[terms]"]').click();

    //$("input[name$='order[terms]']").val("1");
});

chrome.storage.local.get('chkDelay', function(data) {
    chkDelay = data.chkDelay;

    setTimeout(function() {
        document.querySelector('input[name="commit"]').click();
        console.log(chkDelay)
    }, chkDelay * 1000);
});