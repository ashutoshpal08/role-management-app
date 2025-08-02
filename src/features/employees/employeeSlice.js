import { createSlice } from '@reduxjs/toolkit';
import { EMPLOYEE_LIST } from '../../constants/employeeList';

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    list: EMPLOYEE_LIST,
  },
  reducers: {
    assignRole: (state, action) => {
      const { employeeId, roleId } = action.payload;
      const employee = state.list.find(emp => emp.id === employeeId);
      if (employee && !employee.roles.includes(roleId)) {
        employee.roles.push(roleId);
      }
    },
    removeRole: (state, action) => {
      const { employeeId, roleId } = action.payload;
      const employee = state.list.find(emp => emp.id === employeeId);
      if (employee) {
        employee.roles = employee.roles.filter(id => id !== roleId);
      }
    },
  },
});

export const { assignRole, removeRole } = employeeSlice.actions;
export default employeeSlice.reducer;
