// Variabel global
let employeeCount = 1;

// Fungsi untuk memperbarui total bobot
function updateTotalWeight() {
    const totalClosing = parseInt(document.getElementById('total-closing').value) || 0;
    const revenue = parseInt(document.getElementById('revenue').value) || 0;
    const clientSatisfaction = parseInt(document.getElementById('client-satisfaction').value) || 0;
    
    const total = totalClosing + revenue + clientSatisfaction;
    document.getElementById('total-weight').textContent = total;
    
    if (total !== 100) {
        document.getElementById('total-weight').style.color = 'red';
    } else {
        document.getElementById('total-weight').style.color = 'green';
    }
}

// Fungsi untuk menambah karyawan
function addEmployee() {
    employeeCount++;
    const employeeDiv = document.createElement('div');
    employeeDiv.className = 'employee-row';
    employeeDiv.innerHTML = `
        <h3>Karyawan ${employeeCount}</h3>
        <div class="criteria-input">
            <label for="emp${employeeCount}-name">Nama:</label>
            <input type="text" id="emp${employeeCount}-name" placeholder="Nama Karyawan">
        </div>
        <div class="criteria-input">
            <label for="emp${employeeCount}-total-closing">Jumlah Closing:</label>
            <input type="number" id="emp${employeeCount}-total-closing" min="0" value="12">
            <span class="tooltip">❓
                <span class="tooltiptext">Jumlah closing dalam bulan ini</span>
            </span>
        </div>
        <div class="criteria-input">
            <label for="emp${employeeCount}-revenue">Total Revenue (Juta):</label>
            <input type="number" id="emp${employeeCount}-revenue" min="0" value="180">
            <span class="tooltip">❓
                <span class="tooltiptext">Total revenue dalam juta rupiah</span>
            </span>
        </div>
        <div class="criteria-input">
            <label for="emp${employeeCount}-client-satisfaction">Kepuasan Klien (1-100):</label>
            <input type="number" id="emp${employeeCount}-client-satisfaction" min="1" max="100" value="80">
            <span class="tooltip">❓
                <span class="tooltiptext">Nilai kepuasan klien dari 1-100</span>
            </span>
        </div>
    `;
    document.getElementById('employees-container').appendChild(employeeDiv);
}

// Fungsi untuk menghitung bonus
function calculateBonus() {
    // Validasi bobot
    const totalClosingWeight = parseInt(document.getElementById('total-closing').value) || 0;
    const revenueWeight = parseInt(document.getElementById('revenue').value) || 0;
    const clientSatisfactionWeight = parseInt(document.getElementById('client-satisfaction').value) || 0;
    
    if (totalClosingWeight + revenueWeight + clientSatisfactionWeight !== 100) {
        alert('Total bobot harus 100%. Silakan periksa kembali nilai bobot kriteria.');
        return;
    }
    
    // Ambil data karyawan
    const employees = [];
    for (let i = 1; i <= employeeCount; i++) {
        const name = document.getElementById(`emp${i}-name`).value || `Karyawan ${i}`;
        const totalClosing = parseInt(document.getElementById(`emp${i}-total-closing`).value) || 0;
        const revenue = parseInt(document.getElementById(`emp${i}-revenue`).value) || 0;
        const clientSatisfaction = parseInt(document.getElementById(`emp${i}-client-satisfaction`).value) || 0;
        
        employees.push({
            name,
            totalClosing,
            revenue,
            clientSatisfaction
        });
    }
    
    // Normalisasi matriks keputusan
    const maxTotalClosing = Math.max(...employees.map(emp => emp.totalClosing));
    const maxRevenue = Math.max(...employees.map(emp => emp.revenue));
    const maxClientSatisfaction = Math.max(...employees.map(emp => emp.clientSatisfaction));
    
    // Hitung nilai preferensi (V) untuk setiap karyawan
    employees.forEach(emp => {
        emp.normalizedTotalClosing = emp.totalClosing / maxTotalClosing;
        emp.normalizedRevenue = emp.revenue / maxRevenue;
        emp.normalizedClientSatisfaction = emp.clientSatisfaction / maxClientSatisfaction;
        
        // Hitung nilai akhir
        emp.finalScore = (
            emp.normalizedTotalClosing * (totalClosingWeight / 100) +
            emp.normalizedRevenue * (revenueWeight / 100) +
            emp.normalizedClientSatisfaction * (clientSatisfactionWeight / 100)
        );
        
        // Tentukan bonus berdasarkan nilai akhir
        if (emp.finalScore >= 0.9) {
            emp.bonus = '20% dari Gaji';
            emp.recommendation = 'Sangat Direkomendasikan';
            emp.bonusClass = 'ranking-1';
        } else if (emp.finalScore >= 0.8) {
            emp.bonus = '15% dari Gaji';
            emp.recommendation = 'Direkomendasikan';
            emp.bonusClass = 'ranking-2';
        } else if (emp.finalScore >= 0.7) {
            emp.bonus = '10% dari Gaji';
            emp.recommendation = 'Cukup Direkomendasikan';
            emp.bonusClass = 'ranking-3';
        } else if (emp.finalScore >= 0.6) {
            emp.bonus = '5% dari Gaji';
            emp.recommendation = 'Pertimbangkan';
            emp.bonusClass = '';
        } else {
            emp.bonus = 'Tidak ada bonus';
            emp.recommendation = 'Tidak Direkomendasikan';
            emp.bonusClass = '';
        }
    });
    
    // Urutkan karyawan berdasarkan nilai tertinggi
    employees.sort((a, b) => b.finalScore - a.finalScore);
    
    // Tampilkan hasil
    displayResults(employees);
}

// Fungsi untuk menampilkan hasil
function displayResults(employees) {
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Peringkat</th>
                    <th>Nama Karyawan</th>
                    <th>Jumlah Closing</th>
                    <th>Total Revenue (Juta)</th>
                    <th>Kepuasan Klien</th>
                    <th>Skor Akhir</th>
                    <th>Rekomendasi Bonus</th>
                    <th>Keterangan</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    employees.forEach((emp, index) => {
        tableHTML += `
            <tr class="${emp.bonusClass}">
                <td>${index + 1}</td>
                <td>${emp.name}</td>
                <td>${emp.totalClosing}</td>
                <td>${emp.revenue}</td>
                <td>${emp.clientSatisfaction}</td>
                <td>${emp.finalScore.toFixed(3)}</td>
                <td>${emp.bonus}</td>
                <td>${emp.recommendation}</td>
            </tr>
        `;
    });
    
    tableHTML += `</tbody></table>`;
    
    document.getElementById('result-table').innerHTML = tableHTML;
    document.getElementById('result-section').style.display = 'block';
    
    // Scroll ke hasil
    document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    updateTotalWeight();
});