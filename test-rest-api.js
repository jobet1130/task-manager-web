const API_BASE = 'http://localhost:3000/api';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'testpassword123',
  full_name: 'Test User'
};

const testProject = {
  name: 'Test Project',
  description: 'A test project for API testing',
  color: '#3B82F6'
};

const testTask = {
  title: 'Test Task',
  description: 'A test task for API testing',
  status: 'todo',
  priority: 'medium',
  due_date: '2024-12-31T23:59:59.000Z'
};

let authToken = '';
let projectId = '';
let taskId = '';

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log(`\n${options.method || 'GET'} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return { response, data };
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    return { error };
  }
}

// Test functions
async function testHealthCheck() {
  console.log('\n=== Testing Health Check ===');
  return await apiRequest('/health');
}

async function testUserRegistration() {
  console.log('\n=== Testing User Registration ===');
  return await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
}

async function testUserLogin() {
  console.log('\n=== Testing User Login ===');
  const result = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    })
  });
  
  if (result.data && result.data.token) {
    authToken = result.data.token;
    console.log('Auth token saved for subsequent requests');
  }
  
  return result;
}

async function testCreateProject() {
  console.log('\n=== Testing Create Project ===');
  const result = await apiRequest('/projects', {
    method: 'POST',
    body: JSON.stringify(testProject)
  });
  
  if (result.data && result.data.id) {
    projectId = result.data.id;
    console.log('Project ID saved for subsequent requests');
  }
  
  return result;
}

async function testGetProjects() {
  console.log('\n=== Testing Get Projects ===');
  return await apiRequest('/projects');
}

async function testGetProjectById() {
  if (!projectId) {
    console.log('\n=== Skipping Get Project By ID (no project ID) ===');
    return;
  }
  
  console.log('\n=== Testing Get Project By ID ===');
  return await apiRequest(`/projects/${projectId}`);
}

async function testCreateTask() {
  if (!projectId) {
    console.log('\n=== Skipping Create Task (no project ID) ===');
    return;
  }
  
  console.log('\n=== Testing Create Task ===');
  const taskData = {
    ...testTask,
    project_id: projectId
  };
  
  const result = await apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData)
  });
  
  if (result.data && result.data.id) {
    taskId = result.data.id;
    console.log('Task ID saved for subsequent requests');
  }
  
  return result;
}

async function testGetTasks() {
  console.log('\n=== Testing Get Tasks ===');
  return await apiRequest('/tasks');
}

async function testGetTasksWithFilters() {
  if (!projectId) {
    console.log('\n=== Skipping Get Tasks With Filters (no project ID) ===');
    return;
  }
  
  console.log('\n=== Testing Get Tasks With Filters ===');
  return await apiRequest(`/tasks?project_id=${projectId}&status=todo&limit=10`);
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting REST API Tests\n');
  
  try {
    // Test health check first
    await testHealthCheck();
    
    // Test authentication
    await testUserRegistration();
    await testUserLogin();
    
    // Test projects (requires authentication)
    await testCreateProject();
    await testGetProjects();
    await testGetProjectById();
    
    // Test tasks (requires authentication and project)
    await testCreateTask();
    await testGetTasks();
    await testGetTasksWithFilters();
    
    console.log('\n✅ All tests completed!');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testHealthCheck,
  testUserRegistration,
  testUserLogin,
  testCreateProject,
  testGetProjects,
  testCreateTask,
  testGetTasks
};