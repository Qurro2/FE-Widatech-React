import React, { useState, useEffect } from "react";
import Navbar from "../navigation/Navbar";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";

const Product = () => {
  const token = Cookies.get("token");
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    stock: "",
    price: "",
  });
  const [dataProduct, setDataProduct] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedId, setEditedId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    getDataDashboard();
  }, [currentPage, searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.price) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Harap isi semua bidang",
      });
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("image", formData.image);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("price", formData.price);
      let response;
      if (editMode) {
        response = await axios.patch(
          `http://localhost:3000/user/products/update/${editedId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:3000/user/products",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${token}`,
            },
          }
        );
      }
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: editMode ? "Berhasil update data" : "Berhasil membuat data",
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);

        // Setel kembali nilai-nilai formData setelah berhasil
        setFormData({
          image: null,
          name: "",
          stock: "",
          price: "",
        });
        setEditMode(false);
        setEditedId(null);
      }
    } catch (error) {
      console.error("Failed Submit Data", error);
    }
  };

  const getDataDashboard = async () => {
    try {
      const productResponse = await axios.get(
        `http://localhost:3000/user/product?page=${currentPage}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setDataProduct(productResponse.data.data);
    } catch (error) {
      console.error("Error getting data dashboard", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const responseDeleteProject = await axios.delete(
            `http://localhost:3000/user/products/delete/${id}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          if (responseDeleteProject.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Berhasil menghapus data",
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000); // Refresh data after deletion
          }
        } catch (error) {
          console.error("Gagal menhapus data project", error);
        }
      }
    });
  };

  const handleEdit = async (id) => {
    try {
      const editResponse = await axios.get(
        `http://localhost:3000/user/product/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const { name, image, stock, price } = editResponse.data.data; // Sesuaikan dengan format data response API Anda
      setFormData({
        image: null,
        name: name,
        stock: stock,
        price: price,
      });
      setEditMode(true);
      setEditedId(id);
      document.getElementById("my_modal_6").click();
    } catch (error) {
      console.error("Failed to edit project", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Data not found!",
      });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = dataProduct.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalFilteredItems = filteredData.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const renderPagination = () => {
    const pageButtons = [];
    if (totalPages > 1) {
      pageButtons.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(currentPage - 1)}
          className="join-item btn"
          disabled={currentPage === 1}
        >
          «
        </button>
      );
      pageButtons.push(
        <button
          key={currentPage}
          onClick={() => setCurrentPage(currentPage)}
          className="join-item btn"
        >
          Page {currentPage}
        </button>
      );
      pageButtons.push(
        <button
          key="next"
          onClick={() => setCurrentPage(currentPage + 1)}
          className="join-item btn"
          disabled={currentPage === totalPages}
        >
          »
        </button>
      );
    }
    return pageButtons;
  };
  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        {/* modal input */}
        <label htmlFor="my_modal_6" className="btn btn-info mt-20 w-28 ml-5">
          Input Data
        </label>
        <input type="checkbox" id="my_modal_6" className="modal-toggle" />
        <div className="modal" role="dialog">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Product</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-rows-6 grid-flow-col gap-3  mt-5">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  onChange={handleChange}
                  className="input input-bordered w-full max-w-xs"
                />
                <label className="form-control">
                  <input
                    type="file"
                    placeholder="image"
                    name="image"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full max-w-xs"
                  />
                </label>
                <input
                  type="number"
                  placeholder="Stock"
                  name="stock"
                  onChange={handleChange}
                  className="input input-bordered w-full max-w-xs"
                />
                <input
                  type="number"
                  placeholder="Price"
                  name="price"
                  onChange={handleChange}
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-success">
                  Simpan
                </button>
                <label htmlFor="my_modal_6" className="btn btn-error">
                  Batal
                </label>
              </div>
            </form>
          </div>
        </div>

        <div className="flex justify-end ">
          <input
            type="text"
            placeholder="Cari..."
            className="input input-bordered max-w-xs"
            onChange={handleSearch}
          />
        </div>
        {/* modal input end */}

        <div className="overflow-x-auto mt-10">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Photo</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row */}
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-16 h-16">
                          {item.image && (
                            <img
                              src={`http://localhost:3000/${item.image}`}
                              alt="Product"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{item.stock}</td>
                  <td>{item.price}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-error"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrashAlt />
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(item.id)}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Photo</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </tfoot>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-center p-4">
          <div className="join">{renderPagination()}</div>
        </div>
      </div>
    </>
  );
};

export default Product;
