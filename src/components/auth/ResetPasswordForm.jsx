import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../common/Button";
import Input from "../common/Input";
import useAuth from "../../hooks/useAuth";
import { resetPasswordSchema } from "../../utils/validation/yupSchemas";
import { ROUTES } from "../../constants";

const ResetPasswordForm = ({ onClose }) => {
  const { resetPassword, loading } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      await resetPassword(token, data).unwrap();
      toast.success("Password reset successful.");
      if (onClose) onClose();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      // Error handled by axios interceptor
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
      <Input
        label="New Password"
        name="password"
        type="password"
        register={register}
        error={errors.password}
        placeholder="Enter new password"
      />
      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        register={register}
        error={errors.confirmPassword}
        placeholder="Confirm new password"
      />
      <Button type="submit" loading={loading} className="w-full">
        Reset Password
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
