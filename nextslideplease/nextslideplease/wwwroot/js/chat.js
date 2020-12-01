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
    li.textContent = new Date().toLocaleTimeString() + " - " + msg;
    document.getElementById("messagesList").prepend(li);
}

function TurnLeftOn(msg) {
    document.getElementById("arrowleft").style.borderRight = "60px solid #f0ad4e";
    document.getElementById("previousslide").innerText = msg;   
    document.getElementById("previousslide").style.color = "red";
}

function TurnRightOn(msg) {
    document.getElementById("arrowright").style.borderLeft = "60px solid green";
    document.getElementById("nextslide").innerText = msg;
    document.getElementById("nextslide").style.color = "green";
}

function TurnOff() {
    document.getElementById("arrowleft").style.borderRight = "60px solid black";
    document.getElementById("arrowright").style.borderLeft = "60px solid black";
    document.getElementById("previousslide").style.color = "black";
    document.getElementById("nextslide").style.color = "black";
}

connection.on("ReceiveMessage", async function (user, message) {
    var msg = user;
    if (message === "next") {
        msg = msg + ": next slide please";
        TurnRightOn(msg);   
    } else if (message === "previous") {
        msg = msg + ": previous slide please";
        TurnLeftOn(msg);    
    }
    addTrace(msg);
    await sleep(1000);
    TurnOff();
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