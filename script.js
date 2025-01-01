// EmailJS Configuration
(function () {
    emailjs.init("7DIA1QXYHngdQJuxd"); // Replace with your EmailJS user ID
})();

document.querySelector("#contact-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const message = document.querySelector("#message").value;

    // Send email using EmailJS
    emailjs
        .send("service_hhrrtts", "template_e0mp1qo", {
            name: name,
            email: email,
            message: message,
        })
        .then(
            function () {
                alert("Message sent successfully!");
                document.querySelector("#contact-form").reset(); // Reset the form
            },
            function (error) {
                alert("Failed to send message. Please try again later.");
                console.error("EmailJS Error:", error);
            }
        );
});