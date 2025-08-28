
export const fetchCategoriesByName = async (searchTerm) => {
  try {
    const response = await fetch(`http://localhost:3000/api/categories/search?q=${encodeURIComponent(searchTerm)}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.message || 'Failed to fetch categories');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchCategoriesByIds = async (ids) => {
  try {
    if (!ids || !Array.isArray(ids) || ids.length === 0) return [];
    
    const response = await fetch('http://localhost:3000/api/categories/by-ids', {
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
      throw new Error(errorData.message || `Failed to fetch categories. Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Debugging log - remove in production
    console.log('Categories API Response:', data);
    
    // Handle different possible response structures
    if (data.data) return data.data;
    if (Array.isArray(data)) return data;
    return [];
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty array or fallback data
    return ids.map(id => ({ id, name: `Category ${id}` }));
  }
};

export const convertCategoriesToIds = async (categoryNames) => {
  if (!categoryNames || categoryNames.length === 0) return [];
  
  try {
    const response = await fetch('http://localhost:3000/api/categories/by-ids', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ names: categoryNames }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(data.message || 'Failed to convert categories to IDs');
    }
    
    return data.data || [];
  } catch (error) {
    console.error('Error converting categories to IDs:', error);
    return [];
  }
};

export const fetchSuggestedCategories = async (searchTerm) => {
  try {
    const response = await fetch(`http://localhost:3000/api/categories/suggested`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.message || 'Failed to fetch suggested categories');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error fetching suggested categories:', error);
    return [];
  }
};
