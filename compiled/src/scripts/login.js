"use strict";
const { log } = console;
const button = document.getElementById("loginButton");
button.addEventListener("click", (event) => {
    event.preventDefault();
    const answers = {};
    const loginInput = document.querySelectorAll(".loginInput");
    loginInput.forEach((item) => {
        answers[item.name] = item.value;
    });
    fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        redirect: "follow",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
        credentials: "include"
    }).then(res => res.redirected ? window.location.href = res.url : null);
});
