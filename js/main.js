async function fetchReviews() {
    try {
        const response = await fetch('/.netlify/functions/get-reviews');
        const reviews = await response.json();

        if (!Array.isArray(reviews)) {
            throw new Error('Expected an array of reviews');
        }

        const container = document.getElementById('reviews-container');
        container.innerHTML = '';

        reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'testimonial';

            const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

            reviewElement.innerHTML = `
                <div class="star-rating">${stars}</div>
                <p>"${review.comments}" - ${review.name}</p>
            `;

            container.appendChild(reviewElement);
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

fetchReviews();
