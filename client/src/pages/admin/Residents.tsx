import * as XLSX from "xlsx";
import React, { useState, useEffect } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import AddResident from "../../components/admin/residents/AddResident";
import UpdateResident from "../../components/admin/residents/UpdateResident";
import DeleteResident from "../../components/admin/residents/DeleteResident";

interface Resident {
  readonly _id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly unit: string;
  readonly password: string;
  readonly __v: number;
}
export interface ClickedResidentInfo {
  readonly id: string;
  readonly coor: { x: number; y: number };
  readonly residentObj: Resident;
}
enum UpdateOrDelete {
  UPDATE = "Update",
  DELETE = "Delete",
  NOTSHOWN = "Not shown"
}

function Residents() {
  const [allResidents, setAllResidents] = useState<Resident[]>([]);
  const [toggleRerender, setToggleRerender] = useState<boolean>(false);
  const [contextmenuIsShown, setContextmenuIsShown] = useState<boolean>(false);
  const [clickedResidentInfo, setClickedResidentInfo] = useState<ClickedResidentInfo>({ id: "", coor: { x: 0, y: 0 }, residentObj: { _id: "", firstName: "", lastName: "", unit: "", password: "", __v: 0 } });
  const [updateOrDelete, setUpdateOrDelete] = useState<UpdateOrDelete>(UpdateOrDelete.NOTSHOWN);
  const [responseMessage, setResponseMessage] = useState<string>("");

  useEffect(() => {
    fetch("/admin/resident")
      .then((res: Response) => res.json())
      .then((data: Resident[]) => {
        setAllResidents(data);
      })
      .catch((err) => console.log(err));
  }, [toggleRerender]);

  useEffect(() => {
    window.addEventListener("click", () => {
      setContextmenuIsShown(false);
    });
  }, []);

  function handleSorting(e: React.MouseEvent<HTMLButtonElement>) {
    switch (e.currentTarget.dataset.column) {
      case "firstName":
        setAllResidents((prevAllResidents) => [...prevAllResidents.sort((a, b) => a.firstName.localeCompare(b.firstName))]);
        break;
      case "lastName":
        setAllResidents((prevAllResidents) => [...prevAllResidents.sort((a, b) => a.lastName.localeCompare(b.lastName))]);
        break;
      case "unit":
        setAllResidents((prevAllResidents) => [...prevAllResidents.sort((a, b) => Number(a.unit) - Number(b.unit))]);
        break;
      default:
        return;
    }
  }

  function handleContextmenu(e: React.MouseEvent<HTMLTableRowElement>): void {
    e.preventDefault();
    setClickedResidentInfo({ ...clickedResidentInfo, id: e.currentTarget.id, coor: { x: e.clientX, y: e.clientY } });
    setContextmenuIsShown(true);
  }

  function handleContextmenuClick(e: React.MouseEvent<HTMLButtonElement>): void {
    if (e.currentTarget.textContent === "Update") {
      setUpdateOrDelete(UpdateOrDelete.UPDATE);
    } else if (e.currentTarget.textContent === "Delete") {
      setUpdateOrDelete(UpdateOrDelete.DELETE);
    }
    setClickedResidentInfo({ ...clickedResidentInfo, residentObj: allResidents.filter((resident) => resident._id === clickedResidentInfo.id)[0] });
    setResponseMessage("");
  }

  function handleContextmenuClose(): void {
    setUpdateOrDelete(UpdateOrDelete.NOTSHOWN);
  }

  function handleUpdateFormChange(e: React.FormEvent<HTMLInputElement>): void {
    setClickedResidentInfo({ ...clickedResidentInfo, residentObj: { ...clickedResidentInfo.residentObj, [e.currentTarget.name]: e.currentTarget.value } });
  }

  async function handleUpdateSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    try {
      const res: Response = await fetch(`/admin/resident/${clickedResidentInfo.id}`, { method: "PUT", body: JSON.stringify(clickedResidentInfo.residentObj), headers: { "Content-Type": "application/json" } });
      const data: string = await res.text();
      setResponseMessage(data);
      setToggleRerender((prevToggleRerender) => !prevToggleRerender);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteClick(): Promise<void> {
    try {
      const res: Response = await fetch(`/admin/resident/${clickedResidentInfo.id}`, { method: "DELETE" });
      const data: string = await res.text();
      setResponseMessage(data);
      setToggleRerender((prevToggleRerender) => !prevToggleRerender);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleExportClick(): Promise<void> {
    try {
      const worksheet = XLSX.utils.json_to_sheet(allResidents);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Residents");
      XLSX.writeFile(workbook, "Residents.xlsx");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <main className="p-5 bg-gray-100">
        <nav className="flex justify-between mb-2">
          <h1 className="text-xl font-semibold">Residents</h1>
          <button className="bg-green-600 text-white py-0.5 px-3 rounded hover:bg-green-700 transition" onClick={handleExportClick}>
            Export
          </button>
        </nav>
        <div className="bg-white w-full rounded border-2">
          <table className="w-full">
            <thead>
              <tr className="text-left ">
                <th className="py-2">
                  First Name
                  <button onClick={handleSorting} data-column="firstName">
                    <ArrowsUpDownIcon className="h-5 w-5 inline cursor-pointer p-0.5 ml-1 text-gray-600 rounded hover:bg-gray-200" />
                  </button>
                </th>
                <th className="py-2">
                  Last Name
                  <button onClick={handleSorting} data-column="lastName">
                    <ArrowsUpDownIcon className="h-5 w-5 inline cursor-pointer p-0.5 ml-1 text-gray-600 rounded hover:bg-gray-200" />
                  </button>
                </th>
                <th className="py-2">
                  Unit
                  <button onClick={handleSorting} data-column="unit">
                    <ArrowsUpDownIcon className="h-5 w-5 inline cursor-pointer p-0.5 ml-1 text-gray-600 rounded hover:bg-gray-200" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {allResidents.map((resident) => (
                <tr key={resident._id} id={resident._id} className="odd:bg-gray-200 even:bg-gray-50 first:border-t border-gray-400 hover:bg-slate-300 cursor-pointer" onContextMenu={handleContextmenu}>
                  <td>{resident.firstName}</td>
                  <td>{resident.lastName}</td>
                  <td>{resident.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <section className="grid grid-cols-2 gap-2">
          <AddResident setToggleRerender={setToggleRerender} />
          {updateOrDelete === "Update" && <UpdateResident clickedResidentInfo={clickedResidentInfo} handleUpdateFormChange={handleUpdateFormChange} responseMessage={responseMessage} handleContextmenuClose={handleContextmenuClose} handleUpdateSubmit={handleUpdateSubmit} />} {updateOrDelete === "Delete" && <DeleteResident clickedResidentInfo={clickedResidentInfo} responseMessage={responseMessage} handleContextmenuClose={handleContextmenuClose} handleDeleteClick={handleDeleteClick} />}
        </section>
        {contextmenuIsShown && <Contextmenu clickedResidentInfo={clickedResidentInfo} handleContextmenuClick={handleContextmenuClick} />}
      </main>
    </>
  );
}

interface Props {
  readonly clickedResidentInfo: ClickedResidentInfo;
  readonly handleContextmenuClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function Contextmenu(props: Props) {
  return (
    <aside className="bg-white border border-slate-500 rounded fixed" style={{ left: props.clickedResidentInfo.coor.x, top: props.clickedResidentInfo.coor.y }}>
      <button className="block rounded-t px-1 text-left w-full hover:bg-slate-300 hover:text-green-600" onClick={props.handleContextmenuClick}>
        Update
        <PencilSquareIcon className="h-5 w-5 inline ml-2 mb-1 text-green-600" />
      </button>
      <button className="block rounded-b px-1 text-left w-full hover:bg-slate-300 hover:text-red-600" onClick={props.handleContextmenuClick}>
        Delete
        <TrashIcon className="h-5 w-5 inline ml-2 mb-1 text-red-600" />
      </button>
    </aside>
  );
}

export default Residents;
