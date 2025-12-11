$(document).ready(function(){
    
    // --- 1. SYSTEM INITIALIZATION (Preloader) ---
    setTimeout(function(){
        $('.preloader').css('opacity', '0');
        setTimeout(function(){
            $('.preloader').css('display', 'none');
            // Trigger entry animations here if needed
        }, 500);
    }, 3000); // 3 seconds fake load time

    // --- 2. CUSTOM CURSOR LOGIC ---
    var cursor = document.querySelector('.cursor');
    var cursor2 = document.querySelector('.cursor2');
    
    document.addEventListener('mousemove', function(e){
        cursor.style.cssText = cursor2.style.cssText = "left: " + e.clientX + "px; top: " + e.clientY + "px;";
    });

    // Add 'expand' class on hover over interactive elements
    $('a, .card, .btn-neon, button, .menu-btn').hover(function(){
        $('.cursor').addClass('expand');
        $('.cursor2').addClass('expand');
    }, function(){
        $('.cursor').removeClass('expand');
        $('.cursor2').removeClass('expand');
    });

    // --- 3. NAVBAR STICKY & SCROLL ---
    $(window).scroll(function(){
        if(this.scrollY > 20){
            $('.navbar').addClass("sticky");
        }else{
            $('.navbar').removeClass("sticky");
        }
        if(this.scrollY > 500){
            $('.scroll-up-btn').addClass("show");
        }else{
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // --- 4. TYPING ANIMATION ---
    var typed = new Typed(".typing", {
        strings: ["IoT Engineer", "Firmware Developer", "PCB Designer", "Robotics Specialist"],
        typeSpeed: 60,
        backSpeed: 40,
        loop: true
    });
    var typed2 = new Typed(".typing-2", {
        strings: ["IoT Engineer", "Firmware Developer", "PCB Designer", "Robotics Specialist"],
        typeSpeed: 60,
        backSpeed: 40,
        loop: true
    });

    // --- 5. MOBILE MENU ---
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    });

    // --- 6. SMOOTH SCROLL ---
    $('.scroll-up-btn').click(function(){
        $('html').animate({scrollTop: 0});
        $('html').css("scrollBehavior", "auto");
    });
    $('.navbar .menu li a').click(function(){
        $('html').css("scrollBehavior", "smooth");
    });

    // Initialize VanillaTilt for cards
    VanillaTilt.init(document.querySelectorAll(".card"), {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5,
    });
});


/* --- 7. ADVANCED CIRCUIT BOARD ANIMATION (Canvas) --- */
const canvas = document.getElementById("circuit-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let circuits = [];
const maxCircuits = 40; // Number of traces

class Circuit {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.color = (Math.random() > 0.5) ? '#00f3ff' : '#bc13fe'; // Cyan or Purple
        this.speedX = 0;
        this.speedY = 0;
        // Start moving in a random cardinal direction
        this.pickDirection();
        this.history = []; // Store path to draw trace
        this.maxLength = Math.random() * 100 + 50;
        this.life = 0;
    }

    pickDirection() {
        const dirs = [
            {x: 2, y: 0}, {x: -2, y: 0}, 
            {x: 0, y: 2}, {x: 0, y: -2}
        ];
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        this.speedX = dir.x;
        this.speedY = dir.y;
    }

    update() {
        // Change direction randomly or if hitting edge
        if (Math.random() < 0.05 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.pickDirection();
        }

        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;

        // Add to history
        this.history.push({x: this.x, y: this.y});

        // Limit length of tail
        if (this.history.length > this.maxLength) {
            this.history.shift();
        }
        
        // Reset if too old
        if (this.life > 400) {
            this.reset();
        }
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.history = [];
        this.life = 0;
        this.pickDirection();
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.lineJoin = 'round';
        
        if (this.history.length > 0) {
            ctx.moveTo(this.history[0].x, this.history[0].y);
            for (let i = 1; i < this.history.length; i++) {
                ctx.lineTo(this.history[i].x, this.history[i].y);
            }
        }
        ctx.stroke();

        // Draw head (node)
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.arc(this.x, this.y, this.size + 1, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initCircuits() {
    circuits = [];
    for (let i = 0; i < maxCircuits; i++) {
        circuits.push(new Circuit());
    }
}

function animateCircuits() {
    // Fade effect for trails
    ctx.fillStyle = 'rgba(5, 5, 5, 0.1)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < circuits.length; i++) {
        circuits[i].update();
        circuits[i].draw();
    }
    requestAnimationFrame(animateCircuits);
}

// Handle Resize
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initCircuits();
});

initCircuits();
animateCircuits();
