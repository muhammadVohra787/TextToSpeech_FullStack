import React, { useEffect, useState } from 'react';

const ProfilePage = () => {
  useEffect(() => {
    document.body.style.backgroundColor = 'white';
    document.body.style.color = 'black';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.minHeight = '100vh';

    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      document.body.style.display = '';
      document.body.style.justifyContent = '';
      document.body.style.alignItems = '';
      document.body.style.minHeight = '';
    };
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);

  const handleUpdate = () => {
    setTempName(name);
    setTempEmail(email);
    setIsEditing(true);
  };

  const handleSave = () => {
    setName(tempName);
    setEmail(tempEmail);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(name);
    setTempEmail(email);
    setIsEditing(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100vh', width: '100vw', paddingTop: '50px' }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
        padding: '20px',
        background: 'white',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px'
      }}>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png" 
          alt="User Profile" 
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            marginBottom: '20px'
          }} 
        />

        {/* Name Field */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', color: 'black', marginBottom: '5px' }}>
            Name
          </label>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              backgroundColor: isEditing ? 'white' : '#F3F4F6',
              color: 'black',
              textAlign: 'center',
              outline: 'none',
              cursor: isEditing ? 'text' : 'default'
            }}
          />
        </div>

        {/* Email Field */}
        <div>
          <label style={{ display: 'block', fontSize: '16px', fontWeight: 'bold', color: 'black', marginBottom: '5px' }}>
            Email
          </label>
          <input
            type="email"
            value={tempEmail}
            onChange={(e) => setTempEmail(e.target.value)}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              backgroundColor: isEditing ? 'white' : '#F3F4F6',
              color: 'black',
              textAlign: 'center',
              outline: 'none',
              cursor: isEditing ? 'text' : 'default'
            }}
          />
        </div>

        {/* Buttons */}
        <div style={{ marginTop: '20px' }}>
          {!isEditing ? (
            <button
              onClick={handleUpdate}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: '#6B46C1',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'background 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#553C9A'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6B46C1'}
            >
              Update
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: '#38A169',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease',
                  marginRight: '10px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2F855A'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#38A169'}
              >
                Save
              </button>

              <button
                onClick={handleCancel}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: '#E53E3E',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#C53030'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#E53E3E'}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
