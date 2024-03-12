import React, { useEffect, useState } from "react";
import Navbar from "../navigation/Navbar";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import axios from "axios";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Salesdata = () => {
  const token = Cookies.get("token");
  const [getdataSales, setGetDataSales] = useState([]);
  const [formData, setFormData] = useState({
    date: formatDate(new Date()),
    customer: "",
    payment: "",
    amount_of_product: "",
    notes: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editedId, setEditedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const formattedDate = formData.date;
      const dataToSend = { ...formData, date: formattedDate };
      if (editMode) {
        response = await axios.patch(
          `http://localhost:3000/user/salesdata/update/${editedId}`,
          dataToSend,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "http://localhost:3000/user/input",
          dataToSend,
          {
            headers: {
              "Content-Type": "application/json",
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
        setFormData({
          date: formatDate(new Date()),
          customer: "",
          payment: "",
          amount_of_product: "",
          notes: "",
        });
        setEditMode(false);
        setEditedId(null);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Failed to submit: ${
          error.response.data.message || "Unknown error"
        }`,
      });
    }
  };

  const handleEdit = async (id) => {
    try {
      const editResponse = await axios.get(
        `http://localhost:3000/user/salesdata/${id}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const { date, customer, payment, amount_of_product, notes } =
        editResponse.data;
      setFormData({
        date,
        customer,
        payment,
        amount_of_product: String(amount_of_product),
        notes,
      });
      setEditMode(true);
      setEditedId(id);
      document.getElementById("my_modal_6").click();
    } catch (error) {
      console.error("Failed For Update Table", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch data for editing. Please try again later.",
      });
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
            `http://localhost:3000/user/salesdata/delete/${id}`,
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
            }, 1000);
          }
        } catch (error) {
          console.error("Failed Dalate Data", error);
        }
      }
    });
  };

  const getData = async () => {
    try {
      const dataResponse = await axios.get(
        "http://localhost:3000/user/salesdata",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setGetDataSales(dataResponse.data.data);
    } catch (error) {
      console.error("Failed Get Data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch data. Please try again later.",
      });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = getdataSales.filter((item) => {
    return (
      item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.payment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.amount_of_product.toString().includes(searchTerm) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <label htmlFor="my_modal_6" className="btn btn-info mt-20 w-28 ml-5">
          Input Data
        </label>
        <input type="checkbox" id="my_modal_6" className="modal-toggle" />
        <div className="modal" role="dialog">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Form</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-rows-6 grid-flow-col gap-1 lg:gap-0 md:gap-0 mt-5">
                <input
                  type="date"
                  placeholder="Date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input input-bordered w-full max-w-xs"
                />
                <input
                  type="text"
                  placeholder="Customer"
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  className="input input-bordered w-full max-w-xs"
                />
                <select
                  className="select select-bordered w-full max-w-xs"
                  name="payment"
                  value={formData.payment}
                  onChange={handleChange}
                >
                  <option value="">Payment</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit">Credit</option>
                  <option value="No cash & Credit">No cash & Credit</option>
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  name="amount_of_product"
                  value={formData.amount_of_product}
                  onChange={handleChange}
                  className="input input-bordered w-full max-w-xs"
                />
                <textarea
                  className="textarea textarea-bordered"
                  placeholder="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
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

        <div className="overflow-x-auto mt-10">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Sales</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.date.split("T")[0]}</td>
                  <td>{item.customer}</td>
                  <td>{item.sales_person}</td>
                  <td>{item.payment}</td>
                  <td>{item.amount_of_product}</td>
                  <td>
                    <button
                      className="btn btn-warning w-26"
                      onClick={() =>
                        document
                          .getElementById(`my_modal_${item.id}`)
                          .showModal()
                      }
                    >
                      See Notes
                    </button>
                    <dialog id={`my_modal_${item.id}`} className="modal">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg"></h3>
                        <p className="py-4">{item.notes}</p>
                      </div>
                      <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                      </form>
                    </dialog>
                  </td>
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
            <tfoot>
              <tr>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Sales</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex justify-center p-4">
          <div className="join">{renderPagination()}</div>
        </div>
      </div>
    </>
  );
};

export default Salesdata;
