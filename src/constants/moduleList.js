// List of application modules along with their possible permissions.
// Each object in the list contains:
// - name: The name of the module (e.g., Dashboard, Employees, etc.)
// - permissions: The list of actions/permissions that can be assigned for this module.

export const MODULE_LIST = [
  {
    name: 'Dashboard',
    permissions: ['All', 'View', 'Add', 'Update', 'Delete'],
  },
  {
    name: 'Employees',
    permissions: ['All', 'View', 'Add', 'Update', 'Delete'],
  },
  {
    name: 'Reports',
    permissions: ['All', 'View', 'Add', 'Update', 'Delete'],
  },
  {
    name: 'Skill Matrix',
    permissions: ['All', 'View', 'Add', 'Update', 'Delete'],
  },
  {
    name: 'ORG',
    permissions: ['All', 'View', 'Add', 'Update', 'Delete'],
  },
];
