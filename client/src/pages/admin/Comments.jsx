import React, { useEffect, useState } from "react";
import { comments_data } from "../../assets/assets";
import CommentTableItem from "../../components/admin/CommentTableItem";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Comments = () => {

  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("Not Approved");

  const { axios } = useAppContext();

  // Fetch Comments
  const fetchComments = async () => {
    try {
      const { data } = await axios.get('/api/admin/comments');

      if (data.success) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };


  useEffect(() => {
    fetchComments(); // ✅ call API
  }, []);


  // Toggle Approve (Frontend Only)
  const handleApprove = (id, status) => {

    const updated = comments.map((item) =>
      item._id === id
        ? { ...item, isApproved: status }
        : item
    );

    setComments(updated);
  };


  // Filter
  const filteredComments = comments.filter((item) => {
    if (filter === "Approved") return item.isApproved === true;
    return item.isApproved === false;
  });


  return (
    <div className="flex-1 pt-8 px-6 bg-blue-50/50">

      {/* Header */}
      <div className="flex justify-between items-center max-w-4xl">

        <h1 className="text-xl font-semibold">Comments</h1>

        <div className="flex gap-3">

          {/* Approved */}
          <button
            onClick={() => setFilter("Approved")}
            className={`border px-4 py-1 rounded-full text-xs ${
              filter === "Approved"
                ? "border-primary text-primary"
                : "text-gray-600"
            }`}
          >
            Approved
          </button>

          {/* Not Approved */}
          <button
            onClick={() => setFilter("Not Approved")}
            className={`border px-4 py-1 rounded-full text-xs ${
              filter === "Not Approved"
                ? "border-primary text-primary"
                : "text-gray-600"
            }`}
          >
            Not Approved
          </button>

        </div>

      </div>


      {/* Table */}
      <div className="mt-6 bg-white shadow rounded-lg max-w-4xl overflow-x-auto">

        <table className="w-full text-sm text-gray-600">

          <thead className="bg-gray-50 text-xs uppercase">

            <tr>
              <th className="px-6 py-3 text-left">
                Blog Title & Comment
              </th>

              <th className="px-6 py-3 max-sm:hidden">
                Date
              </th>

              <th className="px-6 py-3">
                Action
              </th>
            </tr>

          </thead>


          <tbody>

            {filteredComments.map((item) => (
             <CommentTableItem
  key={item._id}
  comment={item}
  fetchComments={fetchComments}
/>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Comments;
