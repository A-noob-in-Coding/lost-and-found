import React from 'react';
import PostVerificationForm from './postVerificationForm.jsx';

const PostVerificationContainer = ({ posts, onApprove, onReject }) => {
  return (
    <section className="mb-10 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Posts Verification</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Added responsive grid layout */}
        {posts.filter(post => post.status === "pending").map(post => (
          <PostVerificationForm 
            key={post.id} 
            post={post} 
            onApprove={onApprove} 
            onReject={onReject} 
          />
        ))}
      </div>
      {posts.filter(post => post.status === "pending").length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No pending posts to verify
        </div>
      )}
    </section>
  );
};

export default PostVerificationContainer;
