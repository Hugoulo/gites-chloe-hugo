const https = require('https');

exports.handler = async function(event) {
    const url = event.queryStringParameters.url;
    
    if (!url) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'URL manquante' })
        };
    }

    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'text/calendar'
                    },
                    body: data
                });
            });
        }).on('error', (err) => {
            resolve({
                statusCode: 500,
                body: JSON.stringify({ error: err.message })
            });
        });
    });
};