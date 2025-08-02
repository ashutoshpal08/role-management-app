import { createSlice } from "@reduxjs/toolkit";

// Initial state with one predefined role
const initialState = {
  list: [
    {
      id: 1,
      name: 'Admin', 
      modules: {
        DashBoard: ['View', 'Add', 'Update', 'Delete'],
        Employees: ['View'],
      },
      status: 'Active',
    },
  ],
};

const roleSlice = createSlice({
  name: 'roles',
  initialState, 
  reducers: {
    
    // Action to add a new role
    addRole(state, action) {
      const newRole = {
        ...action.payload,
        id: state.list.length + 1, 
        status: 'Active',          
      };
      state.list.push(newRole);    
    },

    // Action to delete a role by ID
    deleteRole(state, action) {
      state.list = state.list.filter(role => role.id !== action.payload);
    },

    // Action to update an existing role
    updateRole(state, action) {
      const updatedRole = action.payload;
      const index = state.list.findIndex(r => r.id === updatedRole.id);
      if (index !== -1) {
        state.list[index] = updatedRole;
      }
    },
  },
});

export const { addRole, deleteRole, updateRole } = roleSlice.actions;

export default roleSlice.reducer;
