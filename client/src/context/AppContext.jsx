const onSubmitHandler = async (e) => {

  e.preventDefault();

  if (!image) {
    return toast.error("Please upload image");
  }

  if (!title || !subTitle) {
    return toast.error("Fill all fields");
  }

  try {

    setIsAdding(true);

    const blog = {
      title,
      subTitle,
      description: quillRef.current.root.innerHTML,
      category,
      isPublished
    };

    const formData = new FormData();

    formData.append("parse", JSON.stringify(blog));
    formData.append("image", image);


    const { data } = await axios.post(
      "/api/blog/add",
      formData
    );


    if (data.success) {

      toast.success("Blog added successfully");

      setTitle("");
      setSubTitle("");
      setImage(false);
      setCategory("startup");
      setIsPublished(false);

      quillRef.current.root.innerHTML = "";

    } else {
      toast.error(data.message);
    }

  } catch (error) {

    console.log(error);

    toast.error(
      error?.response?.data?.message || "Upload failed"
    );

  } finally {
    setIsAdding(false);
  }
};
