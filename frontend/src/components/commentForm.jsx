import { useState } from "react";
import { MdSend } from "react-icons/md";
export default function CommentForm(item) {
  const [commentText, setCommentText] = useState("");
  const handleAddComment = async (e, itemId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8000/api/comments/${itemId}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      }
    );
    if (response.ok) {
      setCommentText("");
      // Optionally, you can also refresh the comments list here
    } else {
      console.error("Failed to add comment");
    }
  };
  return (
    <form
      className="flex items-center mt-3"
      onSubmit={(e) => handleAddComment(e, item.id)}
    >
      <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
        <img
          src="https://public.readdy.ai/ai/img_res/9611ce60f32dec530b3011a82805d677.jpg"
          alt="You"
          className="w-full h-full object-cover"
        />
      </div>
      <input
        type="text"
        placeholder="Add a comment..."
        className="flex-1 px-3 py-1 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-black"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        required
      />
      <button
        type="submit"
        className="ml-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
      >
        <MdSend className="text-gray-500" size={24} />
      </button>
    </form>
  );
}
