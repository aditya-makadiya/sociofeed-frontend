import React from "react";
import { Link } from "react-router-dom";
import CommonForm from "../common/CommonForm";
import { registerSchema } from "../../utils/validation/yupSchemas";

const registrationFields = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    autoComplete: "email",
  },
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "Choose a username",
    autoComplete: "username",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Create a password",
    autoComplete: "new-password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Re-enter your password",
    autoComplete: "new-password",
  },
];

const RegisterForm = ({ onSubmit, isSubmitting }) => (
  <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
    <h2 className="text-2xl font-extrabold text-center mb-8 text-gray-900 tracking-tight">
      Create Your Account
    </h2>
    <CommonForm
      fields={registrationFields}
      schema={registerSchema}
      onSubmit={onSubmit}
      submitLabel="Register"
      isSubmitting={isSubmitting}
    />
    <div className="mt-6 text-center text-sm">
      <span className="text-gray-500">Already have an account? </span>
      <Link to="/login" className="text-blue-600 hover:underline font-medium">
        Login
      </Link>
    </div>
  </div>
);

export default RegisterForm;
