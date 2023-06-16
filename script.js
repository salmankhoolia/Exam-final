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
		seeMoreBtn.style.display = "none";
		let seeMoreBtnOffset = seeMoreBtn.getAttribute("data-offset");

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

		const screenWidth = screen.width;

		const numberOfPosts = posts.length;
		let numberOfPostsPerSlide = 4;
		if (screenWidth <= 768) {
			numberOfPostsPerSlide = 1;
		}
		const numberOfSlidesNeeded = Math.ceil(
			numberOfPosts / numberOfPostsPerSlide
		);

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
			return `<article class="post arctileCarousel">
					<a href="post.html?id=${post.id}"> ${articleImg}</a>
					<h3><a href="post.html?id=${post.id}">${post.title.rendered}</a></h3>
					<div class="articleContent">${post.content.rendered}</div>
					<div class="readMoreBlog"><a href="post.html?id=${post.id}">read more</a></div>
				</article>
			`;
		});

		const slidesWithArticles = slides.map((slide, index) => {
			if (index === 0) {
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
		let fetchURL = "http://salmankhoolia.local/wp-json/wp/v2/posts?_embed";
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

	if (document.body.id === "homePage") {
		fetchBlogPosts();
	}
	if (document.body.id === "blogPage") {
		fetchLast10Posts(blogPostsElement, 10, 0);
	}

	const singleArticleContainer = document.getElementById("single-article");
	const commentsContainer = document.getElementById("comments-container");
	const commentsContainerTitle = document.getElementById(
		"comments-container-title"
	);

	function updatePageTitle(title) {
		document.title = document.title.replace("default title", title);
	}

	function getPostIDFromURL() {
		let params = new URLSearchParams(document.location.search.substring(1));
		return params.get("id");
	}

	function parseDate(date) {
		const parts = date.split("T");
		return parts[0];
	}

	function createCommentElement(comment) {
		const commentElement = document.createElement("article");
		commentElement.classList.add("post");
		commentElement.classList.add("comment");

		// comment author
		const commentAuthorElement = document.createElement("div");
		commentAuthorElement.classList.add("comment-author");
		commentAuthorElement.innerHTML = comment.author_name;

		const commentDateElement = document.createElement("span");
		commentDateElement.classList.add("comment-date");
		commentDateElement.innerHTML = parseDate(comment.date);

		commentAuthorElement.appendChild(commentDateElement);

		const commentContentElement = document.createElement("div");
		commentContentElement.classList.add("comment-content");
		commentContentElement.innerHTML = comment.content.rendered;

		commentElement.appendChild(commentAuthorElement);
		commentElement.appendChild(commentContentElement);

		return commentElement;
	}

	function fetchCommentsByPostID(id) {
		let fetchURL =
			"http://salmankhoolia.local/wp-json/wp/v2/comments?post=" + id + "&_embed";

		return fetch(fetchURL)
			.then(function (response) {
				return response.json();
			})
			.then(function (comments) {
				if (comments.length === 0) {
					commentsContainerTitle.style.display = "none";
				} else {
					commentsContainerTitle.style.display = "block";
				}
				comments.forEach(function (comment) {
					const commentElement = createCommentElement(comment);

					commentsContainer.appendChild(commentElement);
				});
			})
			.catch(function (error) {
				console.log("Error fetching comments:", error);
			});
	}
	function fetchPostByID(id) {
		let fetchURL =
			"http://salmankhoolia.local/wp-json/wp/v2/posts/" + id + "?_embed";

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
		fetchCommentsByPostID(postId);
	}

	const commentForm = document.getElementById("commentForm");
	commentForm?.addEventListener("submit", function (event) {
		event.preventDefault();
		const commentData = JSON.stringify({
			post: postId,
			author_name: commentForm.author.value,
			author_email: commentForm.email.value,
			content: commentForm.comment.value,
		});
		fetch("http://salmankhoolia.local/wp-json/wp/v2/comments", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: commentData,
		})
			.then(function (response) {
				return response.json();
			})
			.then(function (comment) {
				console.log(comment);
				commentForm.author.value = "";
				commentForm.email.value = "";
				commentForm.comment.value = "";

				const commentElement = createCommentElement(comment);
				commentsContainer.appendChild(commentElement);
			})
			.catch(function (error) {
				console.log("Error creating comment:", error);
			});
	});
});


document.getElementById("subscription-form").addEventListener("submit", function(event) {
	event.preventDefault();

	var emailInput = document.getElementById("email-input");
	var message = document.getElementById("subscription-message");

	var email = emailInput.value.trim();

	if (email === "") {
	  return;
	}


	emailInput.style.display = "none";
	message.textContent = "Thanks for subscribing to us";
  });


  document.addEventListener("DOMContentLoaded", function() {
    var blogPostsElement = document.getElementById("blog-posts");
    var seeMoreButton = document.getElementById("see-more");
    var allPosts = [];
    var displayCount = 3;

    function displayBlogPosts(posts) {
        blogPostsElement.innerHTML = "";

        posts.forEach(function(post, index) {
            var postElement = createPostElement(post);
            blogPostsElement.appendChild(postElement);

            if (index >= displayCount) {
                postElement.style.display = "none";
            }
        });

        if (posts.length > displayCount) {
            seeMoreButton.style.display = "block";
        } else {
            seeMoreButton.style.display = "none";
        }
    }

    function createPostElement(post) {
        var postElement = document.createElement("div");
        postElement.classList.add("post");

        var titleElement = document.createElement("h2");
        titleElement.textContent = post.title.rendered;

        var contentElement = document.createElement("div");
        contentElement.innerHTML = post.content.rendered;

        postElement.appendChild(titleElement);
        postElement.appendChild(contentElement);

        return postElement;
    }

    function fetchBlogPosts() {
        fetch("http://salmankhoolia.local/wp-json/wp/v2/posts")
            .then(function(response) {
                return response.json();
            })
            .then(function(posts) {
                allPosts = posts;
                displayBlogPosts(allPosts);
            })
            .catch(function(error) {
                console.log("Error fetching blog posts:", error);
            });
    }

    seeMoreButton.addEventListener("click", function() {
        window.location.href = "./blog.html";
    });

    fetchBlogPosts();
});
