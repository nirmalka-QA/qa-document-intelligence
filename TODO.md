# TODO - Enterprise DB schema update

## Step 1
- [ ] Update `backend/services/database_service.py` to recreate `database/qa.db` on startup (dev migration).
- [ ] Create enterprise-like tables in SQLite: `users`, `documents`, `requirements`, `test_cases`, `test_steps`, `rtm`, `risks`, `gaps`, `audit_logs`, `activity_logs`.

## Step 2
- [ ] Update `DatabaseService` insert methods to match the new schema:
  - [ ] `save_document`
  - [ ] `save_requirements` (assign `REQ-xxx` by index)
  - [ ] `save_testcases` (create `test_cases` + `test_steps`)
  - [ ] `save_risks`, `save_gaps`

## Step 3
- [x] Update `backend/api/rtm_routes.py` to persist RTM mappings into `rtm` table.


## Step 4
- [ ] Smoke test: run backend, upload/analyze or analyze-text, verify no DB errors, verify RTM endpoint returns data.

