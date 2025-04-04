import SubmitPost from "./submitPost.jsx"

export default function PostModal({setPostType, postType,setShowPostModal}) {
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create New Post</h3>
              <button
                onClick={()=>{}}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="flex space-x-2 mb-4">
              <button
                className={`flex-1 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${
                  postType === "Lost"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setPostType("Lost")}
                type="button"
              >
                <i className="fas fa-search mr-2"></i> Lost Item
              </button>
              <button
                className={`flex-1 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${
                  postType === "Found"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setPostType("Found")}
                type="button"
              >
                <i className="fas fa-hand-holding mr-2"></i> Found Item
              </button>
            </div>
            <SubmitPost
              postType={postType}
              setShowPostModal={setShowPostModal}
            />
          </div>
        </div>
  )

}