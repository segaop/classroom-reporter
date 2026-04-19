let currentFilter = "All";

const issueForm = document.getElementById("issueForm");

if (issueForm) {
  issueForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const classroom = document.getElementById("classroom").value.trim();
    const issueType = document.getElementById("issueType").value;
    const description = document.getElementById("description").value.trim();
    const priority = document.getElementById("priority").value;

    const newIssue = {
      id: Date.now(),
      classroom,
      issueType,
      description,
      priority,
      status: "Pending",
      time: new Date().toLocaleString()
    };

    const issues = JSON.parse(localStorage.getItem("issues")) || [];
    issues.push(newIssue);
    localStorage.setItem("issues", JSON.stringify(issues));

    alert("Issue submitted successfully!");
    issueForm.reset();
  });
}

function getStatusClass(status) {
  if (status === "Pending") return "pending";
  if (status === "In Progress") return "inprogress";
  if (status === "Resolved") return "resolved";
  return "";
}

function setFilter(filter) {
  currentFilter = filter;
  loadIssues();
}

function loadIssues() {
  const issueList = document.getElementById("issueList");
  if (!issueList) return;

  let issues = JSON.parse(localStorage.getItem("issues")) || [];
  const searchValue = document.getElementById("searchInput").value.toLowerCase();

  const totalCount = document.getElementById("totalCount");
  const pendingCount = document.getElementById("pendingCount");
  const resolvedCount = document.getElementById("resolvedCount");

  totalCount.textContent = issues.length;
  pendingCount.textContent = issues.filter(issue => issue.status === "Pending").length;
  resolvedCount.textContent = issues.filter(issue => issue.status === "Resolved").length;

  if (currentFilter !== "All") {
    issues = issues.filter(issue => issue.status === currentFilter);
  }

  if (searchValue) {
    issues = issues.filter(issue =>
      issue.classroom.toLowerCase().includes(searchValue)
    );
  }

  issueList.innerHTML = "";

  if (issues.length === 0) {
    issueList.innerHTML = "<p>No issues found.</p>";
    return;
  }

  issues.forEach(issue => {
    issueList.innerHTML += `
      <div class="issue-card">
        <h3>${issue.issueType}</h3>
        <p><strong>Classroom:</strong> ${issue.classroom}</p>
        <p><strong>Description:</strong> ${issue.description}</p>
        <p><strong>Priority:</strong> ${issue.priority}</p>
        <p><strong>Time:</strong> ${issue.time}</p>
        <p>
          <strong>Status:</strong>
          <span class="badge ${getStatusClass(issue.status)}">${issue.status}</span>
        </p>
        <label>Update Status</label>
        <select onchange="updateStatus(${issue.id}, this.value)">
          <option value="Pending" ${issue.status === "Pending" ? "selected" : ""}>Pending</option>
          <option value="In Progress" ${issue.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Resolved" ${issue.status === "Resolved" ? "selected" : ""}>Resolved</option>
        </select>
      </div>
    `;
  });
}

function updateStatus(id, newStatus) {
  let issues = JSON.parse(localStorage.getItem("issues")) || [];

  issues = issues.map(issue => {
    if (issue.id === id) {
      issue.status = newStatus;
    }
    return issue;
  });

  localStorage.setItem("issues", JSON.stringify(issues));
  loadIssues();
}

function loadHistory() {
  const historyList = document.getElementById("historyList");
  if (!historyList) return;

  let issues = JSON.parse(localStorage.getItem("issues")) || [];
  issues = issues.filter(issue => issue.status === "Resolved");

  historyList.innerHTML = "";

  if (issues.length === 0) {
    historyList.innerHTML = "<p>No resolved issues yet.</p>";
    return;
  }

  issues.forEach(issue => {
    historyList.innerHTML += `
      <div class="issue-card">
        <h3>${issue.issueType}</h3>
        <p><strong>Classroom:</strong> ${issue.classroom}</p>
        <p><strong>Description:</strong> ${issue.description}</p>
        <p><strong>Priority:</strong> ${issue.priority}</p>
        <p><strong>Resolved Time:</strong> ${issue.time}</p>
        <p>
          <strong>Status:</strong>
          <span class="badge resolved">${issue.status}</span>
        </p>
      </div>
    `;
  });
}