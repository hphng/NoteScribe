import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Fetch audio data with only ID and document name
    const getAudioData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/audio/metadata');
        const data = response.data;
        setDocuments(data);  // Save the data to state
      } catch (error) {
        console.error('Error fetching documents:', error.message);
      }
    };
    getAudioData();
  }, []);

  const handleClick = (id) => {
    // Handle the button click (for example, navigate to a details page)
    console.log(`Document with ID ${id} clicked`);
    // You can redirect or trigger more actions here
  };

  return (
    <div className="min-h-screen py-10 flex items-center justify-center">
      <div className="w-[60%] mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Document List</h1>
        <ul className="divide-y divide-gray-200">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <li key={doc._id}>
                <button
                  onClick={() => handleClick(doc._id)}
                  className="w-full relative text-left py-4 px-4 mb-1 flex justify-between items-center bg-white rounded-lg 
                          hover:bg-blue-100 transition-colors duration-200 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-100"
                >
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{doc.documentName}</h2>
                    <p className="text-sm text-gray-500">ID: {doc._id}</p>
                  </div>
                </button>
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
