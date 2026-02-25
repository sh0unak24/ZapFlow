# Zap Flow

Zap Flow is a Zapier-style workflow automation platform that allows users to create event-driven automations by connecting triggers to one or more actions using a visual flow builder.

The system is built using a **microservices architecture** and an **event-driven design powered by Kafka**, enabling scalable and asynchronous workflow execution.

---

## Features

- Visual no-code workflow builder using React Flow
- Webhook-based triggers
- Support for multi-step action workflows
- Asynchronous execution using Kafka
- Five independently deployable services
- Type-safe full-stack development with TypeScript
- Schema validation using Zod
- Persistent workflow storage using PostgreSQL and Prisma

---

## Architecture Overview

Zap Flow consists of the following services:

### 1. Frontend
- Built with **Next.js and React**
- Provides a visual workflow builder for configuring triggers and actions

### 2. Primary Backend
- Manages authentication, workflow creation, and validation
- Persists Zaps, Triggers, and Actions using **Prisma + PostgreSQL**
- Uses transactional writes to ensure consistency

### 3. Hooks Service
- Exposes webhook endpoints to receive external events
- Publishes trigger events to Kafka topics

### 4. Processor Service
- Consumes Kafka events from trigger topics
- Resolves workflow logic and determines execution order
- Enqueues executable actions for workers

### 5. Worker Service
- Executes actions asynchronously (Email, Slack, Database actions)
- Isolated execution to prevent blocking failures

---

## Event Flow

```text
Webhook / Event
   ↓
Hooks Service
   ↓
Kafka Topic
   ↓
Processor Service
   ↓
Kafka Topic
   ↓
Worker Service
