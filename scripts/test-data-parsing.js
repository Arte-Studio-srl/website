#!/usr/bin/env node

/**
 * Test data parsing to ensure regex correctly extracts full arrays
 */

const fs = require('fs').promises;
const path = require('path');

console.log('\n🧪 Testing Data Parsing\n');

async function testParsing() {
  try {
    // Read the actual data file
    const dataPath = path.join(process.cwd(), 'data', 'projects.ts');
    const content = await fs.readFile(dataPath, 'utf-8');
    
    console.log('1. Testing GREEDY regex (correct) ✅');
    console.log('   Pattern: /export const projects: Project\\[\\] = (\\[[\\s\\S]*\\n\\]);/');
    
    // Test greedy matching (correct)
    const projectsMatchGreedy = content.match(/export const projects: Project\[\] = (\[[\s\S]*\n\]);/);
    const categoriesMatchGreedy = content.match(/export const categories: Category\[\] = (\[[\s\S]*\n\]);/);
    
    if (!projectsMatchGreedy || !categoriesMatchGreedy) {
      console.error('❌ Failed to match arrays with greedy regex');
      process.exit(1);
    }
    
    // Parse the extracted JSON
    let projects, categories;
    try {
      projects = JSON.parse(projectsMatchGreedy[1]);
      categories = JSON.parse(categoriesMatchGreedy[1]);
      console.log(`   ✅ Projects parsed: ${projects.length} projects`);
      console.log(`   ✅ Categories parsed: ${categories.length} categories`);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON with greedy regex:', parseError.message);
      process.exit(1);
    }
    
    // Verify data integrity
    console.log('\n2. Verifying data integrity...');
    
    let errors = 0;
    
    projects.forEach((project, idx) => {
      if (!project.id) {
        console.error(`   ❌ Project ${idx} missing id`);
        errors++;
      }
      if (!project.stages || !Array.isArray(project.stages)) {
        console.error(`   ❌ Project ${idx} (${project.id}) missing or invalid stages`);
        errors++;
      } else {
        project.stages.forEach((stage, stageIdx) => {
          if (!stage.images || !Array.isArray(stage.images)) {
            console.error(`   ❌ Project ${idx} (${project.id}) stage ${stageIdx} missing or invalid images array`);
            errors++;
          }
        });
      }
    });
    
    if (errors === 0) {
      console.log('   ✅ All projects have valid structure');
    } else {
      console.error(`   ❌ Found ${errors} structural errors`);
      process.exit(1);
    }
    
    // Test non-greedy (incorrect) for comparison
    console.log('\n3. Testing NON-GREEDY regex (incorrect) ❌');
    console.log('   Pattern: /export const projects: Project\\[\\] = (\\[[\\s\\S]*?\\n\\]);/');
    
    const projectsMatchNonGreedy = content.match(/export const projects: Project\[\] = (\[[\s\S]*?\n\]);/);
    
    if (projectsMatchNonGreedy) {
      console.log(`   Match found, length: ${projectsMatchNonGreedy[1].length} chars`);
      console.log(`   Greedy match length: ${projectsMatchGreedy[1].length} chars`);
      console.log(`   Difference: ${projectsMatchGreedy[1].length - projectsMatchNonGreedy[1].length} chars`);
      
      if (projectsMatchNonGreedy[1].length < projectsMatchGreedy[1].length) {
        console.log('   ❌ Non-greedy match is SHORTER - would truncate data!');
        
        // Try to parse it to show it fails
        try {
          const truncatedProjects = JSON.parse(projectsMatchNonGreedy[1]);
          console.log(`   ⚠️  Somehow parsed ${truncatedProjects.length} projects (data loss!)`);
        } catch (e) {
          console.log(`   ❌ Parse error (as expected): ${e.message.substring(0, 100)}...`);
        }
      } else {
        console.log('   ℹ️  Both matches are the same length (no nested arrays with ]; pattern)');
      }
    }
    
    // Summary
    console.log('\n✅ Data parsing test PASSED!');
    console.log('\nSummary:');
    console.log(`  • ${projects.length} projects successfully parsed`);
    console.log(`  • ${categories.length} categories successfully parsed`);
    console.log('  • All nested arrays (stages, images) intact');
    console.log('  • Greedy regex correctly captures full arrays');
    console.log('\n🎉 The fix is working correctly!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testParsing();

