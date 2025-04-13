import React from 'react';
import CommentsVerificationForm from './commentsVerificationForm.jsx';

const CommentVerificationContainer = ({ comments, posts, onApprove, onReject }) => {
  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Comments Verification</h2>
      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 md:gap-4">
        {comments.filter(comment => comment.status === "pending").map(comment => {
          const relatedPost = posts.find(post => post.id === comment.postId);
          return (
            <CommentsVerificationForm 
              key={comment.id} 
              comment={comment} 
              relatedPost={relatedPost} 
              onApprove={onApprove} 
              onReject={onReject} 
            />
          );
        })}
      </div>
      {comments.filter(comment => comment.status === "pending").length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No pending comments to verify
        </div>
      )}
    </section>
  );
};

export default CommentVerificationContainer;
