document.getElementById('reviewForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch('/.netlify/functions/save-review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            window.location.href = '/success';
        } else {
            alert('There was a problem with your submission.');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('There was a problem with your submission.');
    }
});

async function fetchReviews() {
    try {
        const response = await fetch('/.netlify/functions/get-reviews');
        const reviews = await response.json();

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
