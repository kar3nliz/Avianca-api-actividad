const BASE_URL = 'https://restcountries.com/v3.1';

export const API_ENDPOINTS = {
  ALL_COUNTRIES: `${BASE_URL}/all`,
  COUNTRY_BY_NAME: `${BASE_URL}/name`,
  COUNTRIES_BY_REGION: `${BASE_URL}/region`
};

export const fetchAllCountries = async () => {
  try {
    const response = await fetch(`${API_ENDPOINTS.ALL_COUNTRIES}?fields=name,capital,region,population,flags,cca3`);
    if (!response.ok) throw new Error('Error fetching countries');
    return await response.json();
  } catch (error) {
    throw new Error(`API Error: ${error.message}`);
  }
};

export const fetchCountryByName = async (name) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.COUNTRY_BY_NAME}/${name}?fields=name,capital,region,subregion,population,flags,languages,currencies,timezones,maps`);
    if (!response.ok) throw new Error('Country not found');
    return await response.json();
  } catch (error) {
    throw new Error(`API Error: ${error.message}`);
  }
};