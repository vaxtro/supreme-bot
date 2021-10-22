var itemName = "itemName";
var itemSize = "itemSize";
var itemType = "itemType";
var itemColor = "itemColor";
var itemQty = "itemQty";
var stockData = "";
var itemID = "";
var itemFound = false;
var idData = "";
var colorID ="";
var sizeID = "";
var cartData = "";
var cartStock = "";
var picID = "";

var user_name = "";
var user_email= "";
var user_phone= "";
var user_address = "";
var user_address2 = "";
var user_zip = "";
var user_city = "";
var state_select = "";
var country_select = "";
var user_card = "";
var user_pin = "";
var month_select = "";
var year_select = "";

var billingArray = "";

var toggleLegacy = false;
var chkDelay = "0";
var statusReceived = false;
var loggedIn = false;

var userID = "";

var getSlug = "";

var maincontent = "";
var usercontent = "";
var statuscontent = "";
var logincontent = "";

window.onload = function() {

    chrome.storage.local.get('loggedIn', function(data) {
        if (data.loggedIn == true) {
            console.log(data.loggedIn);
            loggedIn = true;

            usercontent = $("#user-content").detach();
            statuscontent = $("#status-content").detach();
            logincontent = $("#login-content").detach();

        } else if (data.loggedIn == false) {
            console.log(data.loggedIn);
            loggedIn = false;

            usercontent = $("#user-content").detach();
            statuscontent = $("#status-content").detach();
            maincontent = $("#main-content").detach();
        } else {
            data.loggedIn = false;
            console.log(data.loggedIn)
            loggedIn = data.loggedIn;

            usercontent = $("#user-content").detach();
            statuscontent = $("#status-content").detach();
            maincontent = $("#main-content").detach();
        }
    });

    chrome.storage.local.get('user_bill_array', function(data) {
        if (data.user_bill_array != null) {
            billingArray = data.user_bill_array;
        }
    });

    chrome.storage.local.get('userID', function(data) {
        if (data.userID != null) {
            userID = data.userID;
            console.log(userID);

            function checkUserStatus() {
                var getIDURL = "https://flexsheet.cc/root/user/userInfo?id=" + userID;
                $.getJSON(getIDURL, function(data) {
                    var profileData = data.profile;
                    console.log(profileData);
                    if (profileData.member == 0||profileData.ban_status > 0||profileData.id == null) {
                        console.log("error");
                        loggedIn = false;
                        chrome.storage.local.set({'loggedIn' : loggedIn})
                        maincontent = $("#main-content").detach();
                        $(logincontent).insertBefore($(".footer"));
                    }
                });
            }
        
            if (loggedIn == true) {
                checkUserStatus();
            }
            
        }
    });

    if (chkDelay != null) {
        chrome.storage.local.get('chkDelay', function(data) {
            if (data.chkDelay != null && data.chkDelay.length > 0) {
                chkDelay = data.chkDelay;
                console.log(chkDelay)
            } else {
                chkDelay = "0";
                console.log(chkDelay) 
            }
        });
    } else {
        chkDelay = "0";
        console.log(chkDelay)
    }
    

    chrome.storage.local.get('toggleLegacy', function(data) {
        if (data.toggleLegacy == true) {
            console.log(data.toggleLegacy);
            toggleLegacy = true;
        } else if (data.toggleLegacy == false) {
            console.log(data.toggleLegacy);
            toggleLegacy = false;
        } else {
            data.toggleLegacy = false;
            console.log(data.toggleLegacy)
            toggleLegacy = data.toggleLegacy;
        }
    });

    document.getElementById('login_run').onclick = function() {
        if (loggedIn == false) {
        var username = document.getElementById('login_username').value;
        var password = document.getElementById('login_password').value;

        function logoutUser() {
            $.ajax({
                url: "https://flexsheet.cc/user/handle/logout",
                type: "POST",
                contentType: "application/x-www-form-urlencoded",
                success: function() {
                    pushUser();
                },
                error: function() {
                    pushUser();
                }
            });
        }

        logoutUser();

        function pushUser() {
            $.ajax({
                url: "https://flexsheet.cc/user/handle/login",
                type: "POST",
                data: {
                    username: username,
                    password: password,
                    login: "Login"
                },
                contentType: "application/x-www-form-urlencoded",
                success: function() {
                    checkUser();
                },
                error: function() {
                    checkUser();
                }
            });
        }
        
        function checkUser() {
            const checkUserUrl = "https://flexsheet.cc/root/user/checkUserLogged";
            $.getJSON(checkUserUrl, function(data) {
                console.log(data);
                cuData = data.status;
                console.log(cuData);
                if (cuData.loggedIn == true) {
                    console.log("user logged in");
                    if (cuData.username == username) {
                        console.log("correct user");
                        if (cuData.member == "1") {
                            if (cuData.registerIP == cuData.currentIP) {
                                console.log("ip approved")
                                if (cuData.banStatus != 1) {
                                    console.log("success");
                                    userID = cuData.id;
                                    chrome.storage.local.set({'userID' : userID})
                                    console.log(userID);
                                    loggedIn = true;
                                    chrome.storage.local.set({'loggedIn' : loggedIn})
                                    $(maincontent).insertBefore($(".footer"));
                                    logincontent = $("#login-content").detach();
                                } else {
                                    console.log("user banned")
                                    document.getElementById('login-error-msg').innerHTML = "Error";
                                    document.getElementById('login-error-msg-hold').style.display = 'block';
                                }
                            } else {
                                console.log("wrong ip")
                                document.getElementById('login-error-msg').innerHTML = "Error";
                                document.getElementById('login-error-msg-hold').style.display = 'block';
                            }
                        } else {
                            console.log("not a member")
                            document.getElementById('login-error-msg').innerHTML = "Error";
                            document.getElementById('login-error-msg-hold').style.display = 'block';
                        }
                    } else {
                        console.log("wrong user");
                        document.getElementById('login-error-msg').innerHTML = "Error";
                        document.getElementById('login-error-msg-hold').style.display = 'block';
                    }
                } else {
                    console.log("user not logged in");
                    document.getElementById('login-error-msg').innerHTML = "Error";
                    document.getElementById('login-error-msg-hold').style.display = 'block';
                }
            });
        }
        }
    }

    document.getElementById('logout_run').onclick = function() {
        if (loggedIn == true) {
        loggedIn = false;
        chrome.storage.local.set({'loggedIn' : loggedIn})
        $(logincontent).insertBefore($(".footer"));
        maincontent = $("#main-content").detach();
        }
    }

    document.getElementById('item_save').onclick = function() {
        if (loggedIn == true) {
        document.getElementById('item_name').style.borderColor = "#8ab4db";
        document.getElementById('item_size').style.borderColor = "#8ab4db";
        document.getElementById('item_type').style.borderColor = "#8ab4db";
        document.getElementById('item_color').style.borderColor = "#8ab4db";
        document.getElementById('item_qty').style.borderColor = "#8ab4db";

        var item_name = document.getElementById('item_name').value;
        var item_size = document.getElementById('item_size').value;
        var item_type = document.getElementById('item_type').value;
        var item_color = document.getElementById('item_color').value;
        var item_qty = document.getElementById('item_qty').value;

        console.log(item_name + "\t" + item_size + "\t" + item_type + "\t" + item_color + "\tsaving...");
        
        localStorage.setItem(itemName, item_name);
        localStorage.setItem(itemSize, item_size);
        localStorage.setItem(itemType, item_type);
        localStorage.setItem(itemColor, item_color);

        if (item_qty != null && item_qty > "0") {
            localStorage.setItem(itemQty, item_qty);
        } else {
            itemQty = 1;
            localStorage.setItem(itemQty, "1")
        }

        getItemName = localStorage.getItem(itemName);
        getItemSize = localStorage.getItem(itemSize);
        getItemType = localStorage.getItem(itemType);
        getItemColor = localStorage.getItem(itemColor);
        getItemQty = localStorage.getItem(itemQty);

        console.log(getItemQty)
    
        console.log(getItemName + "\t" + getItemSize + "\t" + getItemType + "\t" + getItemColor + "\tsaved...")
    }
    }

    document.getElementById('item_run').onclick = function() {
        if (loggedIn == true) {
        $(statuscontent).insertBefore($(".footer"));
        maincontent = $("#main-content").detach();
        console.log("searching for\t" + getItemName + "\t" + getItemSize + "\t" + getItemType + "\t" + getItemColor + "...");
        document.getElementById('ItemNameDisplay').innerHTML = getItemName;
        document.getElementById('ItemSizeDisplay').innerHTML = getItemSize;
        document.getElementById('ItemTypeDisplay').innerHTML = getItemType;
        document.getElementById('ItemColorDisplay').innerHTML = getItemColor;

        const staticMS = "https://www.supremenewyork.com/mobile_stock.json";
        
        setInterval(getID, Math.floor(Math.random() * 50) + 50);

        function getID () {
            if (itemFound == false) {
                $.getJSON(staticMS, function(data) {
                    stockData = data.products_and_categories;
                    console.log(stockData);
                    var typeData = stockData[getItemType];
                    console.log(typeData)
            
                    try {
                        var itemInfo = typeData.find(element => element.name == getItemName);

                        if (itemInfo.name == getItemName && itemFound == false) {
                            console.log(itemInfo);

                            itemID = itemInfo.id;

                            console.log("!!! ITEM ID FOUND\t" + itemID + "\t!!!")

                            document.getElementById('status-progress').innerHTML = "Found Item...";
                            document.getElementById('status-progress').style.color = "#4DB528";

                            itemFound = true;

                            idInfo();

                            clearInterval();

                        }
                    }

                    catch(error) {
                        if (itemFound == false) {
                            console.log(getItemName + "\tnot found retrying...")
                            document.getElementById('status-progress').innerHTML = "Finding Item...";
                            document.getElementById('status-progress').style.color = "#E19F2C";
                        }
                    }

                });

            }
        }
        
       function idInfo() {
            document.getElementById('status-progress').innerHTML = "Finding Item Data...";
            document.getElementById('status-progress').style.color = "#E19F2C";
            var idPage = "https://www.supremenewyork.com/shop/" +itemID+ ".json";
            $.getJSON(idPage, function(data) {
                idData = data.styles;
                console.log(idData);
                var colorInfo = idData.find(element => element.name == getItemColor);
                console.log(colorInfo);
                colorID = colorInfo.id;
                console.log("!!! COLOR ID FOUND\t" + colorID + "\t!!!")
                var sizesData = colorInfo.sizes;
                console.log(sizesData);
                var sizeInfo = sizesData.find(element => element.name == getItemSize);
                console.log(sizeInfo);
                sizeID = sizeInfo.id;
                console.log("!!! SIZE ID FOUND\t" + sizeID + "\t!!!")

                picID = colorInfo.swatch_url_hi;
                picID = "http:" + picID;
                console.log(picID)

                document.getElementById('status-progress').innerHTML = "Found Item Data...";
                document.getElementById('status-progress').style.color = "#4DB528";

                addToCart();
            });
        }

        function addToCart() {
            document.getElementById('status-progress').innerHTML = "Adding Item To Cart...";
            document.getElementById('status-progress').style.color = "#E19F2C";
            $.ajax({
                url: "https://www.supremenewyork.com/shop/"+itemID+"/add.json",
                type: "POST",
                data: {
                    st: colorID,
                    s: sizeID,
                    qty: getItemQty
                },
                contentType: "application/x-www-form-urlencoded",
                dataType: "json",
                success: function(response) {
                    checkCart(response);
                },
                error: function() {
                    document.getElementById('status-progress').innerHTML = "Add To Cart Error...";
                    document.getElementById('status-progress').style.color = "#B63728"; 
                }
            });
        }

        function checkCart(response) {
            console.log(response)
            if (response.success == true) {
                response.cart.forEach(cartData => {
                    if (cartData.in_stock == true) {
                        console.log("Added To Cart")
                        document.getElementById('status-progress').innerHTML = "Item Added To Cart...";
                        document.getElementById('status-progress').style.color = "#4DB528";
                        if (toggleLegacy == false) {
                            setTimeout(processPayment, chkDelay * 1000)
                        } else if (toggleLegacy == true) {
                            chrome.tabs.create({
                                url: "http://www.supremenewyork.com/checkout"
                            })
                        }
                    } else {
                        console.log("Item Not In Cart")
                        document.getElementById('status-progress').innerHTML = "Item Not In Cart...";
                        document.getElementById('status-progress').style.color = "#B63728";
                    } 
                });
            } else {
                console.log("Out Of Stock")
                document.getElementById('status-progress').innerHTML = "Item Out Of Stock...";
                document.getElementById('status-progress').style.color = "#B63728"; 
            }
        }

        function processPayment() {
            var currentTime = new Date().getTime();

            var subC = encodeURI('{"'+sizeID+'":1}')
            subC = subC.replace(":", "%3A")

            document.getElementById('status-progress').innerHTML = "Checking Out Item...";
            document.getElementById('status-progress').style.color = "#4DB528";
        
            $.ajax({
                url: "https://www.supremenewyork.com/checkout.json",
                type: "POST",
                data: {
                    "store_credit_id": "",
                    "from_mobile": "1",
                    "cookie-sub": subC,
                    "current_time": currentTime,
                    "same_as_billing_address": "1",
                    "scerkhaj": "CKCRSUJHXH",
                    "order[billing_name]": billingArray[0],
                    "order[bn]": billingArray[0],
                    "order[email]": billingArray[1],
                    "order[tel]": billingArray[2],
                    "order[billing_address]": billingArray[3], 
                    "order[billing_address_2]": billingArray[4], 
                    "order[billing_zip]": billingArray[5],
                    "order[billing_city]": billingArray[6],
                    "order[billing_state]": billingArray[7],
                    "order[billing_country]": billingArray[8],
                    "riearmxa": billingArray[9],
                    "credit_card[month]": billingArray[11],
                    "credit_card[year]": billingArray[12],
                    "rand": "",
                    "credit_card[meknk]": billingArray[10],
                    "order[terms]": "0",
                    "order[terms]": "1",
                    "g-recaptcha-response": "",
                    "is_from_android": "1"
                },
                contentType: "application/x-www-form-urlencoded",
                dataType: "json",
                success: function(response) {
                    checkStatus(response);
                },
                error: function() {
                    document.getElementById('status-progress').innerHTML = "Checkout Error...";
                    document.getElementById('status-progress').style.color = "#B63728"; 

                    discordDenyWH();
                }
            });
        }

        function checkStatus(response) {
            console.log(response)
            if (response.status == "failed") {
                console.log(response.status)
                document.getElementById('status-progress').innerHTML = "Checkout Failed...";
                document.getElementById('status-progress').style.color = "#B63728"; 

                discordDenyWH();

            } else {
                getSlug = response.slug;
                console.log(getSlug)
                document.getElementById('status-progress').innerHTML = "Checking Slug...";
                document.getElementById('status-progress').style.color = "#E19F2C"; 

                setInterval(getStatus, 1000);
            }
        }

        function getStatus() {
            if (statusReceived == false) {
                var checkoutSlug = "https://www.supremenewyork.com/checkout/" +getSlug+ "/status.json";
                $.getJSON(checkoutSlug, function(data) {
                    var checkoutStatus = data.status;
                    if (checkoutStatus == "failed" && checkoutStatus != "queued") {
                        statusReceived = true;
                        console.log(checkoutStatus);
                        clearInterval();

                        document.getElementById('status-progress').innerHTML = "Checkout Denied...";
                        document.getElementById('status-progress').style.color = "#B63728"; 

                        discordDenyWH();

                    } else if (checkoutStatus != "failed" && checkoutStatus != "queued") {
                        statusReceived = true;
                        console.log(data.status)
                        clearInterval();

                        document.getElementById('status-progress').innerHTML = "Checkout Approved...";
                        document.getElementById('status-progress').style.color = "#4DB528";
                        setTimeout(function() {
                            document.getElementById('status-progress').innerHTML = "Check Email...";
                            document.getElementById('status-progress').style.color = "#4DB528";
                        }, 1000);
                        discordAcceptWH();
                    } else {
                        console.log(data.status)
                    }
                });
            }
        }

        document.getElementById('item_restart').onclick = function() {
            itemFound = false;
            getID();
        }

        function discordDenyWH() {
            var manifestData = chrome.runtime.getManifest();
            var request = new XMLHttpRequest();
            var whurl = "https://discordapp.com/api/webhooks/705655540541554760/dICoR7E0Ed2BJFGzkpk9N2BwPQhqDZ1cGGG7YSDRKGSySWlf7ZNRSz0IsPNvKY2FPPhh"
            request.open("POST", whurl);
            request.setRequestHeader('Content-type', 'application/json');

            var embed = {
                title: "Checkout Failure",
                color: "12086210",
                footer: {
                    "text": manifestData.name+ " " +manifestData.version
                },
                thumbnail: {
                    "url": picID
                },
                fields: [
                    {
                        name: "Name",
                        value: getItemName
                    },
                    {
                        name: "Size",
                        value: getItemSize
                    },
                    {
                        name: "Color",
                        value: getItemColor
                    },
                    {
                        name: "Time",
                        value: getTime(new Date)
                    }
                ]
            }

            var params = {
                username: "kfc famous bowl",
                embeds: [embed]
            }

            request.send(JSON.stringify(params))
        }

        function discordAcceptWH() {
            var manifestData = chrome.runtime.getManifest();
            var request = new XMLHttpRequest();
            var whurl = "https://discordapp.com/api/webhooks/705350170543390761/vde_wHhtgfRI6UVSLdKEsWNu6RqxgF4e14wg6blmcdo06wllTWLlWVA03fJzgFT3jq3j"
            request.open("POST", whurl);
            request.setRequestHeader('Content-type', 'application/json');

            var embed = {
                title: "Checkout Success",
                color: "7449305",
                footer: {
                    "text": manifestData.name+ " " +manifestData.version
                },
                thumbnail: {
                    "url": picID
                },
                fields: [
                    {
                        name: "Name",
                        value: getItemName
                    },
                    {
                        name: "Size",
                        value: getItemSize
                    },
                    {
                        name: "Color",
                        value: getItemColor
                    },
                    {
                        name: "Time",
                        value: getTime(new Date)
                    }
                ]
            }

            var params = {
                username: "taco bell mexican pizza",
                embeds: [embed]
            }

            request.send(JSON.stringify(params))
        }

        function getTime(date) {
            var h = date.getHours();
            var m = date.getMinutes();
            var s = date.getSeconds();
            var ms = date.getMilliseconds();
            var ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            h = h ? h : 12;
            m = m < 10 ? '0'+m : m;
            s = s < 10 ? '0'+s : s;
            ms = ms < 100 ? '0'+ms : ms;
            ms = ms < 10 ? '00'+ms : ms;
            var time = h + ':' + m + ':' +s+ '.' +ms+ampm;
            return time;
        }
    }
    }

    document.getElementById('add_info').onclick = function() {
        if (loggedIn == true) {
        maincontent = $("#main-content").detach();
        $(usercontent).insertBefore($(".footer"));

        $('#user_phone').keyup(function() {
            $(this).val($(this).val().replace(/(\d{3})\-?(\d{3})\-?(\d{4})/,'$1-$2-$3'))
        });

        if (billingArray.length > 0) {
            document.getElementById('user_name').value = billingArray[0];
            document.getElementById('user_email').value = billingArray[1];
            document.getElementById('user_phone').value = billingArray[2];
            document.getElementById('user_address').value = billingArray[3];
            document.getElementById('user_address2').value = billingArray[4];
            document.getElementById('user_zip').value = billingArray[5];
            document.getElementById('user_city').value = billingArray[6];
            if (billingArray[7].length > 0) {
                document.getElementById('state_select').value = billingArray[7];
            }
            if (billingArray[8].length > 0) {
                document.getElementById('country_select').value = billingArray[8];
            }
            document.getElementById('user_card').value = billingArray[9];
            document.getElementById('user_pin').value = billingArray[10];
            if (billingArray[11].length > 0) {
                document.getElementById('month_select').value = billingArray[11];
            }
            if (billingArray[12].length > 0) {
                document.getElementById('year_select').value = billingArray[12];
            }
        }
        }

        document.getElementById('deet_save').onclick = function() {
            if (loggedIn == true) {
            document.getElementById('user_name').style.borderColor = "#8ab4db";
            document.getElementById('user_email').style.borderColor = "#8ab4db";
            document.getElementById('user_phone').style.borderColor = "#8ab4db";
            document.getElementById('user_address').style.borderColor = "#8ab4db";
            document.getElementById('user_address2').style.borderColor = "#8ab4db";
            document.getElementById('user_zip').style.borderColor = "#8ab4db";
            document.getElementById('user_city').style.borderColor = "#8ab4db";
            document.getElementById('state_select').style.borderColor = "#8ab4db";
            document.getElementById('country_select').style.borderColor = "#8ab4db";
            document.getElementById('user_card').style.borderColor = "#8ab4db";
            document.getElementById('user_pin').style.borderColor = "#8ab4db";
            document.getElementById('month_select').style.borderColor = "#8ab4db";
            document.getElementById('year_select').style.borderColor = "#8ab4db";

            var user_name = document.getElementById('user_name').value;
            var user_email = document.getElementById('user_email').value;
            var user_phone = document.getElementById('user_phone').value;
            var user_address = document.getElementById('user_address').value;
            var user_address2 = document.getElementById('user_address2').value;
            var user_zip = document.getElementById('user_zip').value;
            var user_city = document.getElementById('user_city').value;
            var state_select = document.getElementById('state_select').value;
            var country_select = document.getElementById('country_select').value;
            var user_card = document.getElementById('user_card').value;
            var user_pin = document.getElementById('user_pin').value;
            var month_select = document.getElementById('month_select').value;
            var year_select = document.getElementById('year_select').value;

            billingArray = [user_name, user_email, user_phone, user_address, user_address2, user_zip, user_city, state_select, country_select, user_card, user_pin, month_select, year_select];

            chrome.storage.local.set({'user_bill_array' : billingArray})
            }
        }

        if (toggleLegacy == true) {
            document.getElementById("legacy-check").classList.add("fa-check");
        }

        document.getElementById('leg-check-wrap').onclick = function() {
            if (toggleLegacy == false) {
                document.getElementById("legacy-check").classList.add("fa-check");
                toggleLegacy = true;
                chrome.storage.local.set({'toggleLegacy' : toggleLegacy})
            } else if (toggleLegacy == true) {
                document.getElementById("legacy-check").classList.remove("fa-check");
                toggleLegacy = false;
                chrome.storage.local.set({'toggleLegacy' : toggleLegacy})
            }
        }
        
        document.getElementById('chk_delay').value = chkDelay;

        document.getElementById('go_to_dash').onclick = function() {
            $(maincontent).insertBefore($(".footer"));
            usercontent = $("#user-content").detach();
        }

        document.getElementById('chk_delay_save').onclick = function() {
            chkDelay = document.getElementById('chk_delay').value;
            chrome.storage.local.set({'chkDelay' : chkDelay})
            document.getElementById('chk_delay').style.borderColor = "#8ab4db";
        }

    }

}