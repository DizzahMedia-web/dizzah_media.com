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
