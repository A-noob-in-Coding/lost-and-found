import { useState } from "react";
import { MdSend } from "react-icons/md";
import { useAuth } from "../context/authContext";

export default function CommentForm({ item }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");

  const handleAddComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const isLost = item.type === "Lost";
    const url = isLost
      ? "http://localhost:5000/comment/addlostcomment"
      : "http://localhost:5000/comment/addfoundcomment";

    const body = isLost
      ? {
          lpostId: item.id,
          rollNo: user.rollno,
          comment: commentText,
        }
      : {
          fpostId: item.id,
          rollNo: user.rollno,
          comment: commentText,
        };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setCommentText("");
        console.log("Comment added successfully");
        // Optional: trigger a state refresh to update comments
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error sending comment:", error);
    }
  };

  return (
    <form className="flex items-center mt-3" onSubmit={handleAddComment}>
      <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
        <img
          src={user.image_url}
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
