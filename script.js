/* ===========================
   DIZZAH MEDIA - SCRIPT
=========================== */

document.addEventListener("DOMContentLoaded", () => {

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if(menuBtn){

menuBtn.addEventListener("click", ()=>{

navLinks.classList.toggle("active");

});

}

});// Sticky Header

window.addEventListener("scroll", () => {

const header = document.querySelector(".site-header");

if(header){

if(window.scrollY > 50){

header.classList.add("sticky");

}else{

header.classList.remove("sticky");

}

}

});

// Smooth Animation

const cards = document.querySelectorAll(".news-card,.category-card,.contact-card");

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

cards.forEach(card=>observer.observe(card));// Current Year

const year = document.getElementById("year");

if(year){

year.textContent = new Date().getFullYear();

}

// Back To Top

const topBtn = document.getElementById("backToTop");

if(topBtn){

window.addEventListener("scroll",()=>{

topBtn.style.display = window.scrollY > 400 ? "block" : "none";

});

topBtn.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

}
/* ==========================
   MOBILE MENU
========================== */

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector("nav");

if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
        nav.classList.toggle("show");
    });
}

/* ==========================
   SEARCH
========================== */

const searchForm = document.querySelector(".search-form");

if (searchForm) {

    searchForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const input = document.getElementById("search");

        if (input.value.trim() === "") {

            alert("Tafadhali andika unachotafuta.");

            return;

        }

        alert("Umetafuta: " + input.value);

    });

}/* ==========================
   LOGIN VALIDATION
========================== */

const loginForm = document.querySelector(".login-form");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        const email = document.querySelector("#email");
        const password = document.querySelector("#password");

        if (!email.value.trim() || !password.value.trim()) {

            e.preventDefault();

            alert("Tafadhali jaza Email na Password.");

            return;

        }

        alert("Login imefanikiwa!");

    });

}

/* ==========================
   REGISTER VALIDATION
========================== */

const registerForm = document.querySelector(".register-form");

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        const password = document.querySelector("#password");
        const confirmPassword = document.querySelector("#confirm-password");

        if (password.value !== confirmPassword.value) {

            e.preventDefault();

            alert("Password hazifanani.");

            return;

        }

        if (password.value.length < 6) {

            e.preventDefault();

            alert("Password lazima iwe na herufi angalau 6.");

            return;

        }

        alert("Usajili umefanikiwa!");

    });

                /* ==========================
   BACK TO TOP BUTTON
========================== */

const backToTop = document.createElement("button");

backToTop.innerHTML = "⬆";
backToTop.className = "back-to-top";

document.body.appendChild(backToTop);

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        backToTop.style.display = "block";

    } else {

        backToTop.style.display = "none";

    }

});

backToTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

/* ==========================
   SIMPLE FADE ANIMATION
========================== */

const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

        }

    });

});

sections.forEach(section => {

    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "all .6s ease";

    observer.observe(section);

});   /* BACK TO TOP BUTTON */

.back-to-top{
    position:fixed;
    bottom:20px;
    right:20px;
    width:50px;
    height:50px;
    border:none;
    border-radius:50%;
    background:#0d6efd;
    color:#fff;
    font-size:20px;
    cursor:pointer;
    display:none;
    z-index:999;
    box-shadow:0 5px 15px rgba(0,0,0,.2);
}

.back-to-top:hover{
    background:#0b5ed7;
               }                   }
