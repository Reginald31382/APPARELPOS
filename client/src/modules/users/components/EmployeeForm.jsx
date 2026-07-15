const roles = ["Owner", "Admin", "Manager", "Cashier"];

const EmployeeForm = ({ form, onChange, showPasswordFields = true }) => {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={onChange}
          className="rounded-lg border p-3"
        />

        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={onChange}
          className="rounded-lg border p-3"
        />
      </div>

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={onChange}
        className="rounded-lg border p-3"
      />

      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={onChange}
        className="rounded-lg border p-3"
      />

      <select
        name="role"
        value={form.role}
        onChange={onChange}
        className="rounded-lg border p-3"
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      {"isActive" in form && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={(e) =>
              onChange({
                target: {
                  name: "isActive",
                  value: e.target.checked,
                },
              })
            }
          />
          Active Employee
        </label>
      )}

      {showPasswordFields && (
        <>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            className="rounded-lg border p-3"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={onChange}
            className="rounded-lg border p-3"
          />
        </>
      )}
    </div>
  );
};

export default EmployeeForm;
