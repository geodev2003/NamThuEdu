/**
 * Quiver AI SVG Generator Script
 * 
 * Generate SVG illustrations for NamThuEdu website
 * API: https://docs.quiver.ai/api-reference/introduction
 * 
 * Usage:
 *   node scripts/generate-svgs.js
 */

const fs = require('fs');
const path = require('path');

// Quiver AI Configuration
const QUIVER_API_KEY = 'sk_live_3W73ayHpD59vXF1WrfTfRn';
const QUIVER_API_URL = 'https://api.quiver.ai/v1';
const OUTPUT_DIR = './generated-svgs';

// Prompts for SVG generation
const SVG_PROMPTS = {
  // Grade Level Icons
  grades: [
    {
      name: 'kindergarten',
      prompt: 'Colorful playful kindergarten icon with crayons and paint palette, cute and friendly style, simple flat design',
      style: 'flat illustration, vibrant colors, child-friendly'
    },
    {
      name: 'grade-1',
      prompt: 'Elementary school grade 1 icon with books and pencil, bright blue colors, simple and clean design',
      style: 'flat illustration, educational, friendly'
    },
    {
      name: 'grade-2',
      prompt: 'Grade 2 icon with open book and apple, green colors, simple flat design for education',
      style: 'flat illustration, fresh colors, educational'
    },
    {
      name: 'grade-3',
      prompt: 'Grade 3 icon with notebook and pen, yellow-orange colors, modern flat design',
      style: 'flat illustration, warm colors, educational'
    },
    {
      name: 'grade-4',
      prompt: 'Grade 4 icon with pencil and ruler, purple colors, clean flat design for students',
      style: 'flat illustration, vibrant purple, educational'
    },
    {
      name: 'grade-5',
      prompt: 'Grade 5 icon with compass and protractor, indigo-blue colors, geometric flat design',
      style: 'flat illustration, cool colors, mathematical'
    }
  ],

  // Subject Icons
  subjects: [
    {
      name: 'math',
      prompt: 'Mathematics icon with numbers and calculator, blue gradient, modern flat design',
      style: 'flat illustration, professional, educational'
    },
    {
      name: 'vietnamese',
      prompt: 'Vietnamese language icon with book and Vietnamese letters, green colors, elegant design',
      style: 'flat illustration, cultural, educational'
    },
    {
      name: 'english',
      prompt: 'English language icon with ABC letters and globe, purple colors, international style',
      style: 'flat illustration, modern, global'
    },
    {
      name: 'science',
      prompt: 'Science icon with beaker and atom, orange colors, scientific flat design',
      style: 'flat illustration, scientific, educational'
    }
  ],

  // Feature Icons
  features: [
    {
      name: 'personalized-learning',
      prompt: 'Personalized learning icon with student and adaptive interface, blue gradient, modern design',
      style: 'flat illustration, tech-forward, friendly'
    },
    {
      name: 'competition',
      prompt: 'Competition and ranking icon with trophy and stars, gold-yellow colors, achievement style',
      style: 'flat illustration, celebratory, motivational'
    },
    {
      name: 'community',
      prompt: 'Community learning icon with people helping each other, green colors, collaborative design',
      style: 'flat illustration, social, friendly'
    },
    {
      name: 'rewards',
      prompt: 'Rewards and achievements icon with gift box and coins, purple-pink gradient, exciting design',
      style: 'flat illustration, rewarding, fun'
    }
  ],

  // Decorative Elements
  decorative: [
    {
      name: 'hero-illustration',
      prompt: 'Educational hero illustration with students learning on laptops and tablets, colorful gradient, modern flat design',
      style: 'flat illustration, vibrant, educational scene'
    },
    {
      name: 'success-badge',
      prompt: 'Success achievement badge with star and ribbon, gold and blue colors, award style',
      style: 'flat illustration, celebratory, premium'
    },
    {
      name: 'study-pattern',
      prompt: 'Seamless pattern with books, pencils, and educational elements, pastel colors, cute style',
      style: 'pattern design, educational, playful'
    }
  ]
};

/**
 * Generate SVG using Quiver AI API
 */
async function generateSVG(prompt, style, name) {
  console.log(`\n🎨 Generating: ${name}`);
  console.log(`   Prompt: ${prompt}`);
  
  try {
    const response = await fetch(`${QUIVER_API_URL}/svgs/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QUIVER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `${prompt}. Style: ${style}`,
        n: 4, // Generate 4 variations
        model: 'arrow-1.0' // Default model
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    console.log(`   ✅ Generated ${data.data?.length || 0} variations`);
    
    return data.data; // Array of SVG strings
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return null;
  }
}

/**
 * Save SVG to file
 */
function saveSVG(svgContent, category, name, index) {
  const categoryDir = path.join(OUTPUT_DIR, category);
  
  // Create directory if not exists
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  const filename = `${name}-${index + 1}.svg`;
  const filepath = path.join(categoryDir, filename);
  
  fs.writeFileSync(filepath, svgContent, 'utf8');
  console.log(`   💾 Saved: ${filepath}`);
}

/**
 * Generate all SVGs
 */
async function generateAll() {
  console.log('🚀 Starting Quiver AI SVG Generation');
  console.log('=' .repeat(60));
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let totalGenerated = 0;
  let totalFailed = 0;

  // Generate for each category
  for (const [category, prompts] of Object.entries(SVG_PROMPTS)) {
    console.log(`\n📁 Category: ${category.toUpperCase()}`);
    console.log('-'.repeat(60));

    for (const item of prompts) {
      const svgs = await generateSVG(item.prompt, item.style, item.name);
      
      if (svgs && svgs.length > 0) {
        // Save all variations
        svgs.forEach((svg, index) => {
          saveSVG(svg, category, item.name, index);
          totalGenerated++;
        });
      } else {
        totalFailed++;
      }

      // Rate limit: Wait 3 seconds between requests (20 requests per 60 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✨ Generation Complete!');
  console.log(`   Total Generated: ${totalGenerated} SVGs`);
  console.log(`   Total Failed: ${totalFailed} requests`);
  console.log(`   Output Directory: ${OUTPUT_DIR}`);
  console.log('='.repeat(60));
}

/**
 * Generate single SVG (for testing)
 */
async function generateSingle(prompt, name = 'test') {
  console.log('🧪 Test Mode: Generating single SVG');
  console.log('=' .repeat(60));
  
  const svgs = await generateSVG(
    prompt,
    'flat illustration, modern, clean',
    name
  );

  if (svgs && svgs.length > 0) {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    svgs.forEach((svg, index) => {
      saveSVG(svg, 'test', name, index);
    });
    
    console.log(`\n✅ Test complete! Check ${OUTPUT_DIR}/test/`);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args[0] === 'test') {
  // Test mode: Generate single SVG
  const testPrompt = args[1] || 'Colorful education icon with books and pencil';
  generateSingle(testPrompt, 'test-icon');
} else if (args[0] === 'single' && args[1]) {
  // Generate single category
  const category = args[1];
  if (SVG_PROMPTS[category]) {
    console.log(`🎯 Generating category: ${category}`);
    const prompts = SVG_PROMPTS[category];
    
    (async () => {
      for (const item of prompts) {
        const svgs = await generateSVG(item.prompt, item.style, item.name);
        if (svgs) {
          svgs.forEach((svg, index) => {
            saveSVG(svg, category, item.name, index);
          });
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      console.log('✅ Done!');
    })();
  } else {
    console.error(`❌ Category not found: ${category}`);
    console.log(`Available categories: ${Object.keys(SVG_PROMPTS).join(', ')}`);
  }
} else {
  // Generate all
  generateAll();
}
