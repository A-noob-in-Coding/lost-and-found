import React from 'react';

const PostVerificationForm = ({ post, onApprove, onReject }) => {
  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 md:flex md:flex-col">
      <div className="h-48 overflow-hidden md:h-40">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
          <i className="fas fa-map-marker-alt mr-2"></i>
          {post.location}
        </p>
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{post.description}</p>
        <div className="flex justify-between mt-4">
          <button 
            onClick={() => onApprove(post.id)}
            className="!rounded-button whitespace-nowrap bg-black text-white px-4 py-2 text-sm font-medium flex items-center cursor-pointer"
          >
            <i className="fas fa-check mr-2"></i>
            Approve
          </button>
          <button 
            onClick={() => onReject(post.id)}
            className="!rounded-button whitespace-nowrap bg-black text-white px-4 py-2 text-sm font-medium flex items-center cursor-pointer"
          >
            <i className="fas fa-times mr-2"></i>
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostVerificationForm;
