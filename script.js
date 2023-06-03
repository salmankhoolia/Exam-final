function toggleNav() {
	const navLinks = document.querySelector(".nav-links");
	const rightItems = document.querySelector(".right-items");
	const burger = document.querySelector(".burger");

	navLinks.classList.toggle("show");
	rightItems.classList.toggle("show");

	if (navLinks.classList.contains("show")) {
		burger.classList.add("open");
	} else {
		burger.classList.remove("open");
	}
}

function toggleSearchBox() {
	const searchBox = document.getElementById("search-box");
	searchBox.classList.toggle("show");
}

function filterBlogPosts() {
	const searchInput = document.getElementById("search-input");
	const searchTerm = searchInput.value.toLowerCase();
	const allPostElements = document.querySelectorAll(".post");

	allPostElements.forEach((postElement) => {
		const titleElement = postElement.querySelector("h2");
		const contentElement = postElement.querySelector("div");

		const titleMatch = titleElement.textContent
			.toLowerCase()
			.includes(searchTerm);
		const contentMatch = contentElement.textContent
			.toLowerCase()
			.includes(searchTerm);

		if (titleMatch || contentMatch) {
			postElement.style.display = "block";
		} else {
			postElement.style.display = "none";
		}
	});
}

document.getElementById("search-form").addEventListener("submit", (e) => {
	e.preventDefault();
	filterBlogPosts();
});

// const seeMoreButton = document.getElementById("see-more");
// const seeLessButton = document.getElementById("see-less");
// const blogPosts = document.getElementById("blog-posts");

// seeMoreButton.addEventListener("click", () => {
// 	blogPosts.classList.remove("effect");
// });

// seeLessButton.addEventListener("click", () => {
// 	blogPosts.classList.add("effect");
// });

document.addEventListener("DOMContentLoaded", function () {
	// var blogPostsElement = document.getElementById("blog-posts");
	// var seeMoreButton = document.getElementById("see-more");
	// var seeLessButton = document.getElementById("see-less");
	var allPosts = [];
	// var displayCount = 3;

	/*given html for carousel:
	<ul data-slides>
	<li class="slide" data-active>
	<div class="articleContainer">
    <artcile class="post">
      <h2>Post title</h2>
      <div>Post content</div>
    </artcile>
    <artcile class="post">
      <h2>Post title</h2>
      <div>Post content</div>
    </artcile>
    <artcile class="post">
      <h2>Post title</h2>
      <div>Post content</div>
    </artcile>
    <artcile class="post">
      <h2>Post title</h2>
      <div>Post content</div>
    </artcile>
  </div>
	</li>
	<li class="slide">
  ...
	</li>
	...
	</ul>
  write a function that will take an array of posts and display them in the carousel
  each slide should contain 4 posts
	*/

	function displayPostsInCarousel(posts) {
		const slides = Array.from(
			document.querySelectorAll("[data-slides] > .slide")
		);
		const numberOfSlides = slides.length;
		const numberOfPosts = posts.length;
		const numberOfPostsPerSlide = 4;
		const numberOfSlidesNeeded = Math.ceil(
			numberOfPosts / numberOfPostsPerSlide
		);
		const numberOfSlidesToDisplay =
			numberOfSlidesNeeded > numberOfSlides
				? numberOfSlides
				: numberOfSlidesNeeded;

		const numberOfPostsToDisplay =
			numberOfPostsPerSlide * numberOfSlidesToDisplay;
		const postsToDisplay = posts.slice(0, numberOfPostsToDisplay);
		const postsPerSlide = Math.ceil(
			postsToDisplay.length / numberOfSlidesToDisplay
		);

		const articles = postsToDisplay.map((post) => {
			let articleImg;
			const src = post._embedded["wp:featuredmedia"]
				? post._embedded["wp:featuredmedia"][0].source_url
				: false;
			if (src) {
				articleImg = `<img src="${src}" alt="${post.title.rendered}" />`;
			} else {
				articleImg = "";
			}
			return `<article class="post">
      <a href="${post.link}"> ${articleImg}</a>
      <h2><a href="${post.link}">${post.title.rendered}</a></h2>
        <div>${post.content.rendered}</div>
        <div class="readMore"><a href="${post.link}">read more</a></div>
      </article>`;
		});

		const slidesWithArticles = slides.map((slide, index) => {
			const slideArticles = articles.slice(
				index * postsPerSlide,
				(index + 1) * postsPerSlide
			);
			const slideHTML = `<div class="articleContainer">${slideArticles.join(
				""
			)}</div>`;

			slide.innerHTML = slideHTML;
			return slide;
		});

		slidesWithArticles.forEach((slide) => {
			slide.classList.remove("active");
		});
		slidesWithArticles[0].classList.add("active");
	}

	// function displayBlogPosts(posts) {
	// 	blogPostsElement.innerHTML = "";

	// 	posts.forEach(function (post, index) {
	// 		var postElement = createPostElement(post);
	// 		blogPostsElement.appendChild(postElement);

	// 		if (index >= displayCount) {
	// 			postElement.style.display = "none";
	// 		}
	// 	});

	// 	if (posts.length > displayCount) {
	// 		seeMoreButton.style.display = "block";
	// 	} else {
	// 		seeMoreButton.style.display = "none";
	// 	}

	// 	seeLessButton.style.display = "none";
	// }

	function createPostElement(post) {
		var postElement = document.createElement("div");
		postElement.classList.add("post");

		var imageElement = document.createElement("img");
		imageElement.src = "./Image/ReadMore.png";
		imageElement.alt = post.title.rendered;

		var titleElement = document.createElement("h2");
		titleElement.textContent = post.title.rendered;

		var contentElement = document.createElement("div");
		contentElement.innerHTML = post.content.rendered;

		postElement.appendChild(imageElement);
		postElement.appendChild(titleElement);
		postElement.appendChild(contentElement);

		return postElement;
	}

	function fetchBlogPosts() {
		fetch("http://exam.local/wp-json/wp/v2/posts?_embed")
			.then(function (response) {
				return response.json();
			})
			.then(function (posts) {
				allPosts = posts;
				// displayBlogPosts(allPosts);
				displayPostsInCarousel(allPosts);
			})
			.catch(function (error) {
				console.log("Error fetching blog posts:", error);
			});
	}

	// seeMoreButton.addEventListener("click", function () {
	// 	displayCount = allPosts.length;
	// 	// displayBlogPosts(allPosts);

	// 	seeMoreButton.style.display = "none";
	// 	seeLessButton.style.display = "block";
	// });

	// seeLessButton.addEventListener("click", function () {
	// 	displayCount = 3;
	// 	// displayBlogPosts(allPosts);

	// 	seeMoreButton.style.display = "block";
	// 	seeLessButton.style.display = "none";
	// });

	fetchBlogPosts();
});
