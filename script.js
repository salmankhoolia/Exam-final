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

document.addEventListener("DOMContentLoaded", function () {
	let blogPostsElement = document.getElementById("last-10-posts");
	let morePostsElement = document.getElementById("more-posts-container");

	const seeMoreBtn = document.getElementById("see-more-btn");
	if (seeMoreBtn) {
		// hide seeMore when page is loading
		seeMoreBtn.style.display = "none";
		// get data-offset attr for seeMoreBtn
		let seeMoreBtnOffset = seeMoreBtn.getAttribute("data-offset");

		// on click seeMoreBtn, fetch more posts
		seeMoreBtn?.addEventListener("click", function (e) {
			e.preventDefault();
			fetchLast10Posts(morePostsElement, 10, seeMoreBtnOffset);
		});
	}
	const isHomePage = document.body.id === "homePage" ? true : false;
	const isBlogPage = document.body.id === "blogPage" ? true : false;

	function displayPostsInCarousel(posts) {
		const slidesContainer = document.querySelector("[data-slides]");
		let slidesContainerInnerHTML = "";

		const numberOfPosts = posts.length;
		const numberOfPostsPerSlide = 4;
		const numberOfSlidesNeeded = Math.ceil(
			numberOfPosts / numberOfPostsPerSlide
		);

		// given numberOfSlidesNeeded, create the correct number of slides
		const slides = Array.from({ length: numberOfSlidesNeeded }, () => {
			const slide = document.createElement("li");
			slide.classList.add("slide");
			return slide;
		});

		const numberOfPostsToDisplay =
			numberOfPostsPerSlide * numberOfSlidesNeeded;
		const postsToDisplay = posts.slice(0, numberOfPostsToDisplay);
		const postsPerSlide = Math.ceil(
			postsToDisplay.length / numberOfSlidesNeeded
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
				<a href="post.html?id=${post.id}"> ${articleImg}</a>
				<h2><a href="post.html?id=${post.id}">${post.title.rendered}</a></h2>
					<div>${post.content.rendered}</div>
					<div class="readMore"><a href="post.html?id=${post.id}">read more</a></div>
				</article>
			`;
		});

		const slidesWithArticles = slides.map((slide, index) => {
			if (index === 0) {
				// add data-active to first slide
				slide.setAttribute("data-active", "true");
				slide.classList.add("active");
			}
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

		slidesWithArticles.forEach((slide) => {
			slidesContainerInnerHTML += slide.outerHTML;
		});
		if (slidesContainer) {
			slidesContainer.innerHTML = slidesContainerInnerHTML;
		}
	}

	function displayBlogPosts(containerElement, posts, offset) {
		containerElement.innerHTML = "";

		posts.forEach(function (post) {
			var postElement = createPostElement(post);
			containerElement.appendChild(postElement);
		});

		updateSeeMoreBtnOffset(offset, posts.length);
	}

	function updateSeeMoreBtnOffset(offset, numberOfPosts) {
		seeMoreBtn.style.display = "block";
		seeMoreBtnOffset = parseInt(offset) + 10;
		seeMoreBtn.setAttribute("data-offset", seeMoreBtnOffset);
		if (numberOfPosts < 10) {
			seeMoreBtn.style.display = "none";
		}
	}

	function createPostElement(post, seeMore = true) {
		const hasFeaturedImage = post._embedded["wp:featuredmedia"]
			? true
			: false;

		let articleImgElement;

		const postElement = document.createElement("article");
		postElement.classList.add("post");
		postElement.classList.add("article-single");

		if (hasFeaturedImage) {
			articleImgElement = document.createElement("figure");
			articleImgElement.classList.add("articleImg");
			// if there is a featured image, add it to the post
			const src = post._embedded["wp:featuredmedia"][0].source_url;
			const alt = post._embedded["wp:featuredmedia"][0].alt_text;
			const imgElement = document.createElement("img");
			imgElement.src = src;
			imgElement.alt = alt;

			articleImgElement.appendChild(imgElement);
		}

		const articleContentElement = document.createElement("div");
		articleContentElement.classList.add("articleContent");

		const titleElement = document.createElement("h2");
		titleElement.textContent = post.title.rendered;

		const contentElement = document.createElement("div");
		contentElement.innerHTML = post.content.rendered;

		articleContentElement.appendChild(titleElement);
		articleContentElement.appendChild(contentElement);

		if (seeMore) {
			const readMoreElement = document.createElement("div");
			readMoreElement.classList.add("readMore");
			const readMoreLink = document.createElement("a");
			readMoreLink.href = `post.html?id=${post.id}`;
			readMoreLink.textContent = "read more";
			readMoreElement.appendChild(readMoreLink);
			articleContentElement.appendChild(readMoreElement);
		}

		postElement.appendChild(articleContentElement);
		if (hasFeaturedImage) {
			postElement.appendChild(articleImgElement);
		}

		return postElement;
	}

	function fetchLast10Posts(container, count = 10, offset = 0) {
		fetchBlogPosts(container, count, offset);
	}

	function fetchBlogPosts(
		container = blogPostsElement,
		count = null,
		offset = 0
	) {
		let fetchURL = "http://exam.local/wp-json/wp/v2/posts?_embed";
		if (count) {
			fetchURL += "&per_page=" + count;
		} else {
			fetchURL += "&per_page=100";
		}
		if (offset > 0) {
			fetchURL += "&offset=" + offset;
		}
		fetch(fetchURL)
			.then(function (response) {
				return response.json();
			})
			.then(function (posts) {
				if (isHomePage) {
					displayPostsInCarousel(posts);
				}
				if (isBlogPage) {
					displayBlogPosts(container, posts, offset);
				}
			})
			.catch(function (error) {
				console.log("Error fetching blog posts:", error);
			});
	}

	// check if is homePage
	if (document.body.id === "homePage") {
		fetchBlogPosts();
	}
	// check if body has blogPage id
	if (document.body.id === "blogPage") {
		fetchLast10Posts(blogPostsElement, 10, 0);
	}

	// for single post page in post.html?id=xxx
	const singleArticleContainer = document.getElementById("single-article");

	function updatePageTitle(title) {
		document.title = document.title.replace("default title", title);
	}

	function getPostIDFromURL() {
		let params = new URLSearchParams(document.location.search.substring(1));
		return params.get("id");
	}

	function fetchPostByID(id) {
		let fetchURL =
			"http://exam.local/wp-json/wp/v2/posts/" + id + "?_embed";

		return fetch(fetchURL)
			.then(function (response) {
				return response.json();
			})
			.then(function (post) {
				const postElement = createPostElement(post, false);
				singleArticleContainer.appendChild(postElement);
				updatePageTitle(post.title.rendered);
			})
			.catch(function (error) {
				console.log("Error fetching blog post:", error);
			});
	}

	const postId = getPostIDFromURL();
	if (postId) {
		fetchPostByID(postId);
	}
});
