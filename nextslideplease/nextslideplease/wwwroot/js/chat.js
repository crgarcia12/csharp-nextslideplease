"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("previousButton").disabled = true;
document.getElementById("nextButton").disabled = true;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addTrace(msg) {
    let li = document.createElement('li');
    li.textContent = msg;
    document.getElementById("messagesList").appendChild(li);
}
connection.on("ReceiveMessage", async function (user, message) {
    var msg = user;
    if (message === "next") {
        msg = msg + ": next slide please";
        document.getElementById("nextslide").style.backgroundColor = 'blue';
        document.getElementById("nextslide").innerText = msg;
    } else if (message === "previous") {
        msg = msg + ": previous slide please";
        document.getElementById("previousslide").style.backgroundColor = 'red';
        document.getElementById("previousslide").innerText = msg;       
    }
    addTrace(msg);
    await sleep(1000);
    document.getElementById("previousslide").style.backgroundColor = 'white';
    document.getElementById("nextslide").style.backgroundColor = 'white';
    document.getElementById("previousslide").innerText = "previous slide please";
    document.getElementById("nextslide").innerText = "next slide please";
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