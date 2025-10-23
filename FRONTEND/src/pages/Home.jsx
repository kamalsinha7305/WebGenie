import React, { useState } from 'react';
// Navbar is not provided, but I'm keeping the import based on your original code
import Navbar from '../components/Navbar';
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Home = () => {

  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-js', label: 'HTML + Tailwind + JS' }, // Corrected an option
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // This function now calls our secure serverless function
  async function getResponse() {
    if (!prompt.trim()) return toast.error("Please describe your component first");

    try {
      setLoading(true);
      // Make a request to our new backend API endpoint
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          framework: frameWork.value,
        }),
      });

      if (!response.ok) {
        // If the server response is not ok, throw an error
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await response.json();
      setCode(data.code);
      setOutputScreen(true);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Copy Code
  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  };

  // ✅ Download Code
  const downnloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/html' }); // Changed type to text/html
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#111",
      borderColor: "#333",
      color: "#fff",
      boxShadow: "none",
      "&:hover": { borderColor: "#555" }
    }),
    menu: (base) => ({ ...base, backgroundColor: "#111", color: "#fff" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#333" : state.isFocused ? "#222" : "#111",
      color: "#fff",
      "&:active": { backgroundColor: "#444" }
    }),
    singleValue: (base) => ({ ...base, color: "#fff" }),
    placeholder: (base) => ({ ...base, color: "#aaa" }),
    input: (base) => ({ ...base, color: "#fff" })
  };


  return (
    <>
      <Navbar />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 lg:px-16">
        {/* Left Section */}
        <div className="w-full py-6 rounded-xl bg-[#141319] mt-5 p-5">
          <h3 className='text-2xl lg:text-3xl font-semibold sp-text bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600'>AI Component Generator</h3>
          <p className='text-gray-400 mt-2 text-base'>Describe your component and let AI code it for you.</p>

          <p className='text-sm font-bold mt-4'>Framework</p>
          <Select
            className='mt-2'
            options={options}
            value={frameWork}
            styles={selectStyles}
            onChange={(selected) => setFrameWork(selected)}
          />

          <p className='text-sm font-bold mt-5'>Describe your component</p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className='w-full min-h-[200px] rounded-xl bg-[#09090B] mt-3 p-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 resize-none'
            placeholder="e.g., A modern, responsive pricing table with three tiers..."
          ></textarea>

          <div className="flex items-center justify-between mt-3">
            <p className='text-gray-400 text-sm'>Click generate to get your code.</p>
            <button
              onClick={getResponse}
              disabled={loading}
              className="flex items-center p-3 rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 px-5 gap-2 transition-all hover:opacity-80 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <ClipLoader color='white' size={18} /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative mt-2 lg:mt-5 w-full h-[80vh] bg-[#141319] rounded-xl overflow-hidden">
          {
            !outputScreen ? (
              <div className="w-full h-full flex items-center flex-col justify-center text-center p-4">
                <div className="p-5 w-[70px] flex items-center justify-center text-3xl h-[70px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600">
                  <HiOutlineCode />
                </div>
                <p className='text-base text-gray-400 mt-3'>Your component code will appear here.</p>
              </div>
            ) : (
              <>
                <div className="bg-[#17171C] w-full h-[50px] flex items-center gap-3 px-3">
                  <button
                    onClick={() => setTab(1)}
                    className={`w-1/2 py-2 rounded-lg transition-all ${tab === 1 ? "bg-purple-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setTab(2)}
                    className={`w-1/2 py-2 rounded-lg transition-all ${tab === 2 ? "bg-purple-600 text-white" : "bg-zinc-800 text-gray-300"}`}
                  >
                    Preview
                  </button>
                </div>

                <div className="bg-[#17171C] w-full h-[50px] flex items-center justify-between px-4 border-t border-zinc-800">
                  <p className='font-bold text-gray-200'>
                    {tab === 1 ? "Code Editor" : "Live Preview"}
                  </p>
                  <div className="flex items-center gap-2">
                    {tab === 1 ? (
                      <>
                        <button onClick={copyCode} title="Copy Code" className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333] transition-colors"><IoCopy /></button>
                        <button onClick={downnloadFile} title="Download File" className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333] transition-colors"><PiExportBold /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setIsNewTabOpen(true)} title="Open in New Tab" className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333] transition-colors"><ImNewTab /></button>
                        <button onClick={() => setRefreshKey(prev => prev + 1)} title="Refresh Preview" className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center hover:bg-[#333] transition-colors"><FiRefreshCcw /></button>
                      </>
                    )}
                  </div>
                </div>

                <div className="h-[calc(100%-100px)]">
                  {tab === 1 ? (
                    <Editor value={code} height="100%" theme='vs-dark' language="html" options={{ readOnly: true }} />
                  ) : (
                    <iframe key={refreshKey} srcDoc={code} title="Preview" className="w-full h-full bg-white text-black"></iframe>
                  )}
                </div>
              </>
            )
          }
        </div>
      </div>

      {isNewTabOpen && (
        <div className="fixed inset-0 bg-white w-full h-full overflow-auto z-50">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-5 bg-gray-100 border-b">
            <p className='font-bold'>Fullscreen Preview</p>
            <button onClick={() => setIsNewTabOpen(false)} className="w-10 h-10 rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-200">
              <IoCloseSharp />
            </button>
          </div>
          <iframe srcDoc={code} title="Fullscreen Preview" className="w-full h-[calc(100vh-60px)]"></iframe>
        </div>
      )}
    </>
  )
}

export default Home;
