import React from "react";

const Dashboard = () => {
  return (
    <>
      <div className="container mx-auto">
        {/* modal input */}
        <label htmlFor="my_modal_6" className="btn btn-info mt-20 w-28 ml-5">
          Input Data
        </label>
        <input type="checkbox" id="my_modal_6" className="modal-toggle" />
        <div className="modal" role="dialog">
          <div className="modal-box">
            <h3 className="font-bold text-lg">KETERAMPILAN</h3>
            <form>
              <div className="grid grid-rows-4 grid-flow-col gap-1 lg:gap-0 md:gap-0 mt-5">
                <input
                  type="date"
                  placeholder="Date"
                  name="Date"
                  value=""
                  className="input input-bordered w-full max-w-xs"
                />
                <input
                  type="text"
                  placeholder="Customer"
                  className="input input-bordered w-full max-w-xs"
                />

                <select className="select select-bordered w-full max-w-xs">
                  <option disabled selected>
                    Payment
                  </option>
                  <option>Cash</option>
                  <option>Credit</option>
                  <option>No chas & Credit</option>
                </select>
                <textarea
                  className="textarea textarea-bordered"
                  placeholder="Bio"
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

        {/* modal input end */}

        <div className="overflow-x-auto mt-10">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Sales</th>
                <th>Payment</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <th>1</th>
                <td>2024-03-11</td>
                <td>
                  Zemlak, Daniel and Leannon
                  <br />
                </td>
                <td>Ahmad Syarif</td>
                <td>Chas</td>
                <td>
                  <button
                    className="btn btn-warning w-26"
                    onClick={() =>
                      document.getElementById("my_modal_2").showModal()
                    }
                  >
                    See Notes
                  </button>
                  <dialog id="my_modal_2" className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Hello!</h3>
                      <p className="py-4">
                        Press ESC key or click outside to close
                      </p>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
                </td>
              </tr>
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th>Invoce No</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Sales</th>
                <th>Payment</th>
                <th>Notes</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
