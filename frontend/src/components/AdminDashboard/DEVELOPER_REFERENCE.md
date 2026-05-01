# Admin Dashboard - Developer Reference

## Component Props Reference

### AdminDashboard
**Main container component - no props required**
```jsx
<AdminDashboard />
```

**Internal State:**
- `currentPage` - Current page (dashboard|users|analytics|settings)
- `sidebarOpen` - Sidebar visibility on mobile
- `users` - Array of user objects

---

### AdminSidebar
**Props:**
```jsx
<AdminSidebar
  currentPage="dashboard"           // Current active page
  onNavigate={(page) => {}}         // Navigation callback
  isOpen={false}                    // Sidebar visibility
  onToggle={() => {}}               // Toggle sidebar
/>
```

**Navigation Items:**
- Dashboard (📊)
- Users (👥)
- Analytics (📈)
- Settings (⚙️)

---

### AdminTopbar
**Props:**
```jsx
<AdminTopbar
  onMenuClick={() => {}}            // Menu toggle callback
  userName="Dr. Admin"              // Display user name
/>
```

**Features:**
- Search bar with onSubmit handler
- Notifications icon with badge (3)
- User profile dropdown with logout

---

### DashboardOverview
**Props:**
```jsx
<DashboardOverview
  usersCount={3}                    // Total users
  activeUsers={2}                   // Active users count
/>
```

**Displays:**
- Total Users card
- Active Now card
- Reports Today card
- System Health card
- Recent Activity list

---

### UserManagement
**Props:**
```jsx
<UserManagement
  users={[                          // Array of user objects
    {
      id: 1,
      username: "student_001",
      status: "Active",
      joinDate: "2024-01-15"
    }
  ]}
  onAddUser={(newUser) => {}}       // Add user callback
  onUpdateUser={(user) => {}}       // Update user callback
  onDeleteUser={(userId) => {}}     // Delete user callback
/>
```

**Features:**
- User table with non-sensitive data only
- Add user modal (username field only)
- Edit user modal
- Delete with confirmation
- Form validation

**Note:** For privacy and security, only username, ID, status, and join date are displayed. No personal information like email addresses, real names, or roles are shown.

---

## User Object Structure

```javascript
{
  id: number,                       // Unique identifier (auto-generated)
  username: string,                 // Username (3+ chars, alphanumeric + underscore)
  status: string,                   // Status ("Active" default)
  joinDate: string                  // Join date (YYYY-MM-DD)
}
```

**Example:**
```javascript
{
  id: 4,
  username: "student_004",
  status: "Active",
  joinDate: "2024-05-01"
}
```

**Privacy Note:** User objects intentionally exclude sensitive data like email addresses, real names, roles, and departments.

---

## Form Validation Rules

### Username Field
```javascript
// Required
if (!formData.username.trim()) {
  errors.username = 'Username is required';
}

// Minimum 3 characters
if (formData.username.trim().length < 3) {
  errors.username = 'Username must be at least 3 characters';
}

// Only alphanumeric and underscore
const usernameRegex = /^[a-zA-Z0-9_]+$/;
if (!usernameRegex.test(formData.username)) {
  errors.username = 'Username can only contain letters, numbers, and underscores';
}

// No duplicates
const usernameExists = users.some(u => u.username === formData.username);
if (usernameExists) {
  errors.username = 'This username is already taken';
}
```

**Valid Examples:**
- "student_001" ✓
- "admin_2024" ✓
- "john_doe" ✓

**Invalid Examples:**
- "" ✗ (empty)
- "ab" ✗ (too short)
- "user@admin" ✗ (special characters not allowed)
- "user name" ✗ (spaces not allowed)

---

## Event Handlers

### Add User
```jsx
const handleAddClick = () => {
  setEditingUser(null);
  setFormData({ username: '' });
  setErrors({});
  setModalOpen(true);
};

// Then:
const handleSubmit = (e) => {
  e.preventDefault();
  const newErrors = validateForm();
  if (Object.keys(newErrors).length === 0) {
    onAddUser(formData);
    handleCloseModal();
  }
};
```

### Edit User
```jsx
const handleEditClick = (user) => {
  setEditingUser(user);
  setFormData({
    username: user.username
  });
  setErrors({});
  setModalOpen(true);
};
```

### Delete User
```jsx
const handleDelete = (userId) => {
  if (window.confirm('Are you sure you want to delete this user?')) {
    onDeleteUser(userId);
  }
};
```

---

## CSS Classes Reference

### Layout Classes
```css
.admin-dashboard           /* Main container */
.admin-main                /* Main content area */
.admin-sidebar             /* Left sidebar */
.admin-content             /* Content wrapper */
.admin-topbar              /* Top navigation */
```

### Component Classes
```css
.sidebar-logo              /* Logo section */
.nav-item                  /* Navigation item */
.nav-item.active           /* Active nav item */
.user-profile              /* Profile dropdown */
.profile-dropdown          /* Dropdown menu */
```

### Content Classes
```css
.page-section              /* Page container */
.section-header            /* Page header */
.metrics-grid              /* Metrics grid */
.metric-card               /* Single metric card */
.table-container           /* Table wrapper */
.users-table               /* User table */
```

### Form Classes
```css
.modal-overlay             /* Modal background */
.modal-content             /* Modal container */
.form-group                /* Form field group */
.form-input                /* Input field */
.form-input.error          /* Error state */
.error-message             /* Error text */
```

---

## Color Variables

```css
:root {
  --primary-color: #17a2b8;          /* Teal */
  --success-color: #28a745;          /* Green */
  --danger-color: #dc3545;           /* Red */
  --warning-color: #ffc107;          /* Yellow */
  --dark-color: #1a202c;             /* Dark */
  --light-color: #f8fbfc;            /* Light */
  --border-color: #e2e8f0;           /* Border */
  --text-color: #5a6c7d;             /* Text */
}
```

---

## Extending the Dashboard

### Add New Page
1. Create new component file
2. Import in AdminDashboard.jsx
3. Add case to if/else for page display
4. Add menu item to AdminSidebar

**Example:**
```jsx
// In AdminDashboard.jsx
{currentPage === 'reports' && (
  <ReportsPage data={data} />
)}

// In AdminSidebar menu items
{ id: 'reports', label: 'Reports', icon: '📄' }
```

### Add New Role
```jsx
// In UserManagement.jsx
const roles = [
  'Medical Supervisor',
  'Healthcare Worker',
  'Platform Administrator',
  'Data Analyst',
  'YOUR_NEW_ROLE'  // Add here
];
```

### Add New Department
```jsx
// In UserManagement.jsx or DashboardOverview.jsx
const departments = [
  'Pediatrics',
  'Respiratory Ward',
  'Administration',
  'Quality Assurance',
  'Research',
  'YOUR_DEPARTMENT'  // Add here
];
```

### Connect to Backend API
```jsx
// In AdminDashboard.jsx
useEffect(() => {
  // Fetch users from API
  fetch('/api/users')
    .then(res => res.json())
    .then(data => setUsers(data))
    .catch(err => console.error(err));
}, []);

// Update add user handler
const handleAddUser = (newUser) => {
  fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser)
  })
    .then(res => res.json())
    .then(data => setUsers([...users, data]))
    .catch(err => console.error(err));
};
```

---

## Styling Customization

### Change Primary Color
```css
/* AdminDashboard.css */
:root {
  --primary-color: #YOUR_COLOR;  /* Update this */
}
```

### Change Sidebar Width
```css
.admin-sidebar {
  width: 260px;  /* Update this value */
}
```

### Change Font
```css
.admin-dashboard {
  font-family: 'Your Font', sans-serif;  /* Update this */
}
```

---

## Responsive Breakpoints

```css
/* Tablet */
@media (max-width: 1024px) { }

/* Mobile Landscape */
@media (max-width: 768px) { }

/* Mobile Portrait */
@media (max-width: 480px) { }
```

---

## Testing Checklist

- [ ] Add user with valid data
- [ ] Prevent add user with invalid name
- [ ] Prevent add user with invalid email
- [ ] Prevent add user with duplicate email
- [ ] Edit existing user
- [ ] Delete user with confirmation
- [ ] Search functionality
- [ ] Mobile layout responsive
- [ ] Sidebar toggle on mobile
- [ ] Profile dropdown opens/closes
- [ ] Form clears after submission
- [ ] Error messages display
- [ ] Recent activity appears
- [ ] Metric cards display correct data

---

## Deployment Checklist

- [ ] Remove console.log() statements
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Connect to backend API
- [ ] Update sample data with real data
- [ ] Configure environment variables
- [ ] Run production build: `npm run build`
- [ ] Test production build locally
- [ ] Deploy to hosting

---

## Performance Tips

1. **Pagination**: Add pagination for large user lists
   ```jsx
   const itemsPerPage = 10;
   const [currentPage, setCurrentPage] = useState(1);
   const paginatedUsers = users.slice(
     (currentPage - 1) * itemsPerPage,
     currentPage * itemsPerPage
   );
   ```

2. **Search Filtering**: Add debounce to search
   ```jsx
   import { debounce } from 'lodash';
   const debouncedSearch = debounce((query) => {
     // Search implementation
   }, 300);
   ```

3. **Memoization**: Use React.memo for static components
   ```jsx
   export default React.memo(AdminSidebar);
   ```

---

## Troubleshooting Guide

**Issue: Modal won't close**
- Check if `handleCloseModal()` is properly connected
- Verify `modalOpen` state is updating

**Issue: Form validation not working**
- Check `validateForm()` function
- Verify error state is updating
- Check form field names match formData keys

**Issue: Users not updating**
- Check if callbacks are properly passed
- Verify state is updating with setUsers()
- Check array copy is being created

**Issue: Styling not applying**
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS file is imported
- Verify CSS classes match component elements

---

**Version:** 1.0.0
**Last Updated:** 2024
**Status:** Production Ready ✓
