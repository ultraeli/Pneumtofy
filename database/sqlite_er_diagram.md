# Pneumtofy SQLite ER Diagram

Source database: `backend/instance/pneumtofy.db`

```mermaid
erDiagram
    USERS {
        INTEGER id PK
        VARCHAR_80 username UK
        VARCHAR_120 email UK
        VARCHAR_255 password_hash
        VARCHAR_120 guardianname
        VARCHAR_50 relationship
        VARCHAR_20 phone
        VARCHAR_255 childrens_ages
        DATETIME created_at
        DATETIME updated_at
        DATETIME last_login
        BOOLEAN is_active
        VARCHAR_20 role
    }

    TRACKED_ASSESSMENTS {
        INTEGER id PK
        INTEGER user_id FK
        INTEGER age_months
        INTEGER cough_duration
        INTEGER respiratory_rate
        BOOLEAN fast_breathing
        BOOLEAN fever
        FLOAT fever_temperature
        BOOLEAN difficulty_breathing
        BOOLEAN chest_indrawing
        BOOLEAN stridor
        BOOLEAN lethargy
        BOOLEAN unable_to_drink
        BOOLEAN vomiting
        BOOLEAN diarrhea
        INTEGER previous_episodes
        INTEGER convulsions
        INTEGER cyanosis
        INTEGER unconscious
        VARCHAR_100 assessment
        TEXT recommendation
        TEXT guidance
        TEXT home_remedies
        DATETIME timestamp
    }

    ADMIN_INVITES {
        INTEGER id PK
        VARCHAR_255 token UK
        VARCHAR_120 invited_email
        VARCHAR_120 invited_name
        INTEGER created_by_id FK
        INTEGER accepted_by_id FK
        DATETIME created_at
        DATETIME expires_at
        DATETIME accepted_at
        VARCHAR_20 status
    }

    USERS ||--o{ TRACKED_ASSESSMENTS : "owns"
    USERS ||--o{ ADMIN_INVITES : "created_by"
    USERS ||--o{ ADMIN_INVITES : "accepted_by"
```

## Relationship Summary

| Parent table | Child table | Foreign key | Meaning |
|---|---|---|---|
| `users` | `tracked_assessments` | `tracked_assessments.user_id -> users.id` | A user can own many saved symptom assessments. |
| `users` | `admin_invites` | `admin_invites.created_by_id -> users.id` | An admin user can create many admin invitations. |
| `users` | `admin_invites` | `admin_invites.accepted_by_id -> users.id` | A user/admin account can be linked to an accepted invitation. |

## Notes From The Actual SQLite Database

- The database currently has `users`, `tracked_assessments`, and `admin_invites`.
- `tracked_assessments` is linked to `users`, so tracker records are user-specific.
- `admin_invites` has two links back to `users`: one for the admin who created the invite and one for the account that accepted it.
- SQLite reports the foreign-key delete/update behavior as `NO ACTION` in the existing database.
- The current SQLite database does not contain an `information_content` table.

