import React from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const CommentTableItem = ({ comment, onApprove }) => {

  const { blog, name, content, createdAt, isApproved, _id } = comment;

  const date = new Date(createdAt);
  const BlogData = new Date(createdAt);

  const { axios, token } = useAppContext()

  const approvedComment = async () => {
    try {
    const {data} = await axios.post('/api/admin/approve-comment',{id:_id})

    if(data.success){
      toast.success(data.message)
      fetchComments()
    }else {
      toast.error(data.message)
    }
    }catch(error){
      toast.error(error.message)

    }
  }

   const deleteComment = async () => {
    try {

      const confirm = window.confirm('Are you sure you want to delete this comment?'); 
    const {data} = await axios.post('/api/admin/approve-comment',{id:_id})

    if(data.success){
      toast.success(data.message)
      fetchComments()
    }else {
      toast.error(data.message)
    }
    }catch(error){
      toast.error(error.message)

    }
  }

  return (
    <tr className="border-b">

      {/* Blog + Comment */}
      <td className="px-6 py-4">

        <p>
          <span className="font-medium">Blog:</span>{" "}
          {blog.title}
        </p>

        <p className="mt-2">
          <span className="font-medium">Name:</span>{" "}
          {name}
        </p>

        <p>
          <span className="font-medium">Comment:</span>{" "}
          {content}
        </p>

      </td>

      {/* Date */}
      <td className="px-6 py-4 max-sm:hidden">
        {date.toLocaleDateString()}
      </td>

      {/* Action */}
      <td className="px-6 py-4">

        <div className="flex items-center gap-4">

          {/* Approved → Tick */}
          {isApproved && (
            <img
              src={assets.tick_icon}
              className="w-6 cursor-pointer"
              alt="approved"
              onClick={() => onApprove(_id)}
            />
          )}

          {/* Not Approved → Button */}
          {!isApproved && (
            <button
              onClick={() => onApprove(_id)}
              className="border border-green-400 text-green-600 text-xs px-3 py-1 rounded-full hover:bg-green-50"
            >
              Approve
            </button>
          )}

          {/* Delete */}
          <img onClick={deleteComment}
            src={assets.bin_icon}
            className="w-5 cursor-pointer hover:scale-110"
            alt="delete"
          />

        </div>

      </td>

    </tr>
  );
};

export default CommentTableItem;
