import React from 'react';
import { useGetAllUsersQuery, useDeleteUserMutation } from '../api/users';

export default function UsersList() {
  const { data: users = [], isLoading, isError } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  if (isLoading) return <p>טוען נתונים...</p>;
  if (isError) return <p>שגיאה בטעינה</p>;

  return (
    <div>
      <h2>רשימת משתמשים</h2>
      {users.map(user => (
        <div key={user.id}>
          {user.fname} {user.lname} - {user.Email}
          <button onClick={() => deleteUser(user.id)}>🗑️</button>
        </div>
      ))}
    </div>
  );
}