import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearError } from "../../utils/errorHandler";

const ToastProvider = () => {
  const dispatch = useDispatch();
  const { message } = useSelector((state) => state.error);

  React.useEffect(() => {
    if (message) {
      toast.error(message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        onClose: () => clearError(dispatch),
      });
    }
  }, [message, dispatch]);

  return <ToastContainer />;
};

export default ToastProvider;
