const serverUrl = process.env.REACT_APP_SERVER_URL;

export async function getCodeBlockById(id) {
  try {
    const response = await fetch(`${serverUrl}/api/codeblocks/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function updateCodeBlockById(id, updatedData) {
  try {
    const response = await fetch(`${serverUrl}/api/codeblocks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    const updatedBlock = await response.json();
    return updatedBlock;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function resetDatabase() {
  try {
    const response = await fetch(`${serverUrl}/api/reset`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function getAllCodeBlocks() {
  try {
    const response = await fetch(`${serverUrl}/api/codeblocks`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
