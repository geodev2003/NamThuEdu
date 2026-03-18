# Requirements Document: Test System APIs

## Introduction

The Test System APIs enable comprehensive exam and assessment management for the Nam Thu Edu platform. This system allows teachers to create exams with multiple-choice questions, assign tests to classes or individual students with configurable deadlines and attempt limits, and grade student submissions with feedback. Students can view their assigned tests, take exams within time limits, submit answers, and view their graded results with teacher feedback.

The system supports multiple exam types (VSTEP, IELTS, TOEIC, GENERAL) across four skills (listening, reading, writing, speaking), with automatic grading for objective questions and manual grading capabilities for subjective assessments.

## Glossary

- **System**: The Test System APIs backend service
- **Teacher**: A user with role='teacher' who creates and manages exams
- **Student**: A user with role='student' who takes exams and views results
- **Exam**: A test containing multiple questions with associated metadata
- **Question**: An individual test item with content, points, and multiple answers
- **Answer**: A possible response to a question, marked as correct or incorrect
- **Assignment**: A link between an exam and target recipients (class or students)
- **Submission**: A student's attempt at completing an assigned exam
- **Class**: A group of students managed by a teacher
- **Enrollment**: The relationship between a student and a class
- **Grading**: The process of evaluating a submission and assigning scores

## Requirements

### Requirement 1: Class Management

**User Story:** As a teacher, I want to manage classes and enroll students, so that I can organize my students into groups for test assignments.

#### Acceptance Criteria

1. WHEN a teacher requests their class list, THE System SHALL return all classes where the teacher is the owner
2. WHEN a teacher creates a class, THE System SHALL validate the class name is non-empty and maximum 100 characters
3. WHEN a teacher creates a class, THE System SHALL set the class status to either 'active' or 'inactive'
4. WHEN a teacher retrieves class details, THE System SHALL include the list of enrolled students
5. WHEN a teacher updates a class, THE System SHALL validate all modified fields and save changes
6. WHEN a teacher deletes a class, THE System SHALL perform a soft delete without removing the record
7. WHEN a teacher enrolls students in a class, THE System SHALL prevent duplicate enrollments
8. WHEN a teacher enrolls students in a class, THE System SHALL support both single and bulk enrollment operations

### Requirement 2: Exam Creation and Management

**User Story:** As a teacher, I want to create and manage exams with questions, so that I can prepare assessments for my students.

#### Acceptance Criteria

1. WHEN a teacher creates an exam, THE System SHALL require title, type, skill, and duration fields
2. WHEN a teacher creates an exam, THE System SHALL validate the exam type is one of: VSTEP, IELTS, TOEIC, or GENERAL
3. WHEN a teacher creates an exam, THE System SHALL validate the skill is one of: listening, reading, writing, or speaking
4. WHEN a teacher creates an exam, THE System SHALL validate the duration is a positive integer representing minutes
5. WHEN a teacher creates an exam, THE System SHALL associate the exam with the authenticated teacher
6. WHEN a teacher retrieves their exam list, THE System SHALL return only exams they created
7. WHEN a teacher retrieves exam details, THE System SHALL include all questions with their answers
8. WHEN a teacher updates an exam, THE System SHALL validate all modified fields before saving
9. WHEN a teacher deletes an exam, THE System SHALL perform a soft delete without removing the record

### Requirement 3: Question and Answer Management

**User Story:** As a teacher, I want to add questions with multiple answers to my exams, so that I can create comprehensive assessments.

#### Acceptance Criteria

1. WHEN a teacher adds questions to an exam, THE System SHALL validate each question has content and point value
2. WHEN a teacher adds questions to an exam, THE System SHALL validate the point value is a positive integer
3. WHEN a teacher adds questions to an exam, THE System SHALL require at least one answer per question
4. WHEN a teacher adds questions to an exam, THE System SHALL validate at least one answer is marked as correct
5. WHEN a teacher adds questions to an exam, THE System SHALL support bulk question creation in a single request
6. WHEN a teacher adds questions to an exam, THE System SHALL use database transactions to ensure all-or-nothing insertion
7. WHEN a teacher updates a question, THE System SHALL validate the question belongs to their exam
8. WHEN a teacher deletes a question, THE System SHALL remove the question and all associated answers
9. WHEN a teacher adds questions with media, THE System SHALL accept optional media URL and transcript fields

### Requirement 4: Test Assignment

**User Story:** As a teacher, I want to assign exams to classes or individual students with deadlines and attempt limits, so that I can control when and how students take tests.

#### Acceptance Criteria

1. WHEN a teacher assigns an exam, THE System SHALL require target type (class or student) and target ID
2. WHEN a teacher assigns an exam to a class, THE System SHALL validate the class exists
3. WHEN a teacher assigns an exam to a student, THE System SHALL validate the student exists and has role='student'
4. WHEN a teacher assigns an exam, THE System SHALL validate the exam belongs to the teacher
5. WHEN a teacher sets a deadline, THE System SHALL validate the deadline is a future datetime
6. WHEN a teacher sets max attempts, THE System SHALL validate it is a positive integer with default value of 1
7. WHEN a teacher creates an assignment, THE System SHALL allow optional public/private visibility setting
8. WHEN a teacher views assignments, THE System SHALL support filtering by exam, class, or student
9. WHEN a teacher deletes an assignment, THE System SHALL remove the assignment record

### Requirement 5: Student Test Access

**User Story:** As a student, I want to view my assigned tests and their details, so that I know which exams I need to complete.

#### Acceptance Criteria

1. WHEN a student requests their test list, THE System SHALL return all assignments where the student is a target
2. WHEN a student is in a class, THE System SHALL include all class-level assignments in their test list
3. WHEN a student is individually assigned, THE System SHALL include individual assignments in their test list
4. WHEN a student views test details, THE System SHALL include exam title, type, skill, and duration
5. WHEN a student views test details, THE System SHALL include deadline and maximum attempts information
6. WHEN a student views test details, THE System SHALL include the number of attempts already used
7. WHEN a student views test details, THE System SHALL exclude correct answer information from questions

### Requirement 6: Test Taking Process

**User Story:** As a student, I want to start a test, answer questions, and submit my completed exam, so that I can complete my assignments.

#### Acceptance Criteria

1. WHEN a student starts a test, THE System SHALL validate the student is eligible for the assignment
2. WHEN a student starts a test, THE System SHALL validate the deadline has not passed
3. WHEN a student starts a test, THE System SHALL validate the student has not exceeded maximum attempts
4. WHEN a student starts a test, THE System SHALL create a submission record with status 'in_progress'
5. WHEN a student starts a test, THE System SHALL record the start time as the current datetime
6. WHEN a student starts a test, THE System SHALL return all questions without revealing correct answers
7. WHEN a student submits