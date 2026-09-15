# Product Development Phases

## Phase 0 — Define the Software Contract

**Target:** September, Week 1  
**Goal:** Turn the product concept into decisions the team can build against.

### Deliverables

#### 1. Define primary users

- **Checklist user:** Operates physical controls only.
- **Caregiver:** Sets tasks and reset schedules, and views progress.
- **Admin/developer:** Pairs devices and diagnoses issues.

#### 2. Define the first supported flow

1. A caregiver assigns “Take medication” to a device.
2. The device shows the task as pending.
3. The user activates its physical control.
4. The device provides immediate visible feedback.
5. Completion is stored locally and synced to the backend.
6. The caregiver sees the task as completed.

#### 3. Freeze the minimum viable task model

- Task name
- Icon or label
- Device-control assignment
- Enabled/disabled state
- Completion state
- Reset cadence: 6, 12, or 24 hours
- Completion timestamp
- Optional caregiver note

#### 4. Agree on non-functional requirements

- The device works when Wi-Fi fails.
- Physical feedback occurs in under 200 ms.
- A reboot cannot silently erase a completion event.
- The device recovers automatically after power or network loss.
- The physical device requires no user login.

**Checkpoint:** A one-page software requirements document, device/app interaction diagram, and agreed technology stack. Document hardware pin/control assumptions before implementation begins.

---

## Phase 1 — Technical Proof of Concept

**Target:** September, Weeks 2–3  
**Goal:** Prove the riskiest technical pieces with minimal interfaces.

### Workstreams

#### Repository and development standards

- Branching and pull-request expectations
- Issue board for software tasks
- Environment-variable and secret-management approach
- Firmware flashing and build instructions
- Basic CI: firmware build plus app/backend linting and tests

#### Firmware prototype

- Read at least one physical control.
- Drive one feedback component: LED, display indicator, vibration, or light.
- Store state in non-volatile memory.
- Implement a debounced input handler.
- Simulate a reset cycle.

#### Backend prototype

- Create a device record.
- Create and retrieve task configurations.
- Accept completion-event logs.
- Return the current configuration for a device.

#### App prototype

- Create and edit a task.
- Select reset frequency.
- Display device completion status.

#### Integration

- Connect one control to one task across the full happy path.

**Checkpoint:** Demonstrate changing one task in the app, syncing it to one prototype device, pressing the control, and seeing the completion in the app.

---

## Phase 2 — Build the Core Product Loop

**Target:** October, Weeks 1–2  
**Goal:** Expand the proof of concept into a reliable single-device MVP.

### Firmware

- Support all intended physical control types through a common `TaskControl` interface.
- Map each control to a stable task ID, never an array position or display label.
- Maintain local task state, configuration version, and unsynced events.
- Retry failed syncs with backoff.
- Report device ID, firmware version, battery/power state when available, and last-sync time.
- Implement configurable 6-, 12-, and 24-hour reset behavior.
- Define whether resets are rolling intervals or fixed clock times; fixed local times are generally clearer for caregivers.
- Validate incoming configuration before safely applying an update.

### Backend

- Device registration and pairing
- Task configuration CRUD
- Reset-schedule storage
- Immutable completion-event logging
- Current device/task-status endpoint
- Input validation and useful error responses

### App

- Device setup screen
- Task editing screen
- Current-day checklist status
- Last-sync/offline indicator
- Simple completion history

### Hardware-team validation

- Confirm each selected button, toggle, and dial has a defined software interpretation.
- Specify behavior for repeated presses, toggle state after restart, and task reassignment after completion.

**Checkpoint:** All planned controls work on one prototype; a caregiver can configure it without developer intervention; and device state survives a power cycle.

---

## Phase 3 — Reliability, Caregiver Insight, and Integration

**Target:** October, Weeks 3–4  
**Goal:** Turn the classroom prototype into a credible assistive device.

### Offline-first behavior

- Update completion locally without waiting for a network response.
- Preserve the event queue through power loss.
- Define and test sync-conflict rules.
- Continue reset cycles while offline.
- Provide a simple offline/error indication that does not confuse the checklist user.

### History and caregiver features

- Daily completion history by task
- Visibility into missed or uncompleted tasks after the reset boundary
- One basic alert rule, such as “medication not completed by 10:00 AM”
- Start with in-app alerts or email; defer SMS and push notifications until the core is complete.

### Pairing and security

- Use a physical pairing code or QR code during setup.
- Give every device a unique credential.
- Do not expose unauthenticated endpoints that accept completions for arbitrary device IDs.
- Keep personally identifying and medical information out of logs unless essential.

### Observability

- Device health check or heartbeat
- Server-side error logging
- Firmware diagnostic mode for the team
- Support view for last sync, firmware version, and connectivity state

**Checkpoint:** Disconnect Wi-Fi, complete tasks, reboot the device, restore Wi-Fi, and verify every event appears exactly once in caregiver history.

---

## Phase 4 — User Testing and Refinement

**Target:** November, Weeks 1–2  
**Goal:** Validate usability for users with cognitive or memory impairments, where usability is a core feature rather than final polish.

### Test plan

- Can the user identify each control’s meaning?
- Can they distinguish pending from completed?
- Do they understand what happens after a reset?
- Can a caregiver set up the device without help?
- What happens when a user changes their mind or presses a control twice?

### Test execution and evidence

- Run supervised tests with mockups or prototypes before finalizing firmware behavior.
- Record task-completion time, wrong-control activations, caregiver assistance, feedback/reset confusion, and technical failures.

### Prioritization

1. Safety, data loss, and ambiguous feedback
2. Configuration friction and reliability
3. Visual refinement and extra features

**Checkpoint:** A documented usability-test report, a ranked fix list, and a tested release candidate.

---

## Phase 5 — Final Hardening and Presentation

**Target:** November, Weeks 3–4  
**Goal:** Prepare a dependable, transparent, demo-ready release.

### Demo-ready deployment

- Reproducible firmware build and flash process
- Hosted or locally deployable backend
- Seed/demo device and caregiver account setup flow
- Reset and recovery instructions
- Honestly documented known limitations

### Failure-scenario testing

- Wi-Fi loss
- Router change
- Power interruption
- Backend unavailability
- Repeated button press
- Invalid configuration
- Time/reset boundary
- Device reboot during a pending sync

### Final documentation

- System architecture
- API specification
- Database schema
- Firmware state machine
- Hardware pin/control mapping
- Setup and troubleshooting guide
- Privacy and security decisions
- Future-scale plan

**Checkpoint:** A reproducible end-to-end demo, documented recovery procedures, and final technical documentation ready for handoff or presentation.
