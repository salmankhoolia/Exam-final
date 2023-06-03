document.addEventListener("DOMContentLoaded", function() {
    var contactForm = document.getElementById("contact-form");
    var successNotification = document.getElementById("success-notification");
    var firstNameInput = document.getElementById("first-name");
    var lastNameInput = document.getElementById("last-name");
    var emailInput = document.getElementById("email");
    var phoneInput = document.getElementById("phone");
    var subjectInput = document.getElementById("subject");
    var messageInput = document.getElementById("message");

    contactForm.addEventListener("submit", function(event) {
      event.preventDefault();
      if (validateForm()) {
        showNotification();
        resetForm();
      }
    });

    function validateForm() {
      var isValid = true;

      if (firstNameInput.value.length < 5) {
        setError(firstNameInput, "First name should be at least 5 characters long");
        isValid = false;
      } else {
        removeError(firstNameInput);
      }

      if (lastNameInput.value.length < 5) {
        setError(lastNameInput, "Last name should be at least 5 characters long");
        isValid = false;
      } else {
        removeError(lastNameInput);
      }

      if (!isValidEmail(emailInput.value)) {
        setError(emailInput, "Please enter a valid email address");
        isValid = false;
      } else {
        removeError(emailInput);
      }

      if (phoneInput.value.length < 10 || phoneInput.value.length > 12) {
        setError(phoneInput, "Phone number should be between 10 and 12 digits");
        isValid = false;
      } else {
        removeError(phoneInput);
      }

      if (subjectInput.value.length < 15) {
        setError(subjectInput, "Subject should be at least 15 characters long");
        isValid = false;
      } else {
        removeError(subjectInput);
      }

      if (messageInput.value.length < 25) {
        setError(messageInput, "Message should be at least 25 characters long");
        isValid = false;
      } else {
        removeError(messageInput);
      }

      return isValid;
    }

    function isValidEmail(email) {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    function setError(input, message) {
      var errorElement = input.nextElementSibling;
      errorElement.textContent = message;
      errorElement.style.display = "block";
      input.classList.add("error");
    }

    function removeError(input) {
      var errorElement = input.nextElementSibling;
      errorElement.textContent = "";
      errorElement.style.display = "none";
      input.classList.remove("error");
    }

    function showNotification() {
      successNotification.style.display = "block";
      setTimeout(function() {
        successNotification.style.display = "none";
      }, 3000);
    }

    function resetForm() {
      contactForm.reset();
    }
  });
