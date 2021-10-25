import React, { useState, useEffect } from 'react';
import './App.css';
import { API, Storage, Auth, Hub } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut, AmplifyS3Image } from '@aws-amplify/ui-react';
import { listFiles } from './graphql/queries';
import { createFile as createFileMutation, deleteFile as deleteFileMutation, updateFile as updateFileMutation } from './graphql/mutations';

// see https://docs.amplify.aws/lib/storage/configureaccess/q/platform/js/
Storage.configure({ level: 'private' });

function App() {

  var initialFormState = { fileName: '', description: '', fileUploadTime: '', userFirstName: '' };

  const listener = (data) => {
    switch (data.payload.event) {
      case 'signIn':
        console.info('user signed in');
        break;
      case 'signOut':
        console.info('user signed out');
        break;
      case 'signIn_failure':
        console.error('user sign in failed');
        break;
      case 'configured':
        console.info('the Auth module is configured');
        break;
      default:
        console.error('unknown event: ', data.payload.event);
    }
  }
  Hub.listen('auth', listener);

  const [userData, setUserData] = useState({ payload: { username: '' } });
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchFiles();
  }, []);

  async function fetchUserData() {
    await Auth.currentAuthenticatedUser()
      .then((userSession) => {
        console.log("userData: ", userSession);
        setUserData(userSession.signInUserSession.accessToken);
      })
      .catch((e) => console.log("Not signed in", e));
  }

  async function fetchFiles() {
    try {
      const apiData = await API.graphql({ query: listFiles });
      const filesFromAPI = apiData.data.listFiles.items;
      await Promise.all(filesFromAPI.map(async file => {
        const content = await Storage.get(file.fileName);
        file.content = content;
        return file;
      }))
      setFiles(apiData.data.listFiles.items);
      Storage.list('', { level: 'private' })
        .then(result => console.log(result))
        .catch(err => console.log(err));
    } catch (e) {
      console.error('error fetching files', e);
      setErrorMessages(e.errors);
    }
  }

  async function createFile() {
    if (!formData.fileName || !formData.fileUploadTime || !formData.contentType) return;
    await API.graphql({ query: createFileMutation, variables: { input: formData } });
    await Storage.put(formData.fileName, content);
    fetchFiles();
    setFormData(initialFormState);
  }

  async function updateFile(file) {
    await API.graphql({ query: updateFileMutation, variables: { input: file } });
    fetchFiles();
  }

  async function deleteFile(file) {
    await API.graphql({ query: deleteFileMutation, variables: { input: { id: file.id } } });
    await Storage.remove(file.fileName);
    fetchFiles();
  }

  async function onFileChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, contentType: file.type, fileName: file.name, fileUploadTime: new Date() });
    setContent(file);
  }

  function isAdmin() {
    return userData.payload['cognito:groups'] && userData.payload['cognito:groups'][0] === "Admins";
  }

  function userInfo() {
    return (
      <>
        {userData.payload.username} <div className="badge">{isAdmin() ? "Admin" : "User"}</div>
      </>
    );
  }

  // date formatter
  const df = new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' });

  return (
    <div className="App">
      <h1>Sarinder Virk - CMPE281 Project#1 - Files App</h1>
      { userInfo()}
      <hr />
      <input
        readOnly
        placeholder="File Upload Time"
        value={formData.fileUploadTime}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value })}
        placeholder="File description"
        value={formData.description}
      />
      <input
        type="file"
        onChange={onFileChange}
      />
      <button onClick={createFile}>Create File</button>
      <hr />
      <div style={{ marginBottom: 30 }}>
        {
          errorMessages && (errorMessages.map((err, i) => <p key={i} class='err'> {err.message} </p>))
        }
        <table>
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>User Name</th>
              <th>File Name</th>
              <th>Description</th>
              <th>Updated</th>
              <th>Uploaded</th>
              <th>Download</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              files.sort((a, b) => a.updatedAt > b.updatedAt ? 1 : -1).map(file => (
                <tr key={file.id}>
                  {/* <td>{file.id}</td> */}
                  <td>{file.owner}</td>
                  <td>{file.fileName}</td>
                  <td><input type="text" onKeyDown={updateFile} defaultValue={file.description}/></td>
                  <td>{df.format(new Date(file.updatedAt))}</td>
                  <td>{df.format(new Date(file.fileUploadTime))}</td>
                  <td>
                    {
                      file.content && <a href={file.content} download={file.fileName}>
                        {
                          file.contentType.startsWith('image/') ? <AmplifyS3Image level="private" imgKey={file.fileName} alt={file.fileName} /> : <>{file.fileName}</>
                        }
                      </a>
                    }
                  </td>
                  <td><button onClick={() => deleteFile(file)}>Delete file</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
