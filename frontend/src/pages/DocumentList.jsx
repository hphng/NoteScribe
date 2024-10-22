import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  // const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const baseURL = 'http://localhost:5000';

  useEffect(() => {
    // Fetch audio data with only ID and document name
    const getAudioData = async () => {
      try {
        console.log(baseURL)
        const response = await axios.get(`${baseURL}/api/audio/metadata`);
        const data = response.data;
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error.message);
      }
    };
    getAudioData();
  }, []);

  const handleClick = (audioId) => {
    console.log(`Document with ID ${audioId} clicked`);
    navigate(`/a/${audioId}`);
  };

  const handleDelete = async (audioId) => {
    // Delete document with ID
    const document = await axios.delete(`/api/audio/${audioId}`);
    console.log(document.data);
    setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc._id !== audioId));
  };

  return (
    <div className="min-h-screen py-10 flex items-center justify-center">
      <div className="w-[60%] mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Document List</h1>
        <ul className="divide-y divide-gray-200">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <li key={doc._id}>
                <div
                  onClick={() => handleClick(doc._id)}
                  className="w-full relative text-left py-4 px-4 mb-1 flex justify-between items-center bg-white rounded-lg 
                          hover:bg-blue-100 transition-colors duration-200 group
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-100 cursor-pointer"
                >
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{doc.documentName}</h2>
                    <p className="text-sm text-gray-500">ID: {doc._id}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc._id);
                    }}
                    className="ml-4 px-4 py-2 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li className="text-center py-4 text-gray-500">No documents found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DocumentList;
