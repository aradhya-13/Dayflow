# Dayflow UI Components

Import from `../components/ui/ComponentName`.

## Quick Reference

### Button
```jsx
import Button from '../components/ui/Button';

<Button onClick={fn}>Save</Button>                         // primary (default)
<Button variant="secondary" onClick={fn}>Cancel</Button>   // outlined
<Button variant="danger" onClick={fn}>Delete</Button>      // red
<Button variant="ghost" onClick={fn}>View</Button>         // no border
<Button loading={saving}>Saving…</Button>                  // spinner
<Button size="sm">Small</Button>                           // sm | md | lg
```

### Card
```jsx
import Card from '../components/ui/Card';

<Card title="Section Title" action={<Button size="sm">Add</Button>}>
  content here
</Card>

<Card padding={false}>   // use for tables (no inner padding)
  <Table ... />
</Card>
```

### Badge (status pills)
```jsx
import Badge from '../components/ui/Badge';

// Map statuses:
// present / approved / issued  → success (green)
// pending / draft              → warning (amber)
// absent / rejected            → danger (red)
// late / inactive              → neutral (gray)

<Badge variant="success">Approved</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Rejected</Badge>
<Badge variant="neutral">Late</Badge>
```

### Input & Select
```jsx
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

<Input label="Full Name" name="name" value={form.name} onChange={handleChange} required />
<Input label="Email" name="email" type="email" error={errors.email} />

<Select
  label="Leave Type"
  name="leaveType"
  value={form.leaveType}
  onChange={handleChange}
  options={[
    { value: 'sick', label: 'Sick Leave' },
    { value: 'casual', label: 'Casual Leave' },
  ]}
/>
```

### Table
```jsx
import Table from '../components/ui/Table';

<Table
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
  ]}
  rows={data}
  loading={loading}
  emptyMessage="No records found"
  renderCell={(key, value, row) => {
    if (key === 'status') return <Badge variant="success">{value}</Badge>;
    return value;
  }}
/>
```

### Modal
```jsx
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Approve</Button>

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Approve Leave Request?"
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={handleApprove} loading={approving}>Confirm</Button>
    </>
  }
>
  <p>This action will notify the employee by email.</p>
</Modal>
```

### Toast (notifications)
```jsx
import toast from 'react-hot-toast';  // just this, no component needed

toast.success('Leave approved!');
toast.error('Something went wrong');
```

## Colors (use Tailwind classes)
- Primary actions: `bg-primary-600`, `text-primary-600`
- Success: `text-success-600`
- Warning: `text-warning-600`
- Danger: `text-danger-600`
- Body text: `text-neutral-800`
- Muted text: `text-neutral-500`
- Borders: `border-neutral-200`
- Page background: `bg-neutral-50`
