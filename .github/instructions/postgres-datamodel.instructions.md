# PostgreSQL Data Model - Pulse Analytics Platform

## Overview

The Pulse Analytics platform uses a PostgreSQL database as its primary transactional store, implementing a sophisticated multi-tenant architecture with comprehensive security through Row-Level Security (RLS). This document provides a complete reference for the database schema, relationships, and business logic.

## Database Configuration

- **Engine**: PostgreSQL 15
- **Instance**: `pulse-dev-db` (Cloud SQL)
- **Location**: europe-west1
- **Private IP**: 10.107.0.3
- **Public IP**: 34.79.117.153 (development access)
- **Database Name**: `pulse_forms`

## Security Model

### Multi-tenant Architecture
The database implements strict tenant isolation using PostgreSQL's Row-Level Security (RLS):

- **Tenant Identification**: `current_setting('tenant.id')::uuid`
- **RLS Enforcement**: `FORCE ROW LEVEL SECURITY` on all tenant-scoped tables
- **Isolation Policies**: Automatic filtering by `org_id` for all tenant data
- **Insert Policies**: Automatic enforcement of tenant scope on data insertion

### Authentication
- **Admin User**: `postgres` (superuser access)
- **Application User**: `pulse-prime` (application-level access)
- **CDC User**: `datastream_user` (replication permissions)

## Core Data Model

### Entity Relationship Overview

```
Organizations (1) ────┐
                      │
                      ├── Users (N)
                      │     │
                      │     └── Responses (N)
                      │           │
                      └── Assessment Runs (N)
                                │
                                └── Responses (N)
                                      │
                                      └── Questions (N)
                                            │
                                            └── Questions Metadata (N)
                                            
                                            
Assessments (1) ── Questions (N) ── Questions Metadata (1)
                      │
                      └── Question Translations (N)

Roles (N) ←── Role Permissions (N) ──→ Permissions (N)
     │
     └── User Roles (N) ──→ Users (N)
```

## Table Specifications

### 1. Organizations
**Purpose**: Tenant master data with hierarchical support

```sql
CREATE TABLE organizations (
    org_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT,
    founding_date DATE,
    country TEXT,
    website TEXT,
    primary_language TEXT,
    primary_location TEXT,
    parent_org_id UUID REFERENCES organizations(org_id), -- Self-referential hierarchy
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
```

**Security**: RLS enabled with `org_isolation_policy` and `org_insert_policy`

**Key Features**:
- Hierarchical organization structure via `parent_org_id`
- Tenant isolation enforced at row level
- Audit trail with created/updated timestamps

### 2. Users
**Purpose**: User profiles with organizational hierarchy and lifecycle management

```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    org_id UUID REFERENCES organizations(org_id),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    department TEXT,
    manager_id UUID REFERENCES users(user_id), -- Self-referential hierarchy
    job_description TEXT,
    job_level TEXT,
    timezone TEXT,
    language TEXT,
    enrollment_date DATE, -- Platform enrollment
    start_date DATE,      -- Organization start date
    end_date DATE,        -- Organization end date (optional)
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
```

**Security**: RLS with `user_isolation_policy` and `user_insert_policy`

**Key Features**:
- Self-referential management hierarchy
- Complete lifecycle tracking (enrollment, start, end dates)
- Admin role flag for authorization
- Tenant-scoped via `org_id`

### 3. Assessments
**Purpose**: Assessment template definitions with versioning

```sql
CREATE TABLE assessments (
    assessment_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    version INT NOT NULL,
    frequency_per_year NUMERIC,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
```

**Key Features**:
- Version control for assessment changes
- Frequency planning for recurring assessments
- Active/inactive lifecycle management

### 4. Assessment Runs
**Purpose**: Individual assessment execution instances

```sql
CREATE TABLE assessment_runs (
    run_id UUID PRIMARY KEY,
    org_id UUID REFERENCES organizations(org_id),
    assessment_id UUID REFERENCES assessments(assessment_id),
    run_number INT,
    version INT,
    language TEXT DEFAULT 'en',
    status TEXT DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed'
    started_at TIMESTAMP DEFAULT now(),
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
```

**Security**: RLS with `run_isolation_policy` and `run_insert_policy`

**Key Features**:
- Multi-language support
- Status workflow tracking
- Run numbering for historical tracking
- Tenant isolation via `org_id`

### 5. Questions
**Purpose**: Individual question definitions with versioning and localization

```sql
CREATE TABLE questions (
    question_id UUID PRIMARY KEY,
    question_key TEXT NOT NULL,           -- e.g., 'persi_001'
    assessment_id UUID REFERENCES assessments(assessment_id),
    version INT NOT NULL,
    text TEXT NOT NULL,
    locale TEXT DEFAULT 'en',
    question_type TEXT DEFAULT 'text',    -- 'likert', 'multiple_choice', 'text'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
```

**Key Features**:
- Question key for business logic reference
- Multi-language support via locale
- Question type categorization
- Version control alignment with assessments

### 6. Questions Metadata
**Purpose**: Psychometric metadata for scoring and analysis

```sql
CREATE TABLE questions_metadata (
    metadata_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES questions(question_id),
    question_key TEXT NOT NULL,           -- e.g., 'persi_001'
    version INTEGER NOT NULL DEFAULT 1,
    domain TEXT NOT NULL,                 -- e.g., 'Honesty-Humility'
    subdomain TEXT,                       -- e.g., 'Sincerity' (nullable)
    reverse_keyed BOOLEAN DEFAULT FALSE,  -- Scoring direction flag
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    
    UNIQUE(question_id, version)          -- SCD Type 2 support
);
```

**Indexes**:
- `idx_questions_metadata_question_key` on question_key
- `idx_questions_metadata_question_id` on question_id  
- `idx_questions_metadata_domain` on domain
- `idx_questions_metadata_reverse_keyed` on reverse_keyed (filtered)

**Key Features**:
- Psychometric domain/subdomain classification
- Reverse key scoring support for statistical analysis
- SCD Type 2 versioning for metadata changes
- Performance-optimized indexing

### 7. Question Translations
**Purpose**: Multi-language question text support

```sql
CREATE TABLE question_translations (
    translation_id UUID PRIMARY KEY,
    question_id UUID REFERENCES questions(question_id),
    locale TEXT NOT NULL,                 -- e.g., 'es', 'fr', 'de'
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    
    UNIQUE(question_id, locale)
);
```

**Key Features**:
- One-to-many relationship with questions
- Locale-based text variants
- Unique constraint prevents duplicate translations

### 8. Responses
**Purpose**: Individual user responses with traceability

```sql
CREATE TABLE responses (
    response_id UUID PRIMARY KEY,
    landing_id VARCHAR(255),              -- External system reference
    run_id UUID REFERENCES assessment_runs(run_id),
    user_id UUID REFERENCES users(user_id),
    question_key TEXT NOT NULL,
    response_value INT,
    submitted_at TIMESTAMP DEFAULT now()
);
```

**Security**: RLS with `response_isolation_policy` and `response_insert_policy` (tenant scope via assessment runs)

**Key Features**:
- External system traceability via `landing_id`
- Tenant isolation through run hierarchy
- Question key reference for flexible question management
- Timestamp for submission tracking

## Authorization Model

### 9. Roles
**Purpose**: System role definitions

```sql
CREATE TABLE roles (
    role_id UUID PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,            -- e.g., 'admin', 'manager', 'employee'
    description TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
```

### 10. Permissions
**Purpose**: Granular permission definitions

```sql
CREATE TABLE permissions (
    permission_id UUID PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,            -- e.g., 'view_reports', 'manage_users'
    description TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);
```

### 11. User Roles
**Purpose**: Many-to-many user-role assignments

```sql
CREATE TABLE user_roles (
    user_role_id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(user_id),
    role_id UUID REFERENCES roles(role_id),
    assigned_at TIMESTAMP DEFAULT now(),
    assigned_by UUID REFERENCES users(user_id),
    
    UNIQUE(user_id, role_id)
);
```

### 12. Role Permissions
**Purpose**: Many-to-many role-permission assignments

```sql
CREATE TABLE role_permissions (
    role_permission_id UUID PRIMARY KEY,
    role_id UUID REFERENCES roles(role_id),
    permission_id UUID REFERENCES permissions(permission_id),
    granted_at TIMESTAMP DEFAULT now(),
    granted_by UUID REFERENCES users(user_id),
    
    UNIQUE(role_id, permission_id)
);
```

**Key Features**:
- Complete RBAC (Role-Based Access Control) implementation
- Audit trail for role and permission assignments
- Self-referential assignment tracking

## Data Lifecycle & CDC Configuration

### Change Data Capture Setup
The database is configured for real-time CDC using PostgreSQL logical replication:

**Publications**:
```sql
CREATE PUBLICATION datastream_publication FOR TABLE public.questions_metadata;
-- Additional tables can be added as needed
```

**Replication Slots**:
```sql
SELECT pg_create_logical_replication_slot('datastream_slot', 'pgoutput');
```

**CDC User Permissions**:
- `datastream_user`: Configured with replication privileges
- Logical replication enabled at database level
- WAL level set to 'logical'

### SCD Type 2 Support
Several tables implement Slowly Changing Dimension Type 2 patterns:

- **questions_metadata**: Version-controlled metadata changes
- **users**: Historical user profile changes (via dbt SCD transformation)
- **assessments**: Version-controlled assessment definitions

## Business Logic Implementation

### Reverse Key Scoring
Questions with `reverse_keyed = TRUE` require score transformation:
- **Standard Scale**: 1-6 Likert scale
- **Transformation**: `score = 7 - original_score`
- **Implementation**: Handled in dbt transformation layer with custom macro

### Tenant Isolation
All tenant-scoped tables implement automatic filtering:
```sql
-- Example RLS policy
CREATE POLICY tenant_isolation_policy ON table_name
USING (org_id = current_setting('tenant.id')::uuid);
```

### Data Integrity
- **Foreign Key Constraints**: Comprehensive referential integrity
- **Unique Constraints**: Prevent data duplication
- **Check Constraints**: Business rule enforcement at database level
- **Index Optimization**: Performance-tuned for common query patterns

## Integration Points

### Datastream Integration
- **Source Configuration**: PostgreSQL logical replication
- **Target**: BigQuery raw dataset with JSON preservation
- **Stream Status**: Operational (public IP configuration)
- **Tables Replicated**: `questions_metadata` (expandable to full schema)

### dbt Integration
- **Source Configuration**: BigQuery raw dataset
- **Staging Models**: Type conversion and cleaning
- **Business Logic**: Reverse key transformation, SCD implementation
- **Testing**: Comprehensive data quality validation

### Application Integration
- **Connection**: `pulse-prime` user via Cloud SQL Proxy
- **Tenant Context**: Set via `current_setting('tenant.id')`
- **Security**: RLS automatically enforces data isolation
- **Performance**: Optimized indexes for common application queries

## Operational Considerations

### Performance Optimization
- **Indexes**: Created on commonly queried columns
- **Partitioning**: Consider for large fact tables (responses)
- **Connection Pooling**: Recommended for high-concurrency applications
- **Query Optimization**: RLS policies designed for efficient execution

### Backup & Recovery
- **Automated Backups**: Cloud SQL automated backup enabled
- **Point-in-time Recovery**: Available through Cloud SQL
- **Cross-region Replication**: Consider for production high availability

### Monitoring
- **Performance Insights**: Cloud SQL performance monitoring
- **Query Analysis**: Slow query log analysis
- **Replication Monitoring**: CDC lag and performance tracking
- **Connection Monitoring**: Connection pool and usage tracking

## Development & Testing

### Sample Data
The database includes comprehensive sample data for all assessment types:
- **PERSI**: Personality assessment with 300 questions
- **EMOCI**: Emotional intelligence with domain/subdomain structure
- **ORGCI**: Organizational culture assessment
- **SATI**: Satisfaction measurement
- **MINDT**: Mindset evaluation
- **PSYSI**: Psychological safety assessment

### Testing Framework
- **dbt Tests**: 23+ automated data quality tests
- **Integration Tests**: End-to-end pipeline validation
- **Security Tests**: RLS policy validation
- **Performance Tests**: Query execution time benchmarks

---

**Document Version**: 1.0  
**Last Updated**: September 2025  
**Database Version**: PostgreSQL 15  
**Schema Version**: Production-ready with full RLS implementation