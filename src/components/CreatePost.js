// Module Imports
import React, { useState, useEffect } from "react";
import axios from "axios"; //npm i axios
//import { toast } from "wc-toast"; //npm i wc-toast
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//File Imports (CSS/Images)
import "../css/color_scheme.css";

//Component Creation
const CreatePost = () => {
  //Defining States
  const [isLoadingSubreaddits, setIsLoadingSubreaddits] = useState(true);
  const [isLoadingFlairs, setIsLoadingFlairs] = useState(true);
  const [subreaddits, setSubreaddits] = useState([]);
  const [flairs, setFlairs] = useState([]);
  const baseUrl = [process.env.REACT_APP_BASEURL1, process.env.REACT_APP_BASEURL2];

  //Component variables
  //Using temporary token until logging in is complete
  const tempToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ0eXBlIjoyLCJpYXQiOjE2NDA3NzM0NDAsImV4cCI6MTY0MDg1OTg0MH0.abDuIO5BsYxwO0vfuwuciCB6ITSjVRs9jVt75O3iIeI";
  let mediaFormCount = 0; //Used to keep tract of number of media fields.
  let errorMessage = "Post Creation Failed!"; //Used to store errors.
  const toastId = React.useRef(null);
  const styles = {
    badge: {
      fontSize: 25,
      fontWeight: "bold",
    },
  };

  //Getting Subreaddits for user to select which subreaddit to submit to
  function getSubreaddits() {
    axios
      .get(`https://readdit-backend.herokuapp.com/r/subreaddits`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((data) => {
        let subreadditArr = data.data.Result;
        setSubreaddits(subreadditArr);
        setIsLoadingSubreaddits(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Getting selected subreaddit id, then calling showFlairs() to retrieve the flairs in that subreaddit
  function selectedSubreadditId() {
    let currentSubreadditId = document.getElementById("create_post_community").value;
    showFlairs(currentSubreadditId);
  }

  //display flairs that belong to the subreaddit, called by selectedSubreadditId()
  //takes in one argument, which is the subreaddit_id
  function showFlairs(subreaddit_id) {
    axios
      .get(`https://readdit-backend.herokuapp.com/flair/` + subreaddit_id, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      .then((data) => {
        let flairArr = data.data.Result;
        setFlairs(flairArr);

        if (flairArr.length == 0) {
          document.getElementById("no_flairs").hidden = false;
          document.getElementById("flair_section").hidden = true;
        } else {
          document.getElementById("no_flairs").hidden = true;
          document.getElementById("flair_section").hidden = false;
        }
        console.log(flairArr);
        setIsLoadingFlairs(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Generate media fields to attach images, videos or GIFs
  function addMediaField() {
    if (mediaFormCount < 8) {
      mediaFormCount++;
      var mediaFormHTML = document.getElementById("media_form");
      var tmp = document.createElement("div");
      tmp.classList.add("input-group");
      tmp.classList.add("mb-3");
      tmp.innerHTML = `<label class="input-group-text" for="inputGroupFile01">Media ${mediaFormCount}</label>
      <input type="file" class="form-control media" id="inputGroupFile01">`;
      mediaFormHTML.append(tmp);
    } else {
      toast.error("Maximum of 8 media fields reached.");
    }
  }

  function submitPost() {
    var loadingAnim = document.getElementById("post_loading_div");
    var subreaddit_id = document.getElementById("create_post_community").value;
    console.log(subreaddit_id);
    var subreaddit_name;
    try {
      var subreaddit_name = document.getElementById(`subreaddit_id_${subreaddit_id}`).text;
    } catch (err) {
      var subreaddit_name = null;
    }

    var title = document.getElementById("create_post_title").value;
    var content = document.getElementById("create_post_content").value;
    var fk_flair_id = document.getElementById("create_post_flair").value;

    if (subreaddit_id == "Choose a Community") {
      toast.error("Please select a subreaddit to post in!");
    } else if (title.trim() == "") {
      toast.error("Post title cannot be blank!");
    } else {
      loadingAnim.classList.remove('d-none');
      let webFormData = new FormData();
      webFormData.append("title", title);
      webFormData.append("content", content);
      webFormData.append("subreaddit_id", subreaddit_id);
      webFormData.append("fk_flair_id", fk_flair_id);
      var media = document.getElementsByClassName("media");
      for (var i = 0; i < media.length; i++) {
        webFormData.append("media", media[i].files[0]);
      }

      toast.promise(
        new Promise((resolve, reject) => {
          axios
            .request({
              method: "post",
              url: "https://readdit-backend.herokuapp.com/post/create",
              headers:{
                "Authorization": "Bearer " + tempToken,
                "content-type" : "multipart/form-data"
              },
              data: webFormData,
              onUploadProgress: (p) => {
                const progress = p.loaded / p.total;

                // check if we already displayed a toast
                if (toastId.current === null) {
                  toastId.current = toast("Uploading Media Files...", {
                    progress: progress,
                  });
                } else {
                  toast.update(toastId.current, {
                    progress: progress,
                  });
                }
              },
            })
            .then((data) => {
              var post_id = data.data.Result.post_id || data.data.Result.fk_post_id;
              loadingAnim.classList.add('d-none');
              setTimeout(function () {
                window.location.assign(`${baseUrl[1]}/r/${subreaddit_name}/${post_id}.html`);
              }, 2000);
              resolve(true);
            })
            .catch((error) => {
              loadingAnim.classList.add('d-none');
              errorMessage = error.response.data.message;
              console.log(error.response.data.message);
              console.log(errorMessage);
              reject(error.response.data.message);
            });
        }),
        {
          pending: "Submitting Post...",
          success: "Post Created! Redirecting...",
          error:  {render({data}){
            return `${data}`
          }},
        }
      );
    }
  }

  useEffect(() => {
    getSubreaddits();
    console.log(baseUrl[0]);
  }, []);

  return (
    <React.Fragment>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick limit={3} transition={Slide} rtl={false} theme="dark" pauseOnFocusLoss draggable pauseOnHover />
      {/* <wc-toast></wc-toast> */}
      <div className="container-xxl my-md-4">
        <div className="row">
          <div className="col-lg-8">
            <h4 className="fw-bold text-scheme">Create a Post</h4>
            <hr />
            <div className="position-relative">
              <div id="post_creation_div">
                <div className=" mb-2 bg-white body-borders rounded shadow-sm">
                  <form className="">
                    <div className="px-3 pt-3">
                      <div className="input-group mb-3">
                        <label className="input-group-text" htmlFor="create_post_community">
                          r/
                        </label>
                        <select
                          className="form-select body-borders"
                          id="create_post_community"
                          onChange={() => {
                            selectedSubreadditId();
                          }}
                          defaultValue={"Choose a Community"}
                        >
                          <option disabled>Choose a Community</option>
                          {isLoadingSubreaddits ? (
                            <option id="loading" value="loading">
                              Loading...
                            </option>
                          ) : (
                            subreaddits.map((data) => (
                              <option key={data.subreaddit_id} id={"subreaddit_id_" + data.subreaddit_id} value={data.subreaddit_id}>
                                {data.subreaddit_name}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="bg-white body-borders rounded shadow-sm">
                  <form>
                    <div className="px-3 pt-3">
                      <h5>Post</h5>
                      <div className="form-floating mb-3">
                        <input type="text" className="form-control form-control-sm" id="create_post_title" placeholder="Name your post" />
                        <label htmlFor="create_post_title" className="text-secondary">
                          Title
                        </label>
                      </div>
                      <div className="form-floating mb-3">
                        <textarea className="form-control" placeholder="Leave some text here" id="create_post_content" style={{ height: "100px" }}></textarea>
                        <label htmlFor="create_post_content" className="text-secondary">
                          Text (optional)
                        </label>
                      </div>
                      <h5>Images & Video</h5>
                      <div id="media">
                        <div id="add_media_form" className="mb-3">
                          <input type="button" id="add_media_form_button" value="Add media field" className="btn btn-light w-100 rounded-pill" onClick={() => addMediaField()} />
                        </div>
                        <div id="media_form"></div>
                      </div>
                      <h5 className="mb-2">Flairs</h5>
                      <p id="no_flairs">Selected Subreaddit has no flairs yet.</p>
                      <div className="input-group mb-3" id="flair_section" hidden>
                        <select className="form-select body-borders" id="create_post_flair" defaultValue={"No Flair Chosen - choose flair?"}>
                          <option disabled value={null}>
                            No Flair Chosen - choose flair?
                          </option>
                          {isLoadingFlairs ? (
                            <option id="loading" value="loading">
                              Loading...
                            </option>
                          ) : (
                            flairs.map((data) => (
                              <option key={data.flair_id} id={"flair_id_" + data.flair_id} value={data.flair_id}>
                                {data.flair_name}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                      <div id="msg"></div>
                    </div>
                    <div className="d-flex flex-row py-2" id="create_community_footer">
                      <div className="flex-grow-1"></div>
                      <input type="button" id="create_post_cancel" value="Cancel" className="btn me-3 rounded-pill" />
                      <input type="button" id="create_post_submit" value="Submit" className="btn btn-dark me-3" onClick={() => submitPost()} />
                    </div>
                  </form>
                </div>
              </div>
              <div id="post_loading_div" className="anim d-none">
                <div className="d-flex flex-column h-100">
                  <div className="flex-grow-1"></div>
                  <div>
                    <div className="bg-white d-inline-block px-3 py-2 align-bottom mb-2 ms-2 body-borders shadow rounded">
                      <h5 className="fw-bold mb-0">Your post is being uploaded. This might take a while.</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="bg-white">
              <div className="bg-white mb-2 body-borders rounded p-3">
                <h5 className="text-scheme fw-bold">Post Guidelines</h5>
                <hr className="mt-2" />
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    1. <span className="fw-bold"> Remember the Human</span>
                  </li>
                  <li className="list-group-item">
                    2. <span className=""> Be ethical</span>
                  </li>
                  <li className="list-group-item">
                    3. <span className=""> Respect others' privacy</span>
                  </li>
                  <li className="list-group-item">
                    4. <span className=""> Keep disagreements healthy.</span>
                  </li>
                  <li className="list-group-item">
                    5. <span className=""> Reposting is heavily discouraged.</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white body-borders rounded p-2">
              <div className="row">
                <div className="col-6">
                  <div className="d-flex flex-column">
                    <a className="text-muted text-decoration-none smaller">About</a>
                    <a className="text-muted text-decoration-none smaller">Content Policy</a>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex flex-column">
                    <a className="text-muted text-decoration-none smaller">Help</a>
                    <a className="text-muted text-decoration-none smaller">Terms & Condition</a>
                  </div>
                </div>
              </div>
              <p className="mb-0 mt-2 smaller">Play2Win © 2021 . All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CreatePost;
