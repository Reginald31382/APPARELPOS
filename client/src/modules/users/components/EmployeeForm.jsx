const roles = ["Owner", "Admin", "Manager", "Cashier"];

const EmployeeForm = ({ form, onChange, showPasswordFields = true }) => {
  const inputStyles =
    "w-full min-w-0 rounded-lg border bg-white p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-base";

  return (
    <div className="grid min-w-0 gap-4">
      {/* Employee Name */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <label
            htmlFor="employee-first-name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            First Name
          </label>

          <input
            id="employee-first-name"
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName ?? ""}
            onChange={onChange}
            autoComplete="given-name"
            className={inputStyles}
          />
        </div>

        <div className="min-w-0">
          <label
            htmlFor="employee-last-name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>

          <input
            id="employee-last-name"
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName ?? ""}
            onChange={onChange}
            autoComplete="family-name"
            className={inputStyles}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="employee-email"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Email Address
        </label>

        <input
          id="employee-email"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email ?? ""}
          onChange={onChange}
          autoComplete="email"
          className={inputStyles}
        />
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="employee-phone"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>

        <input
          id="employee-phone"
          type="tel"
          name="phone"
          placeholder="Phone"
          value={form.phone ?? ""}
          onChange={onChange}
          autoComplete="tel"
          className={inputStyles}
        />
      </div>

      {/* Role */}
      <div>
        <label
          htmlFor="employee-role"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Employee Role
        </label>

        <select
          id="employee-role"
          name="role"
          value={form.role ?? "Cashier"}
          onChange={onChange}
          className={inputStyles}
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Active Employee */}
      {"isActive" in form && (
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
          <input
            type="checkbox"
            name="isActive"
            checked={Boolean(form.isActive)}
            onChange={(e) =>
              onChange({
                target: {
                  name: "isActive",
                  value: e.target.checked,
                },
              })
            }
            className="h-5 w-5 shrink-0 rounded accent-blue-600"
          />

          <span className="text-sm font-medium text-gray-700">
            Active Employee
          </span>
        </label>
      )}

      {/* Password Fields */}
      {showPasswordFields && (
        <>
          <div>
            <label
              htmlFor="employee-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="employee-password"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password ?? ""}
              onChange={onChange}
              autoComplete="new-password"
              className={inputStyles}
            />
          </div>

          <div>
            <label
              htmlFor="employee-confirm-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <input
              id="employee-confirm-password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword ?? ""}
              onChange={onChange}
              autoComplete="new-password"
              className={inputStyles}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeForm;
