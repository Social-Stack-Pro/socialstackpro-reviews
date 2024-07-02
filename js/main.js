async function fetchReviews() {
    try {
        const response = await fetch('/.netlify/functions/get-reviews');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const reviews = await response.json();

        const container = document.getElementById('reviews-container');
        container.innerHTML = '';

        if (reviews.length === 0) {
            container.innerHTML = '<p>No reviews yet.</p>';
        } else {
            let reviewCount = 0;
            reviews.forEach(review => {
                reviewCount++;
                const reviewElement = document.createElement('div');
                reviewElement.className = 'testimonial';

                const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

                reviewElement.innerHTML = `
                    <div class="star-rating">${stars}</div>
                    <p>"${review.comments}" - ${review.name}</p>
                `;

                container.appendChild(reviewElement);
            });

            const reviewCountElement = document.createElement('p');
            reviewCountElement.innerHTML = `Total Reviews: ${reviewCount}`;
            container.prepend(reviewCountElement);
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
        const container = document.getElementById('reviews-container');
        container.innerHTML = '<p>There was an error fetching the reviews. Please try again later.</p>';
    }
}

fetchReviews();
