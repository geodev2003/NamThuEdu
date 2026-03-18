# Requirements Document: Prisma ORM Integration

## Introduction

This document specifies the requirements for integrating Prisma ORM into the existing Laravel 8 backend application, replacing Eloquent ORM while maintaining all existing functionality, API endpoints, and authentication mechanisms. The integration must preserve backward compatibility with the current API contract and ensure type-safe database operations.

## Glossary

- **Prisma_Client**: The auto-generated and type-safe database client for Node.js and TypeScript
- **Laravel_Backend**: The existing Laravel 8 application with Sanctum authentication
- **Eloquent_ORM**: Laravel's built-in Object-Relational Mapping system (to be replaced)
- **API_Endpoint**: RESTful HTTP endpoints exposed by the backend (19 total endpoints)
- **Sanctum_Auth**: Laravel Sanctum token-based authentication system
- **Database_Schema**: The existing MySQL database structure with 5 main tables
- **Soft_Delete**: Database records marked as deleted without physical removal
- **Migration_Tool**: Prisma's introspection and migration capabilities
- **Type_Safety**: Compile-time type checking for database operations
- **Query_Builder**: Prisma's fluent API for constructing database queries

## Requirements

### Requirement 1: Prisma Installation and Configuration

**User Story:** As a developer, I want to install and configure Prisma in the Laravel project, so that I can use Prisma Client for database operations.

#### Acceptance Criteria

1. THE Laravel_Backend SHALL include Prisma as a project dependency
2. WHEN Prisma is initialized, THE Laravel_Backend SHALL generate a prisma directory with schema.prisma file
3. THE Laravel_Backend SHALL configure Prisma to connect to the existing MySQL database using environment variables
4. THE Laravel_Backend SHALL maintain the existing .env configuration format for database credentials
5. WHEN Prisma Client is generated, THE Laravel_Backend SHALL create type-safe client code in the node_modules directory

### Requirement 2: Database Schema Introspection

**User Story:** As a developer, I want to generate Prisma schema from the existing MySQL database, so that I can maintain the current database structure.

#### Acceptance Criteria

1. WHEN database introspection runs, THE Migration_Tool SHALL generate Prisma schema models for all 5 existing tables (users, course, posts, category, otp_logs)
2. THE Prisma_Client SHALL preserve all custom column names (uId, uPhone, cId, cName, pId, etc.)
3. THE Prisma_Client SHALL maintain all existing foreign key relationships between tables
4. THE Prisma_Client SHALL support soft delete columns (uDeleted_at, cDeleteAt, pDeleted_at)
5. THE Prisma_Client SHALL preserve custom timestamp column names (uCreated_at, cCreateAt, pCreated_at, oCreated_at)
6. THE Prisma_Client SHALL maintain enum types for uRole, uStatus, cStatus, pType, and pStatus fields

### Requirement 3: Authentication Controller Migration

**User Story:** As a developer, I want to replace Eloquent calls in AuthController with Prisma, so that authentication operations use type-safe database queries.

#### Acceptance Criteria

1. WHEN a user logs in, THE Laravel_Backend SHALL use Prisma_Client to query users by phone number
2. WHEN OTP is requested, THE Laravel_Backend SHALL use Prisma_Client to create OTP log records
3. WHEN password reset occurs, THE Laravel_Backend SHALL use Prisma_Client to update user password and mark OTP as verified
4. THE Laravel_Backend SHALL maintain the existing rate limiting behavior for login attempts
5. THE Laravel_Backend SHALL preserve all existing authentication response formats
6. THE Laravel_Backend SHALL continue to support Sanctum token generation after Prisma migration

### Requirement 4: Course Controller Migration

**User Story:** As a teacher, I want course management operations to use Prisma, so that I can continue managing courses with improved type safety.

#### Acceptance Criteria

1. WHEN listing courses, THE Laravel_Backend SHALL use Prisma_Client to query courses with category relationships
2. WHEN creating a course, THE Laravel_Backend SHALL use Prisma_Client to insert course records with teacher association
3. WHEN updating a course, THE Laravel_Backend SHALL use Prisma_Client to modify course records with validation
4. WHEN deleting a course, THE Laravel_Backend SHALL use Prisma_Client to perform soft delete by setting cDeleteAt timestamp
5. WHEN retrieving course details, THE Laravel_Backend SHALL use Prisma_Client to include related teacher and category data
6. THE Laravel_Backend SHALL maintain all existing course API response formats

### Requirement 5: User Controller Migration

**User Story:** As a teacher, I want student management operations to use Prisma, so that I can continue managing students with type-safe queries.

#### Acceptance Criteria

1. WHEN listing students, THE Laravel_Backend SHALL use Prisma_Client to query users with role filter
2. WHEN creating students, THE Laravel_Backend SHALL use Prisma_Client to insert single or multiple student records
3. WHEN updating a student, THE Laravel_Backend SHALL use Prisma_Client to modify user records with unique phone validation
4. WHEN deleting a student, THE Laravel_Backend SHALL use Prisma_Client to perform soft delete by setting uDeleted_at timestamp
5. THE Laravel_Backend SHALL maintain batch student creation capability with error handling
6. THE Laravel_Backend SHALL preserve all existing student API response formats

### Requirement 6: Blog Controller Migration

**User Story:** As a teacher, I want blog management operations to use Prisma, so that I can continue managing posts with improved database performance.

#### Acceptance Criteria

1. WHEN listing blogs, THE Laravel_Backend SHALL use Prisma_Client to query posts with author and category relationships
2. WHEN creating a blog, THE Laravel_Backend SHALL use Prisma_Client to insert post records with author association
3. WHEN updating a blog, THE Laravel_Backend SHALL use Prisma_Client to modify post records
4. WHEN deleting a blog, THE Laravel_Backend SHALL use Prisma_Client to perform soft delete by setting pDeleted_at timestamp
5. THE Laravel_Backend SHALL maintain all existing blog API response formats

### Requirement 7: Category Controller Migration

**User Story:** As a teacher, I want category operations to use Prisma, so that I can retrieve course categories with type safety.

#### Acceptance Criteria

1. WHEN listing categories, THE Laravel_Backend SHALL use Prisma_Client to query all category records
2. THE Laravel_Backend SHALL use Prisma_Client to include category relationships in course and post queries
3. THE Laravel_Backend SHALL maintain all existing category API response formats

### Requirement 8: Relationship Preservation

**User Story:** As a developer, I want to preserve all database relationships, so that related data queries continue to work correctly.

#### Acceptance Criteria

1. THE Prisma_Client SHALL define the relationship between User and Course (one-to-many via cTeacher)
2. THE Prisma_Client SHALL define the relationship between User and Post (one-to-many via pAuthor_id)
3. THE Prisma_Client SHALL define the relationship between User and OtpLog (one-to-many via userId)
4. THE Prisma_Client SHALL define the relationship between Category and Course (one-to-many via cCategory)
5. THE Prisma_Client SHALL define the relationship between Category and Post (one-to-many via pCategory)
6. WHEN querying with relationships, THE Laravel_Backend SHALL use Prisma's include or select syntax to load related data

### Requirement 9: Soft Delete Implementation

**User Story:** As a developer, I want to implement soft delete functionality with Prisma, so that deleted records remain in the database.

#### Acceptance Criteria

1. WHEN deleting a user, THE Laravel_Backend SHALL set uDeleted_at to the current timestamp instead of removing the record
2. WHEN deleting a course, THE Laravel_Backend SHALL set cDeleteAt to the current timestamp instead of removing the record
3. WHEN deleting a post, THE Laravel_Backend SHALL set pDeleted_at to the current timestamp instead of removing the record
4. WHEN querying records, THE Laravel_Backend SHALL filter out soft-deleted records by checking null deleted_at columns
5. THE Laravel_Backend SHALL provide helper functions or middleware to automatically exclude soft-deleted records

### Requirement 10: Query Performance Optimization

**User Story:** As a developer, I want to optimize database queries with Prisma, so that API response times improve.

#### Acceptance Criteria

1. WHEN loading related data, THE Laravel_Backend SHALL use Prisma's select to fetch only required fields
2. WHEN performing list queries, THE Laravel_Backend SHALL use Prisma's pagination capabilities for large datasets
3. THE Laravel_Backend SHALL use Prisma's connection pooling for efficient database connections
4. WHEN executing complex queries, THE Laravel_Backend SHALL leverage Prisma's query optimization
5. THE Laravel_Backend SHALL maintain or improve current API response times after migration

### Requirement 11: Error Handling and Validation

**User Story:** As a developer, I want to maintain existing error handling, so that API error responses remain consistent.

#### Acceptance Criteria

1. WHEN Prisma encounters a unique constraint violation, THE Laravel_Backend SHALL return appropriate 400 error responses
2. WHEN Prisma encounters a foreign key constraint violation, THE Laravel_Backend SHALL return appropriate 400 error responses
3. WHEN Prisma encounters a database connection error, THE Laravel_Backend SHALL return appropriate 500 error responses
4. THE Laravel_Backend SHALL preserve all existing validation rules and error messages
5. THE Laravel_Backend SHALL maintain the existing error response format with status, message, and optional errors fields

### Requirement 12: Sanctum Authentication Compatibility

**User Story:** As a developer, I want to ensure Sanctum authentication continues to work, so that existing authentication flows remain functional.

#### Acceptance Criteria

1. WHEN a user authenticates, THE Laravel_Backend SHALL continue to use Sanctum's token generation
2. WHEN a protected endpoint is accessed, THE Laravel_Backend SHALL continue to use Sanctum's auth:sanctum middleware
3. THE Laravel_Backend SHALL maintain the personal_access_tokens table for Sanctum token storage
4. THE Laravel_Backend SHALL preserve the User model's HasApiTokens trait functionality
5. WHEN a user logs out, THE Laravel_Backend SHALL continue to revoke Sanctum tokens correctly

### Requirement 13: API Endpoint Backward Compatibility

**User Story:** As a frontend developer, I want all 19 API endpoints to maintain their current behavior, so that the frontend application continues to work without changes.

#### Acceptance Criteria

1. THE Laravel_Backend SHALL maintain all authentication endpoints (/api/login, /api/logout, /api/users/accept, /api/users/reset-password)
2. THE Laravel_Backend SHALL maintain all course management endpoints (GET/POST/PUT/DELETE /api/teacher/courses)
3. THE Laravel_Backend SHALL maintain all student management endpoints (GET/POST/PUT/DELETE /api/teacher/student)
4. THE Laravel_Backend SHALL maintain all blog management endpoints (GET/POST/PUT/DELETE /api/teacher/blogs)
5. THE Laravel_Backend SHALL maintain the category endpoint (GET /api/teacher/categories)
6. THE Laravel_Backend SHALL preserve all request body formats and validation rules
7. THE Laravel_Backend SHALL preserve all response body formats and status codes
8. THE Laravel_Backend SHALL maintain role-based middleware functionality (role:teacher)

### Requirement 14: Type Safety and Developer Experience

**User Story:** As a developer, I want type-safe database operations, so that I can catch errors at compile time rather than runtime.

#### Acceptance Criteria

1. THE Prisma_Client SHALL provide TypeScript type definitions for all database models
2. WHEN writing queries, THE Laravel_Backend SHALL benefit from IDE autocomplete for model fields
3. WHEN writing queries, THE Laravel_Backend SHALL receive compile-time errors for invalid field names
4. THE Prisma_Client SHALL provide type-safe query results that match the database schema
5. THE Laravel_Backend SHALL use Prisma's generated types in controller method signatures

### Requirement 15: Migration and Rollback Strategy

**User Story:** As a developer, I want a safe migration strategy, so that I can rollback if issues occur.

#### Acceptance Criteria

1. THE Laravel_Backend SHALL maintain both Eloquent models and Prisma client during the migration phase
2. THE Laravel_Backend SHALL provide a feature flag or configuration to switch between Eloquent and Prisma
3. WHEN migration is complete, THE Laravel_Backend SHALL allow removal of Eloquent models
4. THE Laravel_Backend SHALL document the migration process with step-by-step instructions
5. THE Laravel_Backend SHALL provide rollback procedures in case of migration failures

### Requirement 16: Testing and Validation

**User Story:** As a developer, I want to validate that Prisma integration works correctly, so that I can ensure no functionality is broken.

#### Acceptance Criteria

1. THE Laravel_Backend SHALL pass all existing API tests after Prisma migration
2. WHEN testing authentication, THE Laravel_Backend SHALL successfully authenticate users with Prisma queries
3. WHEN testing CRUD operations, THE Laravel_Backend SHALL successfully create, read, update, and delete records
4. WHEN testing relationships, THE Laravel_Backend SHALL successfully load related data
5. WHEN testing soft deletes, THE Laravel_Backend SHALL correctly exclude deleted records from queries
6. THE Laravel_Backend SHALL maintain the same API response times or better after migration

### Requirement 17: Documentation and Code Comments

**User Story:** As a developer, I want comprehensive documentation, so that I can understand and maintain the Prisma integration.

#### Acceptance Criteria

1. THE Laravel_Backend SHALL include updated README with Prisma setup instructions
2. THE Laravel_Backend SHALL document all Prisma schema models with comments
3. THE Laravel_Backend SHALL document the migration process from Eloquent to Prisma
4. THE Laravel_Backend SHALL provide code examples for common Prisma query patterns
5. THE Laravel_Backend SHALL document any differences in behavior between Eloquent and Prisma

