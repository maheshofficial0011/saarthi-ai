# Saarthi AI Architecture

Saarthi AI is divided into three major layers:

1. Saarthi Interface
2. Manas Engine
3. Saarthi Agents

---

## Saarthi Interface

The user-facing app.

Includes:

- Dashboard
- Chat
- Tasks
- Memory
- Files
- Voice Mode
- Settings

---

## Manas Engine

The core intelligence layer.

Responsibilities:

- Understand user intent
- Manage context
- Retrieve memory
- Plan actions
- Select agents
- Decide when tools are needed
- Generate final responses

---

## Saarthi Agents

Specialized agents that handle specific areas.

Initial agents:

- Study Agent
- Coding Agent
- Task Agent
- File Agent
- Web Agent
- Voice Agent
- Automation Agent

---

## Basic Request Flow

```txt
User message
→ Saarthi Interface
→ Manas Engine
→ Memory retrieval
→ Agent selection
→ Tool execution if needed
→ Final response
→ Save conversation and useful memory
