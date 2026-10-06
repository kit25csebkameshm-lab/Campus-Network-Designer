# Campus Network Designer

> **Interactive campus network optimization using Prim's Minimum Spanning Tree algorithm.**

Campus Network Designer is a polished, browser-based DAA application that helps plan a cost-efficient campus network. Add buildings, define possible cable connections and costs, then let **Prim's algorithm** generate the minimum spanning tree.

## ✨ Highlights

- Interactive network topology visualization
- Real Prim's MST algorithm — not a mock result
- Add / remove campus buildings
- Add / remove weighted connections
- Minimum network cost calculation
- Savings compared with all available connections
- Disconnected-network validation
- Responsive dark UI
- Demo campus data for instant presentation
- Zero build tools or dependencies

## 🧠 DAA Concept

The campus is represented as a **weighted undirected graph**:

| Real-world object | Graph representation |
|---|---|
| Campus building | Vertex |
| Possible cable route | Edge |
| Installation cost | Edge weight |
| Optimized campus network | Minimum Spanning Tree |

Prim's algorithm starts from one vertex and repeatedly selects the cheapest edge that expands the connected set without forming a cycle.

### Complexity

- **Time:** `O(V²)` using the adjacency/scan style implementation
- **Space:** `O(V²)` for graph data in the conceptual model
- **MST edges:** `V - 1`

## 🚀 Run in 30 seconds

No Node.js, Java, Maven or database is required.

1. Download / clone this repository.
2. Open `index.html` in a browser.
3. Click **Load Demo** to see the complete application.
4. Or add your own buildings and connections.
5. Click **Design Minimum Network**.

For the best GitHub presentation, enable **GitHub Pages** and publish the root folder.

## 📁 Project Structure

```text
Campus-Network-Designer/
├── index.html
├── style.css
├── app.js
├── README.md
└── screenshots/
```

## 🖥️ Application Flow

```text
Add Buildings
      ↓
Add Weighted Connections
      ↓
Build Graph
      ↓
Run Prim's Algorithm
      ↓
Select Minimum-Cost Edges
      ↓
Generate MST
      ↓
Visualize + Calculate Cost + Savings
```

## 🎓 Academic Value

This project demonstrates practical use of:

- Graphs
- Weighted undirected graphs
- Minimum Spanning Trees
- Greedy algorithms
- Prim's algorithm
- Algorithm complexity
- Data visualization
- Interactive application design

## 🔮 Future Enhancements

- Spring Boot REST backend
- MySQL persistence
- User authentication
- Export network plan as PDF
- Dijkstra-based cable route analysis
- Failure simulation and backup links
- Campus map integration
- Cost per meter and cable quantity estimation
- Admin dashboard

## 👨‍💻 Author

**Kamesh**  
CSE Student — Kalaignarkarunanidhi Institute of Technology, Coimbatore

## 📜 License

Educational project created for academic and portfolio purposes.
