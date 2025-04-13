import React from 'react';

const CommentsVerificationForm = ({ comment, relatedPost, onApprove, onReject }) => {
  return (
    <div 
      className={`p-4 rounded-lg bg-gray-50 hover:shadow-sm transition-shadow duration-300`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-700 mb-1">{comment.text}</p>
          <p className="text-xs text-gray-500">
            <span className="font-medium">On post:</span> {relatedPost?.title || 'Unknown post'}
          </p>
        </div>
        <div className="flex gap-3 self-end md:self-auto">
          <button 
            onClick={() => onApprove(comment.id)}
            className="!rounded-button whitespace-nowrap bg-black text-white px-3 mr-2 py-1.5 text-sm font-medium flex items-center cursor-pointer"
          >
            <i className="fas fa-check mr-2"></i>
            Approve
          </button>
          <button 
            onClick={() => onReject(comment.id)}
            className="!rounded-button whitespace-nowrap bg-black text-white ml-2 px-6 py-1.5 text-sm font-medium flex items-center cursor-pointer"
          >
            <i className="fas fa-times mr-2"></i>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsVerificationForm;
