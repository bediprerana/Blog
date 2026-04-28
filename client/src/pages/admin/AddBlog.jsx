import React, { useEffect, useRef, useState } from 'react'
import { assets, blogCategories } from '../../assets/assets'
import Quill from 'quill'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { parse } from 'marked'

const AddBlog = () => {

  const { axios, token } = useAppContext()

  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  const editorRef = useRef(null)
  const quillRef = useRef(null)

  const [image, setImage] = useState(false)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [category, setCategory] = useState('startup')
  const [isPublished, setIsPublished] = useState(false)


  /* ================= AI GENERATE ================= */

  const generateContent = async () => {

    if (!title) {
      return toast.error('Please enter blog title')
    }

    try {
      setLoading(true)

      const { data } = await axios.post(
        '/api/blog/generate',
        { prompt: title },
        {
          headers: {
            Authorization: `Bearer ${token}`   // ✅ Important
          }
        }
      )

      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content)
        toast.success('Content generated')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || 'AI generation failed')
    }
    finally {
      setLoading(false)
    }
  }


  /* ================= ADD BLOG ================= */

  const onSubmitHandler = async (e) => {

    e.preventDefault()

    try {

      setIsAdding(true)

      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished
      }

      const formData = new FormData()

      formData.append('parse', JSON.stringify(blog))
      formData.append('image', image)

      const { data } = await axios.post(
        '/api/blog/add',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (data.success) {

        toast.success(data.message)

        setImage(false)
        setTitle('')
        setSubTitle('')
        setCategory('startup')
        setIsPublished(false)

        quillRef.current.root.innerHTML = ''

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || 'Blog upload failed')
    }
    finally {
      setIsAdding(false)
    }
  }


  /* ================= QUILL INIT ================= */

  useEffect(() => {

    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow'
      })
    }

  }, [])


  /* ================= UI ================= */

  return (

    <form
      onSubmit={onSubmitHandler}
      className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'
    >

      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>


        {/* Upload Image */}

        <p>Upload thumbnail</p>

        <label htmlFor="image">

          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt=""
            className='mt-2 h-16 rounded cursor-pointer'
          />

          <input
            type="file"
            id='image'
            hidden
            required
            onChange={(e) => setImage(e.target.files[0])}
          />

        </label>


        {/* Title */}

        <p className='mt-4'>Blog Title</p>

        <input
          type="text"
          required
          placeholder='Type here'
          className='w-full max-w-lg mt-2 p-2 border rounded'
          value={title}
          onChange={e => setTitle(e.target.value)}
        />


        {/* Subtitle */}

        <p className='mt-4'>Sub title</p>

        <input
          type="text"
          required
          placeholder='Type here'
          className='w-full max-w-lg mt-2 p-2 border rounded'
          value={subTitle}
          onChange={e => setSubTitle(e.target.value)}
        />


        {/* Description */}

        <p className='mt-4'>Blog Description</p>

        <div className='max-w-lg pb-16 pt-2 relative'>

          <div ref={editorRef}></div>

          <button
            type='button'
            disabled={loading}
            onClick={generateContent}
            className='absolute bottom-1 right-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded'
          >
            {loading ? 'Generating...' : 'Generate with AI'}
          </button>

        </div>


        {/* Category */}

        <p className='mt-4'>Blog Category</p>

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className='mt-2 px-3 py-2 border rounded'
        >

          <option value="">Select category</option>

          {blogCategories.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}

        </select>


        {/* Publish */}

        <div className='flex gap-2 mt-4'>

          <p>Publish Now</p>

          <input
            type="checkbox"
            checked={isPublished}
            className='scale-125 cursor-pointer'
            onChange={e => setIsPublished(e.target.checked)}
          />

        </div>


        {/* Submit */}

        <button
          disabled={isAdding}
          type="submit"
          className='mt-8 w-40 h-10 bg-primary text-white rounded text-sm'
        >

          {isAdding ? 'Adding...' : 'Add Blog'}

        </button>

      </div>

    </form>
  )
}

export default AddBlog
