import React from "react";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import UserList from "../common/UserList";
import CustomPagination from "../common/CustomPagination";

const UserListModal = React.memo(
  ({
    open,
    onClose,
    title,
    users,
    loading,
    error,
    pagination,
    onPageChange,
    onUserClick,
    onRetry,
    onRefetch,
  }) => (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="profile-list-modal"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.55)",
      }}
    >
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 w-[90%] sm:w-[400px] max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            {title}
            {pagination.totalCount > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({pagination.totalCount})
              </span>
            )}
          </h3>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <UserList
            users={users}
            loading={loading}
            error={error}
            emptyMessage={`No ${title.toLowerCase()} yet`}
            onUserClick={onUserClick}
            onRetry={onRetry}
            onRefetch={onRefetch}
          />
        </div>
        <CustomPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalCount={pagination.totalCount}
          pageSize={pagination.pageSize}
          onPageChange={onPageChange}
          showInfo={true}
          size="small"
          color="primary"
          className="mt-3"
        />
      </div>
    </Modal>
  )
);

export default UserListModal;
