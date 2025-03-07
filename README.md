# Node.js Server-Side Search Engine for Text Files

A server-side search engine built with **NestJS** and **Express**, allowing users to search for text files by content. The project includes a **backend API** and a **frontend client**.

## Features
- Search for files based on content
- Real-time search progress updates via SSE
- File indexing using Redis
- Asynchronous file scanning with RabbitMQ
- Dockerized setup for easy deployment

## Tech Stack
- **Backend**: NestJS, Redis, RabbitMQ
- **Frontend**: Express (serving a simple client UI)
- **Database**: Redis (for indexing files)
- **Message Queue**: RabbitMQ (for async processing)

## Installation & Setup

### Run the Application with Docker
```sh
docker-compose up --build
