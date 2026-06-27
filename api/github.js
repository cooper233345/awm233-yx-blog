export default async function handler(req, res) {
	// CORS headers
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}

	const { path, method } = req.query;
	if (!path) {
		return res.status(400).json({ error: 'Missing path parameter' });
	}

	const token = req.headers.authorization;
	if (!token) {
		return res.status(401).json({ error: 'Missing authorization header' });
	}

	const url = `https://api.github.com${path}`;
	const options = {
		method: method || req.method || 'GET',
		headers: {
			Authorization: token,
			Accept: 'application/vnd.github.v3+json',
			'Content-Type': 'application/json',
			'User-Agent': 'awm233-blog-proxy',
		},
	};

	if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
		options.body = JSON.stringify(req.body);
	}

	try {
		const response = await fetch(url, options);
		const data = await response.json();
		res.setHeader('Content-Type', 'application/json');
		res.status(response.status).json(data);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
