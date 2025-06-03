import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { TextField, Button, CircularProgress } from "@mui/material";

const CommonForm = ({
  fields,
  schema,
  onSubmit,
  submitLabel = "Submit",
  defaultValues = {},
  isSubmitting = false,
  serverError = null,
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
      className="space-y-6 w-full max-w-md mx-auto"
    >
      {fields.map((field, index) => (
        <motion.div
          key={field.name}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between gap-4"
        >
          <label
            htmlFor={field.name}
            className="w-1/3 text-sm font-medium text-gray-600"
          >
            {field.label}
          </label>
          <div className="w-2/3 flex flex-col">
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <TextField
                  {...controllerField}
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  variant="outlined"
                  size="small"
                  className="w-full"
                  aria-invalid={!!errors[field.name]}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.5rem",
                      backgroundColor: "#f9fafb",
                      padding: "0.5rem 1rem",
                    },
                  }}
                />
              )}
            />
            {errors[field.name] && (
              <span className="text-red-500 text-xs mt-1">
                {errors[field.name].message}
              </span>
            )}
          </div>
        </motion.div>
      ))}
      {serverError && (
        <p className="text-red-500 text-sm text-center mt-2">{serverError}</p>
      )}
      <motion.div whileHover={{ scale: 1.05 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          className="w-full py-3 rounded-full text-sm font-medium tracking-wide"
          sx={{
            backgroundColor: "#2563eb",
            "&:hover": { backgroundColor: "#1d4ed8" },
            textTransform: "none",
          }}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <CircularProgress size={20} color="inherit" />
              Submitting...
            </span>
          ) : (
            submitLabel
          )}
        </Button>
      </motion.div>
    </form>
  );
};

export default CommonForm;
