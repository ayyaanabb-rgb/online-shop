// Initialize cart from localStorage or start empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Scroll Reveal Observer for Cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        // Add a slight stagger to the animation
        card.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(card);
    });

    // Dark Mode Logic
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.innerText = currentTheme === 'dark' ? '☀️' : '🌙';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.innerText = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }

    // Attach event listeners to all 'Add to Cart' buttons
    const addToCartButtons = document.querySelectorAll('.btn-add');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const productName = card.querySelector('.p-name').innerText;
            const priceText = card.querySelector('.price').innerText;
            // Parse "$999" into 999
            const price = parseFloat(priceText.replace('$', ''));

            addToCart(productName, price);
            showToast(`Added ${productName} to cart!`);
            
            // Add a small bounce animation to the button
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Modal Logic
    const cartBtnElement = document.querySelector('.cart-btn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartModal = document.getElementById('cartModal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');

    // Use event delegation for the cart button to ensure it always works
    document.addEventListener('click', (e) => {
        if (e.target.closest('.cart-btn')) {
            renderCartItems();
            cartModal.classList.add('active');
        }
    });

    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    // Close modal if clicked outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove('active');
        }
    });

    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
        } else {
            cartModal.classList.remove('active');
            
            // Calculate total for checkout modal
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('checkoutSubtotal').innerText = `$${total.toFixed(2)}`;
            document.getElementById('checkoutTotal').innerText = `$${total.toFixed(2)}`;
            
            checkoutModal.classList.add('active');
        }
    });

    confirmPaymentBtn.addEventListener('click', () => {
        const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
        checkoutModal.classList.remove('active');
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();
        
        showToast(`Payment of ${document.getElementById('checkoutTotal').innerText} via ${selectedPayment} successful!`);
    });

    // Product Card Clicks (Route to product details)
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // If the user clicked the add-to-cart button, don't trigger the card click
            if (e.target.closest('.btn-add')) return;
            
            const productName = card.querySelector('.p-name').innerText;
            const productPrice = card.querySelector('.price').innerText;
            const productImage = card.querySelector('.p-img').src;
            
            // Save selected product to local storage for product.html to read
            localStorage.setItem('selectedProduct', JSON.stringify({
                name: productName,
                price: productPrice,
                image: productImage
            }));
            
            window.location.href = 'product.html';
        });
    });

    // Category Filtering
    const categoryItems = document.querySelectorAll('.cat-item');
    categoryItems.forEach(cat => {
        cat.addEventListener('click', () => {
            // Remove active class from all
            categoryItems.forEach(c => c.classList.remove('active'));
            // Add active class to clicked
            cat.classList.add('active');
            
            const target = cat.getAttribute('data-target');
            
            productCards.forEach(card => {
                if (target === 'all' || card.getAttribute('data-category') === target) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Search Functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            productCards.forEach(card => {
                const name = card.querySelector('.p-name').innerText.toLowerCase();
                if (name.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    saveCart();
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartBtn = document.querySelector('.cart-btn');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBtn.innerHTML = `🛒 <span class="cart-badge">${totalItems}</span>`;
    
    // Add pop animation to cart button when updated
    if (totalItems > 0) {
        cartBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            cartBtn.style.transform = 'scale(1)';
        }, 200);
    }
}

function renderCartItems() {
    try {
        const cartItemsList = document.getElementById('cartItemsList');
        const cartTotalAmount = document.getElementById('cartTotalAmount');
        
        cartItemsList.innerHTML = '';
        let total = 0;

        if (!cart || cart.length === 0) {
            cartItemsList.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                // Defensive parsing in case localStorage data is corrupted
                const price = Number(item.price) || 0;
                const qty = Number(item.quantity) || 1;
                
                total += price * qty;
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name || 'Unknown Item'}</h4>
                        <p>$${price.toFixed(2)} x ${qty}</p>
                    </div>
                    <button class="remove-item-btn" onclick="removeFromCart(${index})">&times;</button>
                `;
                cartItemsList.appendChild(itemEl);
            });
        }

        cartTotalAmount.innerText = `$${total.toFixed(2)}`;
    } catch (e) {
        console.error("Cart render error:", e);
        alert("Oops! There was an issue opening your cart. Try clearing your browser cache/cookies.");
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    renderCartItems();
}

// Simple Toast Notification System
function showToast(message) {
    const toast = document.createElement('div');
    toast.innerText = message;
    
    // Inline styling for the toast
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'var(--primary)',
        color: 'var(--white)',
        padding: '1rem 2rem',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
        zIndex: '1000',
        fontWeight: '600',
        transform: 'translateY(100px)',
        opacity: '0',
        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    });

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
