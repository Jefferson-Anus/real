import React, { useState } from "react";


const WebWorkPage = () => {
 const [users, setUsers] = useState([
   {
     name: "Bob",
     email: "bob@example.com",
     role: "code",
     progress: 20,
     color: "#3B82F6",
     tasks: [
       { task: "Task 1", completed: true },
       { task: "Task 2", completed: false },
     ],
   },
   {
     name: "Asdf",
     email: "asdf@example.com",
     role: "read",
     progress: 50,
     color: "#8B5CF6",
     tasks: [
       { task: "Task 3", completed: true },
       { task: "Task 4", completed: true },
     ],
   },
   {
     name: "babi",
     email: "babi@example.com",
     role: "edit",
     progress: 30,
     color: "#22C55E",
     tasks: [
       { task: "Task 5", completed: false },
       { task: "Task 6", completed: true },
     ],
   },
 ]);


 const [newUser, setNewUser] = useState({ name: "", email: "", role: "", progress: 0, color: "#3B82F6", tasks: [] });
 const [isFormOpen, setIsFormOpen] = useState(false);
 const [isUserModalOpen, setIsUserModalOpen] = useState(false);
 const [selectedUser, setSelectedUser] = useState(null);


 const handleChange = (e) => {
   setNewUser({ ...newUser, [e.target.name]: e.target.value });
 };


 const addUser = () => {
   if (!newUser.name || !newUser.email || !newUser.role) return;
   setUsers([...users, newUser]);
   setNewUser({ name: "", email: "", role: "", progress: 0, color: "#3B82F6", tasks: [] });
   setIsFormOpen(false);
 };


 const totalProgress = users.reduce((sum, user) => sum + user.progress, 0) / users.length || 0;


 const handleUserClick = (user) => {
   setSelectedUser(user);
   setIsUserModalOpen(true);
 };


 const closeUserModal = () => {
   setIsUserModalOpen(false);
   setSelectedUser(null);
 };


 return (
   <div className="p-6 bg-[#1c1c24] min-h-screen text-white">
     <h2 className="text-2xl mb-4">User List</h2>


     {/* Add User Button */}
     <button
       onClick={() => setIsFormOpen(true)}
       className="mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
     >
       + Add User
     </button>


     {/* Overall Progress Bar */}
     <div className="relative mb-6 bg-gray-700 p-4 rounded-lg">
       <h3 className="text-lg mb-2">Overall Progress</h3>
       <div className="w-full bg-gray-800 rounded-full h-6 flex relative">
         {users.map((user, index) => (
           <div
             key={index}
             style={{
               width: `${user.progress / users.length}%`,
               backgroundColor: user.color,
               borderTopLeftRadius: index === 0 ? "9999px" : "0",
               borderBottomLeftRadius: index === 0 ? "9999px" : "0",
               borderTopRightRadius: index === users.length - 1 ? "9999px" : "0",
               borderBottomRightRadius: index === users.length - 1 ? "9999px" : "0",
             }}
             className="h-6 relative group"
           >
             {/* Tooltip */}
             <div className="absolute hidden group-hover:flex items-center justify-center bg-black text-white text-xs px-2 py-1 rounded-md top-[-30px] left-1/2 transform -translate-x-1/2 whitespace-nowrap">
               {user.name}
             </div>
           </div>
         ))}
       </div>
     </div>




     {/* User List Table */}
     <div className="bg-[#2c2f32] p-4 rounded-lg">
       <h3 className="text-lg mb-3">Current Users</h3>
       <table className="w-full text-left border-collapse">
         <thead>
           <tr className="bg-gray-800">
             <th className="p-2">Name</th>
             <th className="p-2">Email</th>
             <th className="p-2">Role</th>
             <th className="p-2">Color</th>
             <th className="p-2 w-1/3">Progress</th>
           </tr>
         </thead>
         <tbody>
           {users.map((user, index) => (
             <tr
               key={index}
               className="border-t border-gray-600 cursor-pointer"
               onClick={() => handleUserClick(user)}
             >
               <td className="p-2">{user.name}</td>
               <td className="p-2">{user.email}</td>
               <td className="p-2">{user.role}</td>
               <td className="p-2">
                 <div className="w-6 h-6 rounded-full" style={{ backgroundColor: user.color }}></div>
               </td>
               <td className="p-2">
                 <div className="w-full bg-gray-700 rounded-full h-4">
                   <div
                     className="h-4 rounded-full"
                     style={{
                       width: `${user.progress}%`,
                       backgroundColor: user.color,
                     }}
                   ></div>
                 </div>
                 <span className="text-sm">{user.progress}%</span>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>


     {/* Modal for Adding User */}
     {isFormOpen && (
       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
         <div className="bg-[#2c2f32] p-6 rounded-lg w-[400px]">
           <h3 className="text-xl mb-4">Add New User</h3>
           <input
             type="text"
             name="name"
             value={newUser.name}
             onChange={handleChange}
             placeholder="Name"
             className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
           />
           <input
             type="email"
             name="email"
             value={newUser.email}
             onChange={handleChange}
             placeholder="Email"
             className="w-full p-2 mb-2 rounded bg-gray-700 text-white"
           />
           <input
             type="text"
             name="role"
             value={newUser.role}
             onChange={handleChange}
             placeholder="Role"
             className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
           />


           {/* Color Picker */}
           <label className="block text-white mb-1">Choose User Color:</label>
           <div className="flex gap-2 mb-4">
             {["#3B82F6", "#22C55E", "#8B5CF6", "#EF4444", "#EAB308"].map((color) => (
               <button
                 key={color}
                 onClick={() => setNewUser({ ...newUser, color })}
                 className={`w-8 h-8 rounded-full border-2 ${newUser.color === color ? "border-white" : "border-transparent"}`}
                 style={{ backgroundColor: color }}
               />
             ))}
           </div>


           <div className="flex justify-between">
             <button onClick={addUser} className="px-4 py-2 bg-green-500 rounded">Add</button>
             <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 bg-red-500 rounded">Cancel</button>
           </div>
         </div>
       </div>
     )}


     {/* User Info Modal */}
     {isUserModalOpen && selectedUser && (
       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
         <div className="bg-[#2c2f32] p-6 rounded-lg w-[400px]">
           <h3 className="text-xl mb-4">User Info: {selectedUser.name}</h3>
           <p className="text-sm mb-2"><strong>Email:</strong> {selectedUser.email}</p>
           <p className="text-sm mb-2"><strong>Role:</strong> {selectedUser.role}</p>
           <p className="text-sm mb-4"><strong>Progress:</strong> {selectedUser.progress}%</p>


           <h4 className="text-lg mb-2">Assigned Tasks</h4>
           <ul className="list-disc pl-6">
             {selectedUser.tasks.map((task, index) => (
               <li key={index} className="text-sm">
                 {task.task} - <span className={task.completed ? "text-green-500" : "text-red-500"}>{task.completed ? "Completed" : "Pending"}</span>
               </li>
             ))}
           </ul>


           <div className="mt-4 flex justify-end">
             <button onClick={closeUserModal} className="px-4 py-2 bg-red-500 rounded">Close</button>
           </div>
         </div>
       </div>
     )}
   </div>
 );
};


export default WebWorkPage;