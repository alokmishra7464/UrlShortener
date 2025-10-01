import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react"; // import QR component

function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [qrUrl, setQrUrl] = useState(null); // track which QR is open

  // Fetch user's URLs
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/url/my-urls", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUrls(res.data);
      } catch (err) {
        console.error("Error fetching URLs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  // Handle new URL submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/url/shorten",
        { originalUrl: newUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUrls((prev) => [...prev, res.data]);
      setNewUrl("");
    } catch (err) {
      console.error("Error creating short URL", err);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/url/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUrls((prev) => prev.filter((url) => url._id !== id));
    } catch (err) {
      console.error("Error deleting URL", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Shortened URLs</h2>

      {/* Create new URL form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter original URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          style={{ width: "70%", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 12px", marginLeft: "10px" }}>
          Shorten
        </button>
      </form>

      {/* Display URLs */}
      {urls.length === 0 ? (
        <p>No URLs yet. Create one!</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>Original URL</th>
              <th>Short URL</th>
              <th>Clicks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <tr key={url._id}>
                <td>
                  <a href={url.originalUrl} target="_blank" rel="noreferrer">
                    {url.originalUrl}
                  </a>
                </td>
                <td>
                  <a href={url.shortUrl} target="_blank" rel="noreferrer">
                    {url.shortUrl}
                  </a>
                </td>
                <td>{url.clicks}</td>
                <td>
                  <button
                    onClick={() => handleDelete(url._id)}
                    style={{ color: "red", padding: "5px 10px", marginRight: "5px" }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setQrUrl(url.shortUrl)}
                    style={{ padding: "5px 10px" }}
                  >
                    QR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Show QR Code */}
      {qrUrl && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h3>QR Code for: {qrUrl}</h3>
          <QRCodeCanvas value={qrUrl} size={200} />
          <br />
          <button onClick={() => setQrUrl(null)} style={{ marginTop: "10px" }}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
