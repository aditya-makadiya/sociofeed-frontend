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

const LoginForm = ({ onSubmit, isSubmitting, serverError }) => (
  <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
    <h2 className="text-2xl font-extrabold text-center mb-8 text-gray-900 tracking-tight">
      Sign Into Your Account
    </h2>
    <CommonForm
      fields={loginFields}
      schema={loginSchema}
      onSubmit={onSubmit}
      submitLabel="Login"
      isSubmitting={isSubmitting}
      serverError={serverError}
    />
    <div className="mt-6 flex flex-col items-center gap-2 text-sm">
      <span className="text-gray-500">
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
);

export default LoginForm;
