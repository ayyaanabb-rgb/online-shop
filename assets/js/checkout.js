document.addEventListener('DOMContentLoaded', () => {
    // Load cart from localStorage to get the total amount
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const payAmountSpan = document.getElementById('payAmount');
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    payAmountSpan.innerText = `$${total.toFixed(2)}`;

    // Handle form submission
    const paymentForm = document.getElementById('paymentForm');
    const successOverlay = document.getElementById('successOverlay');

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual form submission refresh
        
        // Show success animation
        successOverlay.classList.add('active');

        // Clear the cart
        localStorage.setItem('cart', JSON.stringify([]));

        // Redirect back to home after 3 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    });
});
