

// json-server --watch db.json --port 3000
// run this before 
// after this copy path of the file and run it in browser



let apiUrl = "http://localhost:3000/bmi";

$(document).ready(function () {
  
  $("#form").submit(function (e) {
    e.preventDefault(); 

    const name = $("#name").val().trim();
    const date = $("#date").val();
    const weight = parseFloat($("#weight").val());
    const height = parseFloat($("#height").val());

    if (!name || !date || isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      $("#result").html("Please fill all fields with valid values.");
      return;
    }

    const bmi = (weight / ((height / 100) ** 2)).toFixed(2);
    let category = "";

    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 24.9) category = "Normal weight";
    else if (bmi < 29.9) category = "Overweight";
    else category = "Obese";

    const resultText = `
      <strong>${name}</strong>, your BMI is <strong>${bmi}</strong><br>
      Category: <strong>${category}</strong>
    `;
    $("#result").html(resultText);

    
    $.ajax({
      url: apiUrl,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ name, date, weight, height, bmi, category }),
      success: function () {
        console.log("Data saved to server");
        fetchHistory(name);
      },
      error: function () {
        console.error("Error saving data to server");
        $("#result").append("<br>Failed to save to server.");
      }
    });
  });

  
  function fetchHistory(name) {
    $.ajax({
      url: `${apiUrl}?name=${encodeURIComponent(name)}`,
      method: "GET",
      success: function (data) {
        if (data.length === 0) {
          $("#history").html("<p>No previous records found.</p>");
          return;
        }
  
        let table = `
  <h3>${name}'s BMI History</h3>
  <table class="history-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Weight (kg)</th>
        <th>Height (cm)</th>
        <th>BMI</th>
        <th>Category</th>
      </tr>
    </thead>
    <tbody>
`;

  
        data.forEach(function (entry) {
          table += `
            <tr>
              <td>${entry.date}</td>
              <td>${entry.weight}</td>
              <td>${entry.height}</td>
              <td>${entry.bmi}</td>
              <td>${entry.category}</td>
            </tr>
          `;
        });
  
        table += "</tbody></table>";
        $("#history").html(table);
      },
      error: function () {
        console.error("Error fetching history");
        $("#history").html("<p>Failed to load history.</p>");
      }
    });
  }
  
});
