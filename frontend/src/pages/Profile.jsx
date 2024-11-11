import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Description, Field, Fieldset, Input, Label, Legend, Select, Textarea } from '@headlessui/react'
import defaultImage from '../assets/default_avatar.jpg'

const Profile = () => {
    const { user } = useContext(AuthContext);

    const handleSave = () => {
        console.log('Saving user information...');
    }

    const handleCancel = () => {
        console.log('Canceling changes...');
    }
    return (
        <main className="min-h-screen flex flex-col items-center justify-center mt-16">
            <Fieldset className="relative w-full max-w-md p-6 bg-white border-2 border-black rounded-lg shadow-md shadow-orange-500 ">
                <img
                    src={user?.photo || defaultImage}
                    alt="Profile"
                    className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-32 
                              aspect-square rounded-full mx-auto mb-4 border-2 border-black shadow-md shadow-orange-500"
                />
                <div className='blank-space-for-profile-image w-full h-16'></div>
                <Legend className="text-lg font-bold text-orange-500 text-center mb-8">User Information</Legend>
                <Field className="flex flex-col items-center mb-3">
                    <Label className="block">First Name</Label>
                    <Input
                        className="mt-1 block ml-3 border border-gray-300 rounded-md px-3 py-2 w-full 
                                    outline-none focus:outline-none focus:border-1 focus:border-orange-500"
                        name="firstname"
                        placeholder='First Name'
                        value={user?.firstname || ""}
                    />
                </Field>
                <Field className="flex flex-col items-center mb-3">
                    <Label className="block">Last Name</Label>
                    <Input
                        className="mt-1 block ml-3 border border-gray-300 rounded-md px-3 py-2 w-full 
                                    outline-none focus:outline-none focus:border-1 focus:border-orange-500"
                        name="lastname"
                        placeholder='Last Name'
                        value={user?.lastname || ""}
                    />
                </Field>

                <Field className="flex flex-col items-center mb-3">
                    <Label className="block">Display Name</Label>
                    <Input
                        className="mt-1 block ml-3 border border-gray-300 rounded-md px-3 py-2 w-full 
                                outline-none focus:outline-none focus:border-1 focus:border-orange-500"
                        name="username"
                        value={user?.name || ""} />
                </Field>

                <Field className="flex flex-col items-center mb-3">
                    <Label className="block">Email</Label>
                    <Input
                        className="mt-1 block ml-3 border border-gray-300 rounded-md px-3 py-2 w-full 
                                outline-none focus:outline-none focus:border-1 focus:border-orange-500"
                        name="email"
                        value={user?.email || ""}
                    />
                </Field>
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 shadow-md duration-200"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 shadow-md duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </Fieldset>
        </main>
    );
};

export default Profile;
