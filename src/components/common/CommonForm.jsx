import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const CommonForm = ({
  fields,
  schema,
  onSubmit,
  submitLabel = "Submit",
  defaultValues = {},
  isSubmitting = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-sm mx-auto"
    >
      {fields.map((field) => (
        <div
          key={field.name}
          className="flex items-start justify-between gap-4"
        >
          <label
            htmlFor={field.name}
            className="w-1/3 pt-2 text-sm font-medium text-gray-700"
          >
            {field.label}
          </label>
          <div className="w-2/3 flex flex-col">
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <input
                  {...controllerField}
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  className="border rounded px-3 py-2 text-sm"
                />
              )}
            />
            {errors[field.name] && (
              <span className="text-red-500 text-xs mt-1">
                {errors[field.name].message}
              </span>
            )}
          </div>
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : submitLabel}
      </button>
    </form>
  );
};

export default CommonForm;
