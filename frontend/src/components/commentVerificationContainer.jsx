import { useEffect, useState } from 'react';
import CommentsVerificationForm from './commentsVerificationForm.jsx';

const CommentVerificationContainer = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch('http://localhost:5000/comment/getcomments');
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        // Map each comment to include a pending status
        const withStatus = data.map(comment => ({
          ...comment,
          status: 'pending'
        }));
        setComments(withStatus);
      } catch (error) {
        console.error('Error fetching comments:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const onReject = async (commentId, commentType) => {
    try {
      const url =
        commentType === 'l'
          ? `http://localhost:5000/comment/deleteadminlostcomment?id=${commentId}`
          : `http://localhost:5000/comment/deleteadminfoundcomment?id=${commentId}`;
  
      const response = await fetch(url, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
  
      // Optional: Update UI by removing the comment from state
      setComments(prev =>
        prev.filter(comment => comment.comment_id !== commentId)
      );
  
      console.log(`Comment ${commentId} deleted successfully`);
    } catch (error) {
      console.error('Error rejecting comment:', error.message);
    }
  };
  

  const handleApprove = async (commentId, commentType) => {
    try {
      let url = '';
      if (commentType === 'l') {
        url = `http://localhost:5000/comment/verifylostcomment?id=${commentId}`;
      } else if (commentType === 'f') {
        url = `http://localhost:5000/comment/verifyfoundcomment?id=${commentId}`;
      } else {
        console.error('Unknown comment type:', commentType);
        return;
      }
  
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to verify comment');
      }
  
      // Remove the verified comment from the list
      setComments(prev =>
        prev.map(comment =>
          comment.comment_id === commentId ? { ...comment, status: 'verified' } : comment
        )
      );
    } catch (error) {
      console.error('Error approving comment:', error.message);
    }
  };
  

  const pendingComments = comments.filter(comment => comment.status === 'pending');

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Comments Verification</h2>
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading comments...</div>
      ) : pendingComments.length > 0 ? (
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-1 md:gap-4">
          {pendingComments.map(comment => (
            <CommentsVerificationForm
              key={comment.comment_id}
              comment={comment}
              onApprove={() => handleApprove(comment.comment_id, comment.comment_type)}
              onReject={()=>onReject(comment.comment_id, comment.comment_type)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No pending comments to verify
        </div>
      )}
    </section>
  );
};

export default CommentVerificationContainer;
