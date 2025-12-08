#!/usr/bin/env node

/**
 * Simple test - just try to load the data using the API
 */

console.log('\n🧪 Testing Data Loading via API\n');

async function test() {
  try {
    const response = await fetch('http://localhost:3000/api/projects');
    const data = await response.json();
    
    if (!data.success) {
      console.error('❌ API returned error:', data.error);
      process.exit(1);
    }
    
    console.log(`✅ Successfully loaded ${data.projects.length} projects`);
    console.log(`✅ Successfully loaded ${data.categories.length} categories`);
    
    // Verify structure
    let errors = 0;
    data.projects.forEach((project, idx) => {
      if (!project.id) {
        console.error(`❌ Project ${idx} missing id`);
        errors++;
      }
      if (!project.stages || !Array.isArray(project.stages)) {
        console.error(`❌ Project ${idx} (${project.id}) missing stages`);
        errors++;
      } else {
        project.stages.forEach((stage, stageIdx) => {
          if (!stage.images || !Array.isArray(stage.images)) {
            console.error(`❌ Project ${project.id} stage ${stageIdx} missing images`);
            errors++;
          }
        });
      }
    });
    
    if (errors > 0) {
      console.error(`\n❌ Found ${errors} structural errors`);
      process.exit(1);
    }
    
    console.log('✅ All projects have valid structure');
    console.log('\n🎉 Data parsing is working correctly!\n');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('\n❌ Server not running');
      console.error('Start it with: npm run dev');
    } else {
      console.error('\n❌ Test failed:', error.message);
    }
    process.exit(1);
  }
}

test();

