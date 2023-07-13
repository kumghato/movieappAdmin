import axios from "axios";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function Movies() {
  const [popUp, setPopUp] = useState(false)
  const [id, setId] = useState("")
  const [singleData, setSingleData] = useState({})
  const [data, setData] = useState([]);
  const [preview, setPreview] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [movieData, setMovieData] = useState({
    name: "",
    director: "",
    producer: "",
    releaseDate: "",
    image: ""
  })

  let navigate = useNavigate();
  let token = localStorage.getItem("myapptoken");
  const checkLogin = () => {
    if (!token) {
      navigate("/");
    }
  };
  const fetchSingleData = async () => {
    const res = await axios.get(`http://localhost:8000/get/movie/${id}`, {
      headers: {
        Authorization: localStorage.getItem('myapptoken')
      }
    })
    console.log(res)
    setSingleData(res.data.response)
  }

  const fetchData = async () => {
    const res = await axios.get("http://localhost:8000/get/all/movies", {
      headers: {
        Authorization: localStorage.getItem('myapptoken')
      }
    });
    console.log(res.data.response)
    if (res.data.status === 1) {
      setData(res.data.response);
    }
  };

  const deleteData = async (_id) => {
    const res = await axios.delete(`http://localhost:8000/delete/movie/${_id}`, {
      headers: {
        Authorization: localStorage.getItem('myapptoken')
      }
    });
    if (res.status === 200) {
      toast.success("Deleted successfully")
    }
    fetchData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formdata = new FormData()
    Object.entries(movieData).forEach(([key, value]) => {
      formdata.append(key, value)
    })

    const submit = await axios.post("http://localhost:8000/create/movies", formdata, {
      headers: {
        Authorization: localStorage.getItem('myapptoken')
      }
    })
    if (submit.status === 200) {
      toast.success("Movie added")
    }
    fetchData()
    setMovieData({
      name: "",
      director: "",
      producer: "",
      releaseDate: "",
      image: ""
    })
    setPreview(null)
  }
  const handleUpdate = async () => {
    const update = await axios.put(`http://localhost:8000/update/movie/${id}`, singleData, {
      headers: {
        Authorization: localStorage.getItem('myapptoken')
      }
    })
    fetchData()
  }

  const handleChange = (e) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value })

  }
  const handleEditChange = (e) => {
    setSingleData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  }
  const handleLogout = () => {
    localStorage.removeItem("myapptoken")
    navigate("/")
  }
  const toggle = async (id) => {
    await setPopUp(!popUp)
    setId(id)
  }

  useEffect(() => {
    fetchData();
    checkLogin()
  }, []);

  useEffect(() => {
    if (id !== "") {
      fetchSingleData()
    }
  }, [id])

  const handleFileChange = (e) => {
    console.log(e.target.files)
    const [file] = e.target.files

    setMovieData({ ...movieData, image: file })
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
  }


  return (
    <div className="p-5 text-center">
      <div class="container px-5 my-5">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card border-0 rounded-3 shadow-lg">
              <div class="card-body p-4">
                <div class="text-center">
                  <div class="h1 fw-light">Add Movie</div>
                </div>
                <form id="contactForm" data-sb-form-api-token="API_TOKEN">
                  <div class="form-floating mb-3">
                    {preview !== null && <img src={preview} width={"300px"} height={"500px"} />}
                  </div>
                  <div class="form-floating mb-3">
                    <input class="form-control" name="name" type="text" placeholder="Name" value={movieData.name} data-sb-validations="required" onChange={handleChange} />
                    <label for="name">Name</label>
                  </div>

                  <div class="form-floating mb-3">
                    <input class="form-control" name="director" type="text" value={movieData.director} placeholder="Email Address" data-sb-validations="required,email" onChange={handleChange} />
                    <label for="emailAddress">Director</label>
                  </div>

                  <div class="form-floating mb-3">
                    <input class="form-control" name="producer" value={movieData.producer} type="text" placeholder="Email Address" data-sb-validations="required,email" onChange={handleChange} />
                    <label for="emailAddress">Producer</label>
                  </div>

                  <div class="form-floating mb-3">
                    <input class="form-control" name="releaseDate" value={movieData.releaseDate} type="text" placeholder="Email Address" data-sb-validations="required,email" onChange={handleChange} />
                    <label for="emailAddress">Release Date</label>
                  </div>

                  <div class="form-floating mb-3">
                    <input class="form-control"
                      name="image"
                      type="file"
                      data-sb-validations="required,email"
                      onChange={(e) => { handleFileChange(e) }} />
                    <label for="">Image</label>
                  </div>

                  <div class="d-grid">
                    <button class="btn btn-danger btn-lg" id="submitButton" type="submit" onClick={(e) => { handleSubmit(e) }} >Submit</button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
      <table class="table m-auto w-75 table-hover  mt-5">
        <thead>
          <tr className="text-center">
            <th scope="col">S.No</th>
            <th scope="col">Image</th>
            <th scope="col">Name of the Movie</th>
            <th scope="col">Name of the Director</th>
            <th scope="col">Name of the Producer</th>
            <th scope="col">Date of Release</th>
            <th scope="col">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => {
            return (
              <tr className="text-center">
                <th>{i + 1}</th>
                <th>{item.image ? <img src={`http://localhost:8000/${item.image}`} width={"90px"} height={"90px"} /> : ""}</th>
                <td>{item.name}</td>
                <td>{item.director}</td>
                <td>{item.producer}</td>
                <td>{item.releaseDate}</td>
                <td>
                  <button className="btn btn-danger px-4 me-2" onClick={() => toggle(item._id)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => { deleteData(item._id); }}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button className="btn btn-danger mt-5 px-4 py-2" onClick={handleLogout}>logout</button>

      <Modal isOpen={popUp} toggle={() => setPopUp(!popUp)}>
        <ModalHeader>
          <h1 className="p-3">Movie Info</h1>
        </ModalHeader>
        <ModalBody className="d-flex modal">
          <label className="mt-3">Name</label>
          <input placeholder="Name" name="name" value={singleData.name} onChange={(e) => handleEditChange(e)} className="py-2" />
          <label className="mt-3" >Director</label>
          <input placeholder="Director" name="director" className="py-2" value={singleData.director} />
          <label className="mt-3">Producer</label>
          <input placeholder="Producer" name="producer" className="py-2" value={singleData.producer} />
          <label className="mt-3">Release Date</label>
          <input placeholder="Release Date" name="releaseDate" className="py-2" value={singleData.releaseDate} />
        </ModalBody>
        <ModalFooter>
          <button class="btn btn-danger btn-lg" id="submitButton" type="submit" onClick={handleUpdate} >Submit</button>
        </ModalFooter>
      </Modal>
      <Toaster />
    </div>
  );
}

export default Movies;
