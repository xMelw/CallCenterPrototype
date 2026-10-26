# CallCenterPrototype

**An Angular front-end prototype developed during my internship at Altice.**

> **Project status:** Prototype — for demonstration purposes only.

This project was developed during my internship at Altice as an opportunity to explore the interface of a contact center and unified communications solution. It focuses on the front-end experience, bringing together customer interactions, conversation management and contextual information in a unified workspace.

**This repository contains a prototype that is not yet fully complete, rather than a production-ready application or an official Altice product.** Some features may be unfinished or require further refinement. Its purpose is to demonstrate interface concepts, front-end implementation and interaction design.

## Overview

The application presents a contact center workspace designed to help agents navigate customer conversations and access relevant information from a single interface.

### Key features

- **Customer conversations** — a chat interface for viewing and managing customer interactions.
- **Conversation lists** — organized views of customer conversations and team chats.
- **Customer information** — a contextual panel displaying information related to the selected customer.
- **Interaction history** — a view of relevant interaction details and timelines.
- **Priorities and categories** — visual indicators to help distinguish and organize conversations.
- **Customer mood indicators** — contextual sentiment information within the interface.
- **Smart suggestions** — a dedicated area for contextual suggestions and assistance.
- **Component-based interface** — a modular Angular structure separating the main areas of the workspace.

The prototype includes sample data stored locally in `src/assets/db.json`. It is intended to demonstrate the interface and its interactions rather than connect to a live contact center service.

## Tech stack

| Technology | Purpose |
|---|---|
| Angular 21 | Front-end framework |
| TypeScript | Application logic and type safety |
| Tailwind CSS | Styling and layout |
| ApexCharts | Data visualization |
| RxJS | Reactive programming |
| JSON | Local sample data |

## Getting started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) — use a version compatible with Angular 21.
- npm — included with Node.js.
- Git — to clone the repository.

Check your installed versions:

```bash
node --version
npm --version
```

### 1. Clone the repository

```bash
git clone https://github.com/xMelw/CallCenterPrototype.git
cd CallCenterPrototype
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm start
```

Once the server has started, open:

**http://localhost:4200/**

The development server automatically reloads the application when supported source files change.

To stop the server, press `Ctrl + C` in the terminal.

## Available commands

| Command | Description |
|---|---|
| `npm start` | Starts the local development server |
| `npm run build` | Builds the application |
| `npm run watch` | Rebuilds the application when files change |
| `npm test` | Runs the unit tests |

## Project structure

```text
CallCenterPrototype/
├── public/
├── src/
│   ├── app/
│   │   └── ...          # Angular application and components
│   ├── assets/
│   │   └── db.json      # Local sample data
│   ├── index.html
│   └── main.ts
├── angular.json
├── package.json
└── README.md
```

*Note: This is a simplified overview of the project structure.*

## Scope and limitations

This repository represents a front-end prototype created during an internship. It should not be interpreted as a complete contact center platform.

- Data is provided through a local JSON file.
- The application is intended for demonstration and exploration of the user interface.
- A production deployment would require additional integration, validation, security and testing.
- The project does not represent the complete infrastructure or functionality of an operational contact center solution.

## Acknowledgement

Developed as part of my internship at **Altice**, contributing to my experience in Angular development, interface implementation and the design of customer interaction workflows.

---

<p align="center">
  <sub>Front-end prototype · Angular · Contact Center & Unified Communications</sub>
</p>
