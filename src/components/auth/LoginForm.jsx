import React from "react";
import { Link } from "react-router-dom";
import CommonForm from "../common/CommonForm";
import { loginSchema } from "../../utils/validation/yupSchemas";

const loginFields = [
  {
    name: "identifier",
    label: "Username or Email",
    type: "text",
    placeholder: "Enter username or email",
    autoComplete: "username",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    autoComplete: "current-password",
  },
];

const LoginForm = ({ onSubmit, isSubmitting }) => (
  <div className="flex flex-col min-h-screen justify-center items-center bg-gray-100">
    <div className="w-full max-w-md p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <CommonForm
        fields={loginFields}
        schema={loginSchema}
        onSubmit={onSubmit}
        submitLabel="Login"
        isSubmitting={isSubmitting}
      />
      <div className="mt-6 flex flex-col items-center gap-2 text-sm">
        <span>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </span>
        <Link
          to="/reset-password"
          className="text-blue-600 hover:underline font-medium"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  </div>
);

export default LoginForm;
