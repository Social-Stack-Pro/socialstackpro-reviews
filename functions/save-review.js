const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const data = JSON.parse(event.body);
    const filePath = path.join(__dirname, 'reviews.json');

    let reviews = [];

    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        reviews = JSON.parse(fileData);
    }

    reviews.push(data);

    fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Review saved' })
    };
};
