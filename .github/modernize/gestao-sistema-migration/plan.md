# Modernization Plan: gestao-sistema

## Project Overview

**Project Name:** gestao-sistema  
**Language:** Java  
**Current Runtime:** Java 21, Spring Boot 3.3.3  
**Target Runtime:** Java 25, Spring Boot 4.x  
**Current Architecture:** Spring Boot REST API with JWT authentication and PostgreSQL database

## Executive Summary

This modernization plan outlines the migration of the gestao-sistema Java application to Azure, with focus on:

1. **Runtime Modernization**: Upgrading Java runtime to the latest stable version (Java 25) and Spring Boot to version 4.x for enhanced performance and security
2. **Credential Security**: Migrating hardcoded plaintext credentials to Azure Key Vault for secure secrets management
3. **Database Security**: Securing PostgreSQL database access using Azure Managed Identity for passwordless authentication
4. **Cloud Readiness**: Preparing the application for deployment to Azure container services

## Migration Scope

### Current System Analysis

- **Application Type**: Spring Boot REST API with JWT-based authentication
- **Database**: PostgreSQL
- **Key Components**:
  - Authentication: JWT-based security with Spring Security
  - API Layer: RESTful endpoints for Product and Authentication operations
  - ORM Layer: Spring Data JPA with Hibernate
  - Frontend: HTML/CSS/JavaScript static web application

### Issues Identified

1. **Plaintext Credentials**: Default or hardcoded credentials found in configuration files
2. **PostgreSQL Password-Based Authentication**: Database connections using plaintext passwords
3. **Outdated Java Runtime**: Java 21 is not the latest LTS version; Java 25 is the latest stable release
4. **Missing Security Best Practices**: No centralized secrets management

## Modernization Tasks

The modernization will be executed in the following phases:

### Phase 1: Runtime Upgrade (Foundation)
- **Task 1.1**: Java/Spring Boot Runtime Upgrade
  - Upgrade Java from 21 to 25
  - Upgrade Spring Boot from 3.3.3 to 4.x
  - Upgrade Spring Framework from 6.x to 7.x
  - Execute Jakarta EE namespace migration (javax.* → jakarta.*)

### Phase 2: Security Hardening (Application Layer)
- **Task 2.1**: Migrate Plaintext Credentials to Azure Key Vault
  - Remove hardcoded credentials from configuration
  - Implement Azure Key Vault client for secrets retrieval
  - Update Spring Boot configuration properties
  
- **Task 2.2**: PostgreSQL Managed Identity Authentication
  - Update PostgreSQL connection configuration for managed identity
  - Remove password-based authentication
  - Update Spring Cloud Azure dependencies for passwordless PostgreSQL access

### Phase 3: Cloud Deployment (Infrastructure)
- **Task 3.1**: Containerization
  - Optimize Dockerfile for production
  - Create container image
  
- **Task 3.2**: Deploy to Azure
  - Configure deployment to Azure Container Apps or App Service
  - Setup managed identity and RBAC
  - Configure Key Vault access policies

## Detailed Task Breakdown

See `/.metadata/tasks.json` for the complete task breakdown with:
- Task identifiers and sequences
- Skill mappings for automated execution
- Prerequisites and dependencies
- Success criteria and acceptance tests

## Timeline & Dependencies

- **Critical Path**: Task 1.1 (Runtime Upgrade) → Task 2.1 & 2.2 (Security) → Task 3.x (Deployment)
- **Estimated Duration**: 
  - Runtime Upgrade: 2-3 days
  - Security Hardening: 2-3 days
  - Cloud Deployment: 1-2 days
  
## Success Criteria

1. ✅ Application builds successfully with Java 25 and Spring Boot 4.x
2. ✅ All unit and integration tests pass
3. ✅ Credentials are stored in Azure Key Vault (not in configuration files)
4. ✅ PostgreSQL connections use managed identity authentication
5. ✅ Application deploys to Azure Container Apps successfully
6. ✅ All API endpoints function correctly in production
7. ✅ No security warnings in dependency scanning

## Known Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| Spring Boot 3.x to 4.x breaking changes | Review Spring Boot migration guide; test thoroughly before release |
| Jakarta EE namespace migration compatibility | Verify all third-party libraries support Jakarta EE |
| Managed Identity configuration issues | Test in staging environment; use Service Connector for setup |
| Performance regression | Run performance tests after each phase; compare with baseline |

## Dependencies & Prerequisites

- Java 25 JDK installed
- Maven 3.9+ configured
- Azure CLI or Azure DevOps for deployment
- Azure Subscription with appropriate permissions
- PostgreSQL database accessible for testing

## Support & Escalation

For issues during migration:
1. Review Phase-specific documentation in tasks.json
2. Check Azure documentation for service-specific issues
3. Consult Spring Boot 4.x migration guide for framework changes

---

**Plan Version**: 1.0  
**Last Updated**: 2026-07-07  
**Status**: Ready for execution
