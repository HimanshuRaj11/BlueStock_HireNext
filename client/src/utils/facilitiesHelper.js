
export const fetchFacilitiesByName = async (name) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/facilities?name=${encodeURIComponent(name)}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return { error: error.message };
  }
};

export const fetchFacilitiesByIds = async (ids) => {
  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) return [];

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/facilities/by-ids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ ids })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch facilities. Status: ${response.status}`);
    }

    const data = await response.json();

    // Debugging log - remove in production
    console.log('Facilities API Response:', data);

    // Handle different possible response structures
    if (data.data) return data.data;
    if (Array.isArray(data)) return data;
    return [];

  } catch (error) {
    console.error('Error fetching facilities:', error);
    // Return fallback placeholder objects
    return ids.map(id => ({ id, name: `Facility ${id}` }));
  }
};
