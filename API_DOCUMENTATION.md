# Task Manager API Documentation

This document describes the REST API endpoints for the Task Manager application.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, the API does not implement authentication. In a production environment, you should add proper authentication and authorization.

## Response Format
All API responses follow this format:
```json
{
  "success": boolean,
  "data": object | array,
  "message": string,
  "error": string,
  "pagination": {
    "total": number,
    "limit": number,
    "offset": number,
    "hasMore": boolean
  }
}
```

## Profiles API

### GET /api/profiles
Retrieve all profiles with optional filtering.

**Query Parameters:**
- `search` (string): Search by email or full name
- `limit` (number): Number of results to return (default: 50)
- `offset` (number): Number of results to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "John Doe",
      "avatar_url": "https://example.com/avatar.jpg",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### POST /api/profiles
Create a new profile.

**Request Body:**
```json
{
  "email": "user@example.com",
  "full_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

### GET /api/profiles/[id]
Retrieve a specific profile by ID.

### PUT /api/profiles/[id]
Update a profile.

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "full_name": "New Name",
  "avatar_url": "https://example.com/newavatar.jpg"
}
```

### DELETE /api/profiles/[id]
Delete a profile.

## Projects API

### GET /api/projects
Retrieve all projects with optional filtering.

**Query Parameters:**
- `search` (string): Search by project name
- `user_id` (string): Filter by user ID (projects where user is a member)
- `archived` (boolean): Filter by archived status
- `limit` (number): Number of results to return (default: 50)
- `offset` (number): Number of results to skip (default: 0)

### POST /api/projects
Create a new project.

**Request Body:**
```json
{
  "name": "Project Name",
  "description": "Project description",
  "owner_id": "uuid",
  "color": "#3B82F6"
}
```

### GET /api/projects/[id]
Retrieve a specific project with members, task count, and member count.

### PUT /api/projects/[id]
Update a project.

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "color": "#EF4444",
  "is_archived": false
}
```

### DELETE /api/projects/[id]
Delete a project.

## Project Members API

### GET /api/projects/[id]/members
Retrieve all members of a project.

### POST /api/projects/[id]/members
Add a member to a project.

**Request Body:**
```json
{
  "user_id": "uuid",
  "role": "member" // owner, admin, member, viewer
}
```

### PUT /api/projects/[id]/members/[userId]
Update a member's role.

**Request Body:**
```json
{
  "role": "admin"
}
```

### DELETE /api/projects/[id]/members/[userId]
Remove a member from a project.

## Tasks API

### GET /api/tasks
Retrieve all tasks with optional filtering.

**Query Parameters:**
- `project_id` (string): Filter by project ID
- `assignee_id` (string): Filter by assignee ID
- `status` (string): Filter by status (todo, in_progress, done)
- `priority` (string): Filter by priority (low, medium, high, urgent)
- `search` (string): Search by title or description
- `limit` (number): Number of results to return (default: 50)
- `offset` (number): Number of results to skip (default: 0)
- `sort_by` (string): Sort field (default: created_at)
- `sort_order` (string): Sort order (ASC, DESC, default: DESC)

### POST /api/tasks
Create a new task.

**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task description",
  "project_id": "uuid",
  "creator_id": "uuid",
  "assignee_id": "uuid",
  "status": "todo",
  "priority": "medium",
  "due_date": "2024-12-31T23:59:59Z"
}
```

### GET /api/tasks/[id]
Retrieve a specific task with subtasks, tags, comments, and attachments.

### PUT /api/tasks/[id]
Update a task.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "assignee_id": "uuid",
  "status": "in_progress",
  "priority": "high",
  "due_date": "2024-12-31T23:59:59Z"
}
```

### DELETE /api/tasks/[id]
Delete a task.

## Subtasks API

### GET /api/tasks/[id]/subtasks
Retrieve all subtasks for a task.

### POST /api/tasks/[id]/subtasks
Create a new subtask.

**Request Body:**
```json
{
  "title": "Subtask Title",
  "description": "Subtask description",
  "is_completed": false
}
```

### PUT /api/tasks/[id]/subtasks/[subtaskId]
Update a subtask.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "is_completed": true
}
```

### DELETE /api/tasks/[id]/subtasks/[subtaskId]
Delete a subtask.

## Comments API

### GET /api/tasks/[id]/comments
Retrieve all comments for a task.

**Query Parameters:**
- `limit` (number): Number of results to return (default: 20)
- `offset` (number): Number of results to skip (default: 0)

### POST /api/tasks/[id]/comments
Create a new comment.

**Request Body:**
```json
{
  "content": "Comment content",
  "author_id": "uuid"
}
```

### PUT /api/tasks/[id]/comments/[commentId]
Update a comment.

**Request Body:**
```json
{
  "content": "Updated comment content"
}
```

### DELETE /api/tasks/[id]/comments/[commentId]
Delete a comment.

## Tags API

### GET /api/tags
Retrieve all tags.

**Query Parameters:**
- `search` (string): Search by tag name
- `limit` (number): Number of results to return (default: 50)
- `offset` (number): Number of results to skip (default: 0)

### POST /api/tags
Create a new tag.

**Request Body:**
```json
{
  "name": "Tag Name",
  "color": "#3B82F6"
}
```

### GET /api/tags/[id]
Retrieve a specific tag with usage count.

### PUT /api/tags/[id]
Update a tag.

**Request Body:**
```json
{
  "name": "Updated Tag Name",
  "color": "#EF4444"
}
```

### DELETE /api/tags/[id]
Delete a tag.

## Task Tags API

### GET /api/tasks/[id]/tags
Retrieve all tags for a task.

### POST /api/tasks/[id]/tags
Add a tag to a task.

**Request Body:**
```json
{
  "tag_id": "uuid"
}
```

### DELETE /api/tasks/[id]/tags/[tagId]
Remove a tag from a task.

## Attachments API

### GET /api/tasks/[id]/attachments
Retrieve all attachments for a task.

### POST /api/tasks/[id]/attachments
Add an attachment to a task.

**Request Body:**
```json
{
  "filename": "document.pdf",
  "file_url": "https://example.com/files/document.pdf",
  "file_size": 1024000
}
```

### DELETE /api/tasks/[id]/attachments/[attachmentId]
Delete an attachment.

## Error Codes

- `400` - Bad Request: Invalid request data
- `404` - Not Found: Resource not found
- `409` - Conflict: Resource already exists or constraint violation
- `500` - Internal Server Error: Server error

## Database Setup

Before using the API, make sure to:

1. Set up your PostgreSQL database
2. Run the `init.sql` script to create tables and sample data
3. Configure your database connection in the environment variables

## Environment Variables

Create a `.env.local` file with:

```
DATABASE_URL=postgresql://username:password@localhost:5432/taskmanager
```

## Getting Started

1. Install dependencies: `npm install`
2. Set up your database and environment variables
3. Run the development server: `npm run dev`
4. The API will be available at `http://localhost:3000/api`

## Example Usage

```javascript
// Create a new profile
const response = await fetch('/api/profiles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    full_name: 'John Doe'
  })
});

const result = await response.json();
console.log(result);
```