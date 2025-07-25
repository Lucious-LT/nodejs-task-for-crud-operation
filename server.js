// server.js
import app from "./app.js"; // Note: include `.js` extension
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
