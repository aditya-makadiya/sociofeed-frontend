import React from "react";
import { Card, CardContent } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const CreatePost = () => {
  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {/* User Avatar Placeholder */}
          <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>

          {/* Post Input Area */}
          <div className="flex-1">
            <textarea
              placeholder="What's on your mind?"
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-3">
              <div className="flex space-x-2">
                <button className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
                  <AddIcon fontSize="small" />
                  <span>Photo</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">
                  <AddIcon fontSize="small" />
                  <span>Video</span>
                </button>
              </div>

              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Post
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
