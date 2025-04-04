export default function SubmitPost({ postType, setShowPostModal }) {
  const handleSubmitPost = (e) => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleSubmitPost}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
          placeholder={`${postType} item title...`}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
          placeholder="Where was it lost/found?"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-sm"
          placeholder="Describe the item..."
          rows={3}
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Image
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
          <p className="text-sm text-gray-500">
            Drag and drop an image or click to browse
          </p>
          <input type="file" className="hidden" accept="image/*" />
          <button type="button" className="mt-2 text-sm text-black underline">
            Select File
          </button>
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          type="button"
          onClick={() => setShowPostModal(false)}
          className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors whitespace-nowrap"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-900 transition-colors whitespace-nowrap"
        >
          Post {postType} Item
        </button>
      </div>
    </form>
  );
}
