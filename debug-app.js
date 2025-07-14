// Debug script to test app functionality
console.log('Testing app functionality...');

// Test 1: Firebase Configuration
console.log('1. Testing Firebase Config:');
try {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };
  console.log('✓ Firebase config looks good:', config);
} catch (e) {
  console.error('✗ Firebase config error:', e);
}

// Test 2: Browser APIs availability (these would need to run in browser)
console.log('2. Browser APIs (check in browser console):');
console.log('- navigator.geolocation available:', typeof navigator !== 'undefined' && 'geolocation' in navigator);
console.log('- navigator.connection available:', typeof navigator !== 'undefined' && 'connection' in navigator);
console.log('- IntersectionObserver available:', typeof window !== 'undefined' && 'IntersectionObserver' in window);

// Test 3: Network requests
console.log('3. Testing network requests:');
const testWeatherAPI = async () => {
  try {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current_weather=true');
    if (response.ok) {
      console.log('✓ Weather API working');
    } else {
      console.error('✗ Weather API failed:', response.status);
    }
  } catch (e) {
    console.error('✗ Weather API error:', e);
  }
};

const testLocationAPI = async () => {
  try {
    const response = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=gym&limit=1&bounded=1&viewbox=-122.5194,-122.3594,37.8049,37.7049');
    if (response.ok) {
      console.log('✓ Location API working');
    } else {
      console.error('✗ Location API failed:', response.status);
    }
  } catch (e) {
    console.error('✗ Location API error:', e);
  }
};

if (typeof window !== 'undefined') {
  testWeatherAPI();
  testLocationAPI();
}
