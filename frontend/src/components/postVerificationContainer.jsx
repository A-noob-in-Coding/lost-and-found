import React, { useEffect, useState } from 'react';
import PostVerificationForm from './postVerificationForm.jsx';

const PostVerificationContainer = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/posts/');
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();

      const withStatus = data.map(post => ({
        id: post.post_id,
        title: post.title,
        description: post.description,
        location: post.location,
        image: post.image_url,
        post_type: post.post_type,
        status: 'pending',
      }));

      setPosts(withStatus);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const onReject = async (id, type) => {
    try {
      const endpoint =
        type === 'l'
          ? `http://localhost:5000/api/admin/posts/lost?id=${id}`
          : `http://localhost:5000/api/admin/posts/found?id=${id}`;
      
      const res = await fetch(endpoint, {
        method: 'DELETE',
      });
  
      if (!res.ok) throw new Error('Rejection failed');
  
      // Remove the rejected post from the list
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Rejection error:', error.message);
    }
  };
  
  

  useEffect(() => {
    fetchPosts();
  }, []);

  const onApprove = async (id, type) => {
    try {
      const endpoint =
        type === 'l'
          ? `http://localhost:5000/api/admin/posts/lost?id=${id}`
          : `http://localhost:5000/api/admin/posts/found?id=${id}`;
  
      const res = await fetch(endpoint, {
        method: 'PUT',
      });
  
      if (!res.ok) throw new Error('Approval failed');
  
      // Update the post status locally
      setPosts(prev => prev.map(p => (p.id === id ? { ...p, status: 'approved' } : p)));
    } catch (error) {
      console.error('Approval error:', error.message);
    }
  };
  


  return (
    <section className="mb-10 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Posts Verification</h2>
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading posts...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.filter(post => post.status === 'pending').map(post => (
            <PostVerificationForm
              key={post.id}
              post={post}
              onApprove={() => onApprove(post.id, post.post_type)}
              onReject={() => onReject(post.id, post.post_type)}
            />
          ))}
        </div>
      )}
      {!loading && posts.filter(post => post.status === 'pending').length === 0 && (
        <div className="text-center py-8 text-gray-500">No pending posts to verify</div>
      )}
    </section>
  );
};

export default PostVerificationContainer;
