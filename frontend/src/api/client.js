export async function analyzeImage(file, token) {
  const formData = new FormData();
  formData.append('file', file);

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    let detail;
    try {
      detail = JSON.parse(text).detail;
    } catch {
      detail = text || `Request failed with status ${response.status}`;
    }
    throw new Error(detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getRecommendations(topics, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('/api/recommend', {
    method: 'POST',
    headers,
    body: JSON.stringify({ topics }),
  });

  if (!response.ok) {
    const text = await response.text();
    let detail;
    try {
      detail = JSON.parse(text).detail;
    } catch {
      detail = text || `Request failed with status ${response.status}`;
    }
    throw new Error(detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}
