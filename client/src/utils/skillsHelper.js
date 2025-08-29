// Fetch skills by search term (GET request)
export const fetchSkillsByName = async (searchTerm) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills/search?q=${encodeURIComponent(searchTerm)}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.message || 'Failed to fetch skills');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
};


export const fetchSkillsByIds = async (ids) => {
  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) return [];

    const response = await fetch('${import.meta.env.VITE_API_BASE_URL}/api/skills/by-ids', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ ids }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.message || 'Failed to fetch skills by IDs');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error fetching skills by IDs:', error);
    return [];
  }
};

export const convertSkillsToIds = async (skillNames) => {
  if (!skillNames || skillNames.length === 0) return [];

  try {
    const response = await fetch('${import.meta.env.VITE_API_BASE_URL}/api/skills/by-ids', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ids: skillNames.map(name => name.toLowerCase().trim())
      })
    });
    if (!response.ok) throw new Error('Failed to convert skills to IDs');
    const data = await response.json();
    return data.data.map(skill => skill.id) || [];
  } catch (error) {
    console.error('Error converting skills to IDs:', error);
    return [];
  }
};

export const fetchSuggestedSkills = async () => {
  try {
    const response = await fetch('${import.meta.env.VITE_API_BASE_URL}/api/skills/suggested', {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.message || 'Failed to fetch suggested skills');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error fetching suggested skills:', error);
    return [];
  }
};