/**
 * Quick Test Script for Quiver AI
 * 
 * Test API connection and generate 1 sample SVG
 */

const QUIVER_API_KEY = 'sk_live_3W73ayHpD59vXF1WrfTfRn';
const QUIVER_API_URL = 'https://api.quiver.ai/v1';

async function quickTest() {
  console.log('🧪 Quick Test: Quiver AI API');
  console.log('='.repeat(60));
  
  // Test 1: Check API connection
  console.log('\n1️⃣ Testing API connection...');
  try {
    const response = await fetch(`${QUIVER_API_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${QUIVER_API_KEY}`
      }
    });
    
    if (response.ok) {
      const models = await response.json();
      console.log('   ✅ API connection successful!');
      console.log(`   Available models: ${models.data?.length || 0}`);
    } else {
      console.log('   ❌ API connection failed');
      console.log(`   Status: ${response.status} ${response.statusText}`);
      return;
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return;
  }

  // Test 2: Generate sample SVG
  console.log('\n2️⃣ Generating sample SVG...');
  console.log('   Prompt: "Simple blue book icon, flat design"');
  
  try {
    const response = await fetch(`${QUIVER_API_URL}/svgs/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QUIVER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: 'Simple blue book icon, flat design, minimalist, educational',
        n: 1,
        model: 'arrow-1.0'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ SVG generated successfully!');
      console.log(`   Length: ${data.data?.[0]?.length || 0} characters`);
      console.log('\n   Preview (first 200 chars):');
      console.log('   ' + (data.data?.[0]?.substring(0, 200) || 'No data'));
      
      // Save to file
      const fs = require('fs');
      if (!fs.existsSync('./test-output')) {
        fs.mkdirSync('./test-output');
      }
      fs.writeFileSync('./test-output/sample.svg', data.data[0], 'utf8');
      console.log('\n   💾 Saved to: ./test-output/sample.svg');
      console.log('   Open this file in browser to view!');
    } else {
      const error = await response.json();
      console.log('   ❌ Generation failed');
      console.log(`   Error: ${error.message || response.statusText}`);
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✨ Test complete!');
  console.log('\nNext steps:');
  console.log('  1. Check ./test-output/sample.svg');
  console.log('  2. If OK, run: node generate-svgs.js');
  console.log('='.repeat(60));
}

quickTest();
