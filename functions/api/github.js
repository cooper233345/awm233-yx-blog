export async function onRequest(context) {
	const { request } = context;
	const url = new URL(request.url);
	const path = url.searchParams.get('path');

	if (!path) {
		return new Response(JSON.stringify({ error: 'Missing path parameter' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
		});
	}

	const token = request.headers.get('Authorization');
	if (!token) {
		return new Response(JSON.stringify({ error: 'Missing authorization' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
		});
	}

	const githubUrl = 'https://api.github.com' + path;
	const body = request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : null;

	try {
		const resp = await fetch(githubUrl, {
			method: request.method,
			headers: {
				Authorization: token,
				'Accept': 'application/vnd.github.v3+json',
				'Content-Type': 'application/json',
				'User-Agent': 'awm233-blog',
			},
			body: body,
		});

		const data = await resp.json();
		return new Response(JSON.stringify(data), {
			status: resp.status,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
		});
	}
}
