// Simple API test script for the Task Manager API
// Run with: node test-api.js

const BASE_URL = 'http://localhost:3000/api';

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log(`${options.method || 'GET'} ${endpoint}:`, {
      status: response.status,
      success: data.success,
      message: data.message || 'OK',
      dataLength: Array.isArray(data.data) ? data.data.length : (data.data ? 1 : 0)
    });
    
    return { response, data };
  } catch (error) {
    console.error(`Error with ${endpoint}:`, error.message);
    return { error };
  }
}

// Test functions
async function testProfiles() {
  console.log('\n=== Testing Profiles API ===');
  
  // Create a profile
  const createResult = await apiRequest('/profiles', {
    method: 'POST',
    body: JSON.stringify({
      email: 'test@example.com',
      full_name: 'Test User'
    })
  });
  
  if (createResult.data?.success) {
    const profileId = createResult.data.data.id;
    
    // Get all profiles
    await apiRequest('/profiles');
    
    // Get specific profile
    await apiRequest(`/profiles/${profileId}`);
    
    // Update profile
    await apiRequest(`/profiles/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify({
        full_name: 'Updated Test User'
      })
    });
    
    return profileId;
  }
  
  return null;
}

async function testProjects(ownerId) {
  console.log('\n=== Testing Projects API ===');
  
  if (!ownerId) {
    console.log('Skipping projects test - no owner ID');
    return null;
  }
  
  // Create a project
  const createResult = await apiRequest('/projects', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test Project',
      description: 'A test project',
      owner_id: ownerId,
      color: '#3B82F6'
    })
  });
  
  if (createResult.data?.success) {
    const projectId = createResult.data.data.id;
    
    // Get all projects
    await apiRequest('/projects');
    
    // Get specific project
    await apiRequest(`/projects/${projectId}`);
    
    // Update project
    await apiRequest(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: 'Updated Test Project'
      })
    });
    
    return projectId;
  }
  
  return null;
}

async function testTasks(projectId, creatorId) {
  console.log('\n=== Testing Tasks API ===');
  
  if (!projectId || !creatorId) {
    console.log('Skipping tasks test - missing project or creator ID');
    return null;
  }
  
  // Create a task
  const createResult = await apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Test Task',
      description: 'A test task',
      project_id: projectId,
      creator_id: creatorId,
      status: 'todo',
      priority: 'medium'
    })
  });
  
  if (createResult.data?.success) {
    const taskId = createResult.data.data.id;
    
    // Get all tasks
    await apiRequest('/tasks');
    
    // Get specific task
    await apiRequest(`/tasks/${taskId}`);
    
    // Update task
    await apiRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: 'in_progress'
      })
    });
    
    return taskId;
  }
  
  return null;
}

async function testSubtasks(taskId) {
  console.log('\n=== Testing Subtasks API ===');
  
  if (!taskId) {
    console.log('Skipping subtasks test - no task ID');
    return;
  }
  
  // Create a subtask
  const createResult = await apiRequest(`/tasks/${taskId}/subtasks`, {
    method: 'POST',
    body: JSON.stringify({
      title: 'Test Subtask',
      description: 'A test subtask'
    })
  });
  
  if (createResult.data?.success) {
    const subtaskId = createResult.data.data.id;
    
    // Get all subtasks
    await apiRequest(`/tasks/${taskId}/subtasks`);
    
    // Update subtask
    await apiRequest(`/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'PUT',
      body: JSON.stringify({
        is_completed: true
      })
    });
  }
}

async function testTags() {
  console.log('\n=== Testing Tags API ===');
  
  // Create a tag
  const createResult = await apiRequest('/tags', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test Tag',
      color: '#EF4444'
    })
  });
  
  if (createResult.data?.success) {
    const tagId = createResult.data.data.id;
    
    // Get all tags
    await apiRequest('/tags');
    
    // Get specific tag
    await apiRequest(`/tags/${tagId}`);
    
    return tagId;
  }
  
  return null;
}

async function testComments(taskId, authorId) {
  console.log('\n=== Testing Comments API ===');
  
  if (!taskId || !authorId) {
    console.log('Skipping comments test - missing task or author ID');
    return;
  }
  
  // Create a comment
  const createResult = await apiRequest(`/tasks/${taskId}/comments`, {
    method: 'POST',
    body: JSON.stringify({
      content: 'This is a test comment',
      author_id: authorId
    })
  });
  
  if (createResult.data?.success) {
    const commentId = createResult.data.data.id;
    
    // Get all comments
    await apiRequest(`/tasks/${taskId}/comments`);
    
    // Update comment
    await apiRequest(`/tasks/${taskId}/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({
        content: 'Updated test comment'
      })
    });
  }
}

// Main test function
async function runTests() {
  console.log('Starting API Tests...');
  console.log('Make sure your Next.js development server is running on http://localhost:3000');
  
  try {
    const profileId = await testProfiles();
    const projectId = await testProjects(profileId);
    const taskId = await testTasks(projectId, profileId);
    await testSubtasks(taskId);
    const tagId = await testTags();
    await testComments(taskId, profileId);
    
    console.log('\n=== Test Summary ===');
    console.log('All API tests completed!');
    console.log('Check the output above for any errors.');
    console.log('\nNote: This script creates test data in your database.');
    console.log('You may want to clean up the test data afterwards.');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('This script requires Node.js 18+ or you need to install node-fetch');
  console.log('Install with: npm install node-fetch');
  console.log('Then add: const fetch = require("node-fetch"); at the top of this file');
  process.exit(1);
}

// Run the tests
runTests();