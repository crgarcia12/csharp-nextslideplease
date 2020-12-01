"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("previousButton").disabled = true;
document.getElementById("nextButton").disabled = true;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

connection.on("ReceiveMessage", async function (user, message) {
    if (message === "next") {
        document.getElementById("nextslide").style.backgroundColor = 'blue';
        document.getElementById("nextslide").innerText = user + ": next slide please";
        await sleep(1000);
        document.getElementById("nextslide").style.backgroundColor = 'white';
    } else if (message === "previous") {
        document.getElementById("previousslide").style.backgroundColor = 'red';
        document.getElementById("previousslide").innerText = user + ": previous slide please";
        await sleep(1000);
        document.getElementById("previousslide").style.backgroundColor = 'white';
    }

});

connection.start().then(function () {
    document.getElementById("previousButton").disabled = false;
    document.getElementById("nextButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("previousButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = "previous";
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("nextButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = "next";
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});