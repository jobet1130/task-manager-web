const API_BASE = 'http://localhost:3000/api';

// Test data
const testUser = {
  email: 'testuser@example.com',
  password: 'testpassword123',
  full_name: 'Test User'
};

const testProject = {
  name: 'CRUD Test Project',
  description: 'Testing all CRUD operations',
  color: '#3B82F6'
};

const testTask = {
  title: 'CRUD Test Task',
  description: 'Testing task CRUD operations',
  status: 'todo',
  priority: 'medium',
  due_date: '2024-12-31T23:59:59.000Z'
};

let authToken = '';
let userId = '';
let projectId = '';
let taskId = '';
let commentId = '';

// Helper function for API requests
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

// CRUD Test Functions
async function testFullCRUD() {
  console.log('🚀 Starting Full CRUD API Tests\n');
  
  try {
    // 1. Authentication
    console.log('\n=== AUTHENTICATION TESTS ===');
    await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(testUser)
    });
    
    const loginResult = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    if (loginResult.data && loginResult.data.token) {
      authToken = loginResult.data.token;
      userId = loginResult.data.user.id;
    }

    // 2. Projects CRUD
    console.log('\n=== PROJECTS CRUD TESTS ===');
    
    // CREATE Project
    const createProjectResult = await apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(testProject)
    });
    if (createProjectResult.data && createProjectResult.data.id) {
      projectId = createProjectResult.data.id;
    }
    
    // READ Projects
    await apiRequest('/projects');
    
    // READ Project by ID
    if (projectId) {
      await apiRequest(`/projects/${projectId}`);
    }
    
    // UPDATE Project
    if (projectId) {
      await apiRequest(`/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated CRUD Test Project',
          description: 'Updated description'
        })
      });
    }

    // 3. Tasks CRUD
    console.log('\n=== TASKS CRUD TESTS ===');
    
    if (projectId) {
      // CREATE Task
      const createTaskResult = await apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          ...testTask,
          project_id: projectId
        })
      });
      if (createTaskResult.data && createTaskResult.data.id) {
        taskId = createTaskResult.data.id;
      }
      
      // READ Tasks
      await apiRequest('/tasks');
      
      // READ Task by ID
      if (taskId) {
        await apiRequest(`/tasks/${taskId}`);
      }
      
      // UPDATE Task
      if (taskId) {
        await apiRequest(`/tasks/${taskId}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: 'Updated CRUD Test Task',
            status: 'in_progress',
            priority: 'high'
          })
        });
      }
    }

    // 4. Users CRUD
    console.log('\n=== USERS CRUD TESTS ===');
    
    // READ Users
    await apiRequest('/users');
    
    // READ User by ID
    if (userId) {
      await apiRequest(`/users/${userId}`);
    }
    
    // UPDATE User Profile
    if (userId) {
      await apiRequest(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({
          full_name: 'Updated Test User'
        })
      });
    }

    // 5. Comments CRUD
    console.log('\n=== COMMENTS CRUD TESTS ===');
    
    if (taskId) {
      // CREATE Comment
      await apiRequest(`/tasks/${taskId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          content: 'This is a test comment for CRUD testing'
        })
      });
      
      // READ Comments
      await apiRequest(`/tasks/${taskId}/comments`);
    }

    // 6. Project Members CRUD
    console.log('\n=== PROJECT MEMBERS CRUD TESTS ===');
    
    if (projectId) {
      // READ Members
      await apiRequest(`/projects/${projectId}/members`);
    }

    // 7. DELETE Operations (in reverse order)
    console.log('\n=== DELETE OPERATIONS ===');
    
    // DELETE Task
    if (taskId) {
      await apiRequest(`/tasks/${taskId}`, { method: 'DELETE' });
    }
    
    // DELETE Project
    if (projectId) {
      await apiRequest(`/projects/${projectId}`, { method: 'DELETE' });
    }
    
    console.log('\n✅ All CRUD tests completed!');
    
  } catch (error) {
    console.error('\n❌ CRUD test suite failed:', error.message);
  }
}

// Run tests
if (require.main === module) {
  testFullCRUD();
}

module.exports = { testFullCRUD };