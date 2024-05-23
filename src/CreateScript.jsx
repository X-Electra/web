import React, { useEffect, useState, useCallback } from "react";
import { IoIosAddCircle } from "react-icons/io";
import axios from "axios";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function CreateScript() {
  const [envVariables, setEnvVariables] = useState([
    { key: "SUDO", value: "" },
  ]);
  const [bash, setBash] = useState("");
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState("termux");

  const addEnvVariable = useCallback(() => {
    setEnvVariables((prev) => [...prev, { key: "", value: "" }]);
  }, []);

  const handleInputChange = useCallback((index, event) => {
    const { name, value } = event.target;
    setEnvVariables((prev) => {
      const newEnvVariables = [...prev];
      newEnvVariables[index][name] =
        name === "key" ? value.toUpperCase() : value;
      return newEnvVariables;
    });
  }, []);

  useEffect(() => {
    console.log(platform);
  }, [platform]);

  const handlePlatformChange = useCallback((event) => {
    setPlatform(event.target.value);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { "git-url": gitUrl, startScript } = event.target.elements;
    const data = {
      config: envVariables,
      git: gitUrl.value,
      start: startScript.value,
      platform: platform, // Pass platform to the data object
    };
    try {
      const response = await axios.post(
        "https://api.thexapi.xyz/genBash",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setBash(response.data.data.bash);
      setOpen(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(bash);
    alert("Bash script copied to clipboard!");
  }, [bash]);
  return (
    <div className="w-screen h-screen overflow-y-auto bg-[url(./images/header-background.jpg)] flex flex-col justify-center items-center">
      <div className="bg-white flex flex-col p-10 rounded-xl">
        <h1 className="text-3xl font-bold text-center">Create Bot Script</h1>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
          <label className="font-medium">ENV</label>
          {envVariables.map((env, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex gap-5 items-center">
                <input
                  type="text"
                  name="key"
                  value={env.key}
                  onChange={(event) => handleInputChange(index, event)}
                  required
                  className="mt-1 block w-1/2 shadow-sm border p-3 outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                  placeholder="KEY"
                />
                <input
                  type="text"
                  name="value"
                  value={env.value}
                  onChange={(event) => handleInputChange(index, event)}
                  required
                  className="mt-1 block w-1/2 shadow-sm border p-3 outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                  placeholder={
                    env.key === "SUDO" ? "ENTER YOUR NUMBER" : "VALUE"
                  }
                />
                {index === envVariables.length - 1 && (
                  <IoIosAddCircle
                    onClick={addEnvVariable}
                    className="text-4xl cursor-pointer"
                  />
                )}
              </div>
              {env.key === "SUDO" && env.value.length < 10 && (
                <div className="text-left max-w-[400px] px-2">
                  <p className="text-red-500">
                    Make sure to enter your number in the value field separated
                    by commas for multiple numbers.
                  </p>
                </div>
              )}
            </div>
          ))}

          <div className="flex flex-col gap-2">
            <label htmlFor="git-url" className="font-medium">
              Github URL <span className="opacity-50">(optional)</span>
            </label>
            <input
              type="url"
              id="git-url"
              name="git-url"
              className="mt-1 block w-full shadow-sm border p-3 h-12 outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter your git URL here"
            />
            <div className="text-center px-2">
              <a
                href="https://github.com/X-Electra/X-Asena/fork"
                className="text-blue-700"
              >
                Fork the repo for URL
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="startScript" className="font-medium">
              Start Script <span className="opacity-50">(optional)</span>
            </label>
            <input
              type="text"
              id="startScript"
              name="startScript"
              className="mt-1 block w-full shadow-sm border p-3 outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter your start script here"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="termux" className="font-medium">
              Choose the platform
            </label>
            <div className="flex gap-3">
              <input
                type="radio"
                id="termux"
                onChange={handlePlatformChange}
                name="platform"
                value="termux"
                checked={platform === "termux"}
              />
              <label htmlFor="termux">Termux</label>
            </div>
            <div className="flex gap-3">
              <input
                type="radio"
                id="ubuntu"
                onChange={handlePlatformChange}
                name="platform"
                value="ubuntu"
                checked={platform === "ubuntu"}
              />
              <label htmlFor="ubuntu">Ubuntu</label>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Note: You can leave the Github URL and Start Script fields empty.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="mt-5 bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Create Script
            </button>
          </div>
        </form>

        <Popup
          open={open}
          className="rounded-lg"
          onClose={() => setOpen(false)}
          modal
          closeOnDocumentClick
        >
          <div className="p-5">
            <h2 className="text-2xl font-bold mb-4">Generated Bash Script</h2>
            <textarea
              className="w-full h-40 p-2 border border-gray-300 rounded-md"
              readOnly
              value={bash}
            ></textarea>
            <div>
              <p className="text-sm text-gray-500 mt-2">
                Copy the script and run it in your terminal.
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCopy}
                className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </Popup>
      </div>
    </div>
  );
}

export default CreateScript;
