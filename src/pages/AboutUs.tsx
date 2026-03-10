import { Header } from '@/components/ff/Header';
import { Footer } from '@/components/ff/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AboutUs = () => (
  <div className="min-h-screen bg-background text-foreground font-tech">
    <Header />
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>About Us</title>

<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>

<style>
:root{
--orange:#FF8C00;
--gold:#FFB900;
--fire-red:#FF4500;
--dark:#0A0A0F;
--dark2:#10101A;
--dark3:#16162A;
--card-bg:#1A1A2E;
--card2:#16213E;
--text:#E8E8F0;
--muted:#8A8AA8;
--border:rgba(255,140,0,0.2);
--glow:rgba(255,140,0,0.15);
}

body{
font-family:'Inter',sans-serif;
background:var(--dark);
color:var(--text);
margin:0;
}

/* HERO */

.hero{
min-height:100vh;
display:flex;
align-items:center;
justify-content:center;
text-align:center;
padding:120px 5% 80px;
background: radial-gradient(ellipse at 60% 40%, rgba(255,140,0,0.08) 0%, transparent 60%),
radial-gradient(ellipse at 20% 80%, rgba(255,69,0,0.06) 0%, transparent 50%),
var(--dark);
}

.hero-title{
font-family:'Exo 2',sans-serif;
font-size:clamp(2.6rem,6vw,5rem);
font-weight:800;
}

.hero-title span{
background:linear-gradient(90deg,var(--gold),var(--orange),var(--fire-red));
-webkit-background-clip:text;
-webkit-text-fill-color:transparent;
display:block;
}

.hero-desc{
max-width:640px;
margin:20px auto;
color:var(--muted);
line-height:1.7;
}

.btn-primary{
background:linear-gradient(135deg,var(--orange),var(--gold));
color:#000;
font-weight:700;
padding:14px 30px;
border-radius:8px;
text-decoration:none;
display:inline-block;
margin-top:15px;
}

/* SECTION */

section{
padding:90px 5%;
}

.section-label{
text-align:center;
text-transform:uppercase;
font-size:.78rem;
letter-spacing:3px;
color:var(--orange);
margin-bottom:12px;
}

.section-title{
text-align:center;
font-family:'Exo 2';
font-size:2.4rem;
margin-bottom:10px;
}

.section-title span{
background:linear-gradient(90deg,var(--gold),var(--orange));
-webkit-background-clip:text;
-webkit-text-fill-color:transparent;
}

.section-subtitle{
text-align:center;
color:var(--muted);
max-width:650px;
margin:0 auto 60px;
}

/* ABOUT GRID */

.about-grid{
max-width:1100px;
margin:auto;
display:grid;
grid-template-columns:1fr 1fr;
gap:70px;
align-items:center;
}

.about-card{
background:linear-gradient(135deg,var(--card-bg),var(--dark3));
border:1px solid var(--border);
border-radius:20px;
padding:40px;
}

.about-card h3{
font-family:'Exo 2';
font-size:1.4rem;
}

.about-card p{
color:var(--muted);
line-height:1.7;
}

.about-text p{
color:var(--muted);
line-height:1.8;
margin-bottom:15px;
}

/* CARDS */

.cards{
max-width:1100px;
margin:auto;
display:grid;
grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
gap:24px;
}

.card{
background:var(--card-bg);
border:1px solid var(--border);
border-radius:16px;
padding:30px;
}

.card h3{
font-family:'Exo 2';
margin-bottom:10px;
}

.card p{
color:var(--muted);
font-size:.9rem;
line-height:1.6;
}

/* VALUES */

.values-grid{
max-width:1100px;
margin:auto;
display:grid;
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:20px;
}

.value-card{
background:var(--card-bg);
border:1px solid var(--border);
border-radius:16px;
padding:30px;
text-align:center;
}

.value-card h3{
font-family:'Exo 2';
margin-bottom:10px;
}

.value-card p{
color:var(--muted);
font-size:.9rem;
}

/* CTA */

.cta-section{
text-align:center;
padding:100px 5%;
background:linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,69,0,0.05), var(--dark));
}

.cta-section h2{
font-family:'Exo 2';
font-size:2.5rem;
margin-bottom:15px;
}

.cta-section h2 span{
background:linear-gradient(90deg,var(--gold),var(--orange));
-webkit-background-clip:text;
-webkit-text-fill-color:transparent;
}

.cta-section p{
color:var(--muted);
max-width:600px;
margin:auto;
margin-bottom:30px;
}
</style>
</head>

<body>

<!-- HERO -->
<section class="hero">
<div>
<h1 class="hero-title">
About <span>Free Fire Redeem Code Today</span>
</h1>

<p class="hero-desc">
We are passionate gamers dedicated to bringing you the most up-to-date verified Free Fire redeem codes every single day. No scams, no fake codes — just real rewards.
</p>

<a href="/" class="btn-primary">Grab Today's Codes</a>
</div>
</section>

<!-- ABOUT -->
<section>
<div class="about-grid">

<div class="about-card">
<h3>Born From a Gamer's Frustration</h3>
<p>
Searching for working redeem codes across dozens of sites can be frustrating. Our platform was created to provide a single trusted place where players can find verified Free Fire codes instantly.
</p>
</div>

<div class="about-text">
<p class="section-label">Who We Are</p>
<h2 class="section-title">Your <span>Trusted Source</span></h2>

<p>
FreeFire Redeem Code Today was founded by passionate Free Fire players who wanted to make redeem codes easier to find.
</p>

<p>
Our team monitors official Garena channels and events to collect new codes and verify them before publishing.
</p>

<p>
We update the site daily so players never miss new rewards like skins, diamonds, bundles, and loot crates.
</p>

</div>

</div>
</section>

<!-- MISSION -->
<section>

<p class="section-label">Our Mission</p>
<h2 class="section-title">Why We <span>Do This</span></h2>
<p class="section-subtitle">
Every Free Fire player deserves access to free rewards without wasting time searching unreliable websites.
</p>

<div class="cards">

<div class="card">
<h3>Accuracy First</h3>
<p>Every redeem code is verified before publishing.</p>
</div>

<div class="card">
<h3>Fast Updates</h3>
<p>We publish new codes as soon as they appear.</p>
</div>

<div class="card">
<h3>100% Free</h3>
<p>No subscriptions, no hidden charges.</p>
</div>

<div class="card">
<h3>Global Coverage</h3>
<p>Codes for India, SEA, Europe, and more.</p>
</div>

</div>

</section>

<!-- VALUES -->

<section>

<p class="section-label">Our Values</p>
<h2 class="section-title">What We <span>Stand For</span></h2>

<div class="values-grid">

<div class="value-card">
<h3>Trust</h3>
<p>We only publish codes from reliable sources.</p>
</div>

<div class="value-card">
<h3>Passion</h3>
<p>Our team loves Free Fire and gaming culture.</p>
</div>

<div class="value-card">
<h3>Speed</h3>
<p>Codes are updated quickly when they drop.</p>
</div>

<div class="value-card">
<h3>Community</h3>
<p>Built for players around the world.</p>
</div>

</div>

</section>

<!-- CTA -->

<section class="cta-section">

<h2>Ready to Claim <span>Free Rewards?</span></h2>

<p>
Hundreds of players are redeeming free skins and diamonds daily. Don't miss today's codes.
</p>

<a href="/" class="btn-primary">View Today's Codes</a>

</section>

</body>
</html>
    <Footer />
  </div>
);

export default AboutUs;
