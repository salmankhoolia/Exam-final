// Function to fetch product data from the WordPress API
async function fetchProducts() {
	const admin = {
		consumerKey: "ck_e454991256b7aad537034251843463b7fd9c3d53",
		consumerSecret: "cs_f6174d52f4cbecd56c650a96bc1d525b1a7093c2",
	};

	const salman = {
		consumerKey: "ck_b899e4bea861cc679a76c4a1dfbc17801bf094d7",
		consumerSecret: "cs_50ad099ccc782c833b0a135e0e539c34134bc81f",
	};
	const url = "http://exam.local/wp-json/wc/v3/products";
	const consumerKey = "ck_b899e4bea861cc679a76c4a1dfbc17801bf094d7";
	const consumerSecret = "cs_50ad099ccc782c833b0a135e0e539c34134bc81f";

	const response = await fetch(
		`${url}?consumer_key=${salman.consumerKey}&consumer_secret=${salman.consumerSecret}`
	);
	const products = await response.json();
	console.log("Fetched products:", products);
	return products;
}

// Function to display the fetched products on the HTML page
function displayProducts(products) {
	console.log("Received products:", products);
	const productList = document.getElementById("productList");

	// Clear any existing content
	productList.innerHTML = "";

	// Check if products is an array
	if (Array.isArray(products)) {
		// Loop through the products and create HTML elements for each product
		products.forEach((product) => {
			const productElement = document.createElement("div");
			productElement.classList.add("product");

			const titleElement = document.createElement("h3");
			titleElement.textContent = product.name;

			const priceElement = document.createElement("p");
			priceElement.textContent = "Price: " + product.price;

			productElement.appendChild(titleElement);
			productElement.appendChild(priceElement);
			productList.appendChild(productElement);
		});
	} else {
		console.error("Received data is not an array:", products);
	}
}

// Fetch and display the products
fetchProducts()
	.then((products) => {
		displayProducts(products);
	})
	.catch((error) => {
		console.error("Error fetching products:", error);
	});

//   ck_7fe2e4f93ec9f08700b4f33aac60eb4cdb7463fd
//   cs_897641cd6dd225ea7e751028f5fb4e6b011c958e
