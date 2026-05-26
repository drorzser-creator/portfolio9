// Load JSON with Fetch
const portfolioContainer = document.querySelector('.portfolio-items-container');

let portfolioData = [];
let currentItems = [];
let itemIndex = 0;

async function loadPortfolio() {
	try {
		const response = await fetch('js/projects.json');

		portfolioData = await response.json();

		currentItems = portfolioData;

		if (portfolioContainer) {
			displayPortfolioItems(portfolioData);

			setupFilterButtons();
		}

		if (document.querySelector('.carousel-item')) {
			initCarousel(portfolioData);
		}
	} catch (error) {
		console.error('Error loading JSON', error);
	}
}

function displayPortfolioItems(items) {
	portfolioContainer.innerHTML = '';

	items.forEach((item, index) => {
		const portfolioItem = document.createElement('div');

		portfolioItem.classList.add('portfolio-item', 'show');

		portfolioItem.setAttribute('data-category', item.category);

		portfolioItem.innerHTML = `
		<div class = "portfolio-item-inner">
			<div class = "portfolio-img">
				<img src="${item.image}" alt = "${item.title}">
			</div>

			<div class = "portfolio-info">
				<h4>${item.title}</h4>

				<div class = "icon">
					<i class = "fa fa-search"></i>
				</div>
			</div>

			<div class = "portfolio-description">
				<p>${item.description}</p>
			</div>
		</div>
		
		`;

		portfolioItem.addEventListener('click', () => {
			itemIndex = index;
			changeItem();
			toggleLightBox();
		});

		portfolioContainer.appendChild(portfolioItem);
	});
}

/*Resize Navbar on Scroll*/
var navbar = document.querySelector('.navbar');
// when the scroll is higher than 20 viewport height, add the sticky class to the tag with a class navbar
// window.addEventListener('scroll', () => {
// 	window.scrollY > window.innerHeight * 0.2
// 		? navbar.classList.add('sticky')
// 		: navbar.classList.remove('sticky');
// });

function handleScroll() {
	const scrollY = window.scrollY;

	// Sticky navbar
	if (scrollY > window.innerHeight * 0.2) {
		navbar.classList.add('sticky');
	} else {
		navbar.classList.remove('sticky');
	}
}

window.addEventListener('scroll', handleScroll, { passive: true });

if (
	window.location.pathname.endsWith('index.html') ||
	window.location.pathname === '/'
) {
	window.addEventListener('scroll', scrollActive, { passive: true });
}

/*Nav Toggler*/
const navMenu = document.querySelector('.menu');
const navToggle = document.querySelector('.menu-btn');

if (navToggle) {
	navToggle.addEventListener('click', () => {
		navMenu.classList.toggle('active');
	});
}

// closing menu when link is clicked
const navLink = document.querySelectorAll('.nav-link');
function linkAction() {
	const navMenu = document.querySelector('.menu');
	navMenu.classList.remove('active');
}
navLink.forEach((n) => n.addEventListener('click', linkAction));

/*Scroll Section Active Link*/
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
	const scrollY = window.pageYOffset;

	//Reset all links first
	document.querySelectorAll('.links a').forEach((link) => {
		link.classList.remove('active');
	});

	//Find the active section
	sections.forEach((current) => {
		const sectionHeight = current.offsetHeight;
		const sectionTop = current.offsetTop - 50;
		const sectionId = current.getAttribute('id');

		const link = document.querySelector(`.links a[href*="${sectionId}"]`);
		if (!link) return;

		if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
			link.classList.add('active');
		} else {
			link.classList.remove('active');
		}
	});
}

/*Active Page Link*/
const currentPage = window.location.pathname.split('/').pop();

const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach((link) => {
	link.classList.remove('active');

	if (link.getAttribute('href') === currentPage) {
		link.classList.add('active');
	}
});

/*Skills Animation*/
const skills_wrap = document.querySelector('.about-skills');
const skills_bar = document.querySelectorAll('.progress-line');
window.addEventListener('scroll', () => {
	skillsEffect();
});

window.addEventListener('load', skillsEffect);

// Every time we scroll checking, we exceeded the about-skills or not
function checkScroll(el) {
	// Getting the top position of about-skills relative to view port, in other words
	// we need to get amount of pixels between about-skills and the top edge of the window
	let rect = el.getBoundingClientRect();
	// After knowing the amount of pixels between the top edge of about-skills and the top
	// edge of window
	// Now we will check whether we exceded the bottom edge of about-skills or not
	if (window.innerHeight >= rect.top + el.offsetHeight) {
		return true;
	} else {
		return false;
	}
}

function skillsEffect() {
	if (!skills_wrap) return;

	if (!checkScroll(skills_wrap)) return;

	skills_bar.forEach((skill) => (skill.style.width = skill.dataset.progress));
}

/*Portfolio Item Filter*/
const filterContainer = document.querySelector('.portfolio-filter');

function setupFilterButtons() {
	const filterBtns = filterContainer.children;

	for (let btn of filterBtns) {
		btn.addEventListener('click', function () {
			filterContainer.querySelector('.active').classList.remove('active');

			this.classList.add('active');

			const filterValue = this.getAttribute('data-filter');

			if (filterValue === 'all') {
				currentItems = portfolioData;

				itemIndex = 0;

				initCarousel(portfolioData);

				displayPortfolioItems(portfolioData);
			} else {
				const filteredItems = portfolioData.filter(
					(item) => item.category === filterValue,
				);

				currentItems = filteredItems;

				itemIndex = 0;

				displayPortfolioItems(filteredItems);

				initCarousel(filteredItems);
			}
		});
	}
}

/*Lightbox*/

const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxText = document.querySelector('.caption-text');
const lightboxCounter = document.querySelector('.caption-counter');

function toggleLightBox() {
	lightbox.classList.toggle('open');
}

function changeItem() {
	const currentItem = currentItems[itemIndex];

	lightboxImg.src = currentItem.image;

	lightboxText.innerHTML = currentItem.title;

	lightboxCounter.innerHTML = itemIndex + 1 + ' of ' + currentItems.length;
}

function nextItem() {
	itemIndex++;

	if (itemIndex >= currentItems.length) {
		itemIndex = 0;
	}

	changeItem();
}

function prevItem() {
	itemIndex--;

	if (itemIndex < 0) {
		itemIndex = currentItems.length - 1;
	}

	changeItem();
}

/*Lightbox buttons*/

document.querySelector('.next-item').addEventListener('click', nextItem);

document.querySelector('.prev-item').addEventListener('click', prevItem);

lightboxClose.addEventListener('click', toggleLightBox);

lightbox.addEventListener('click', function (event) {
	if (event.target === lightbox) {
		toggleLightBox();
	}
});

/*Start*/
if (portfolioContainer) {
	loadPortfolio();
}

/*Carousel*/
let carouselIndex = 0;
let carouselItems = [];
let autoPlay;

function initCarousel(items = portfolioData) {
	carouselItems = items;

	carouselIndex = 0;

	createDots();
	updateCarousel();
	startAutoPlay();
}

function updateCarousel() {
	if (!carouselItems.length) return;

	const carouselImg = document.querySelector('.carousel-img');
	const carouselTitle = document.querySelector('.carousel-title');
	const carouselDesc = document.querySelector('.carousel-desc');

	if (!carouselImg || !carouselTitle || !carouselDesc) return;

	const item = carouselItems[carouselIndex];

	carouselImg.src = item.image;
	carouselTitle.textContent = item.title;
	carouselDesc.textContent = item.description;

	updateDots();
}

function nextCarousel() {
	if (!carouselItems.length) return;

	carouselIndex = (carouselIndex + 1) % carouselItems.length;

	updateCarousel();
}

function prevCarousel() {
	if (!carouselItems.length) return;

	carouselIndex =
		(carouselIndex - 1 + carouselItems.length) % carouselItems.length;

	updateCarousel();
}

/*autoplay*/
function startAutoPlay() {
	clearInterval(autoPlay);

	autoPlay = setInterval(() => {
		nextCarousel();
	}, 3000);
}

function createDots() {
	const dotsContainer = document.querySelector('.carousel-dots');

	if (!dotsContainer) return;

	dotsContainer.innerHTML = '';

	carouselItems.forEach((item, index) => {
		const dot = document.createElement('button');

		dot.classList.add('carousel-dot');

		dot.addEventListener('click', () => {
			carouselIndex = index;
			updateCarousel();
			startAutoPlay();
		});
		dotsContainer.appendChild(dot);
	});
}

function updateDots() {
	const dots = document.querySelectorAll('.carousel-dot');

	dots.forEach((dot, index) => {
		dot.classList.toggle('active', index === carouselIndex);
	});
}

const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');

if (nextBtn && prevBtn) {
	nextBtn.addEventListener('click', () => {
		nextCarousel();
		startAutoPlay();
	});
	prevBtn.addEventListener('click', () => {
		prevCarousel();
		startAutoPlay();
	});
}
