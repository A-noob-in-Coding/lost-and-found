import { useState } from "react";
import { MdSend } from "react-icons/md";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

export default function CommentForm({ item }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Check if user exists before proceeding
    if (!user || !user.rollno) {
      toast.error("Please log in to add comments");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    const isLost = item.type === "Lost";
    // const url = isLost
    //   ? "http://localhost:5000/comment/addlostcomment"
    //   : "http://localhost:5000/comment/addfoundcomment";

    // const body = isLost
    //   ? {
    //       lpostId: item.id,
    //       rollNo: user.rollno,
    //       comment: commentText,
    //     }
    //   : {
    //       fpostId: item.id,
    //       rollNo: user.rollno,
    //       comment: commentText,
    //     };

    try {
      // const response = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(body),
      // });

      // if (response.ok) {
        setCommentText("");
        toast.success("Comment added successfully (Simulated for testing)");
        // Refresh the page to show the new comment
        // window.location.reload();
      // } else {
      //   const errorData = await response.json();
      //   toast.error(errorData.message || "Failed to add comment");
      // }
    } catch (error) {
      console.error("Error sending comment:", error);
      toast.error("An error occurred while adding the comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex items-center mt-3" onSubmit={handleAddComment}>
      <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
        {user && user.image_url ? (
          <img
            src={user.image_url}
            alt="You"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <i className="fas fa-user text-gray-400 text-xs"></i>
          </div>
        )}
      </div>
      <input
        type="text"
        placeholder={user ? "Add a comment..." : "Log in to comment..."}
        className="flex-1 px-3 py-1 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-black"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        required
        disabled={isSubmitting || !user}
      />
      <button
        type="submit"
        disabled={isSubmitting || !user}
        className={`ml-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full transition-all transform ${
          isSubmitting || !user
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-200 hover:scale-105 active:scale-95"
        }`}
      >
        <MdSend
          className={`text-gray-500 transition-transform ${
            isSubmitting ? "animate-spin" : ""
          }`}
          size={24}
        />
      </button>
    </form>
  );
}
